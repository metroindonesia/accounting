import sqlUtil from '@agung_dhewe/pgsqlc'
import db from '@agung_dhewe/webapps/src/db.js'


const TABLE = {
	paymreq: 'public.paymreq',
	paymreqdetil: 'public.paymreqdetil',
	paymreqtype: 'public.paymreqtype',
	paymtype: 'public.paymtype',
	taxtype: 'public.taxtype',
	struct: 'public.struct',
	partner: 'public.partner',
	partnerbank: 'public.partnerbank',
	partnercontact: 'public.partnercontact',
	site: 'public.site',
	unit: 'public.unit',
	project: 'public.project',
	user: 'core.user',
	auth: 'core.auth',
	currrate: "public.currrate",
	jurnaltype: "public.jurnaltype"

}

const reqOutstandingProcess = ['ap-bill', 'advance-payment']
const reqBillProcess = ['ap-payment']



export async function paymreq_init(self, initialData) {
	const req = self.req
	initialData.setting.defaultCurr = req.app.locals.appConfig.defaultCurr
	initialData.setting.COMPANY_PRINTLOGO = req.app.locals.appConfig.COMPANY_PRINTLOGO


}



export async function headerCreating(self, tx, data, seqdata) {
	// buang data yang tidak boleh dimodif user

	data.paymreq_doc = seqdata.doc;

}

export async function headerListCriteria(self, db, searchMap, criteria, sort, columns, args) {
	const req = self.req
	const user_id = req.session.user.userId

	// criteria.user_id = user_id
	const current_jurnal_id = criteria.current_jurnal_id
	delete criteria.current_jurnal_id

	searchMap.iscommit = 'iscommit = ${iscommit}'
	searchMap.isapproved = 'isapproved = ${isapproved}'
	searchMap.user_id = 'struct_id IN (select struct_id from public.structmember where user_id=${user_id})'
	searchMap.struct_id = 'struct_id = ${struct_id}'
	// searchMap.jurnaltype_id = 'paymreqtype_id IN (select paymreqtype_id from public.jurnaltypepaymreqtype where jurnaltype_id=${jurnaltype_id})'

	const jurnaltype = await sqlUtil.lookupdb(db, TABLE.jurnaltype, 'jurnaltype_id', criteria.jurnaltype_id)


	if (reqOutstandingProcess.includes(jurnaltype.paymreqprocess)) {
		// AP Bill dan Advance Payment
		// tampilkan data PR yang belum diproses
		columns.push('B.*')
		args.tablename = `
			paymreq_outstanding A left join paymreq B on B.paymreq_id = A.paymreq_id 
						left join public.jurnal C on C.paymreq_id = B.paymreq_id 
		`

		if (current_jurnal_id != null) {
			criteria.jurnal_id = current_jurnal_id
			searchMap.jurnal_id = '(C.jurnal_id is null or C.jurnal_id=${jurnal_id})'
		} else {
			criteria.jurnal_id = 1
			searchMap.jurnal_id = 'C.jurnal_id is null'
		}

		searchMap.isapproved = 'isapproved = ${isapproved}'
		searchMap.jurnaltype_id = 'B.paymreqtype_id IN (select paymreqtype_id from public.jurnaltypepaymreqtype where jurnaltype_id=${jurnaltype_id})'


	} else if (reqBillProcess.includes(jurnaltype.paymreqprocess)) {
		// AP Payment
		// tampilkan PR yang sudah dijurnal AP
		columns.push('B.*')
		args.tablename = `
			paymreq_bill A left join paymreq B on B.paymreq_id = A.paymreq_id 
		`
		searchMap.isapproved = 'isapproved = ${isapproved}'
		searchMap.jurnaltype_id = 'B.paymreqtype_id IN (select paymreqtype_id from public.jurnaltypepaymreqtype where jurnaltype_id=${jurnaltype_id})'


	}


}

export async function sequencerSetup(self, tx, sequencer, data, args) {
	// sqlUtil.connect(tx)
	try {
		args.doc_id = 'PREQ'
	} catch (err) {
		throw err
	}
}


export async function headerOpen(self, db, data) {
	sqlUtil.connect(db)

	// dapatkan info untuk paymtype dan paymreqtype
	data.paymtype = await sqlUtil.lookupdb(db, TABLE.paymtype, 'paymtype_id', data.paymtype_id)
	data.paymreqtype = await sqlUtil.lookupdb(db, TABLE.paymreqtype, 'paymreqtype_id', data.paymreqtype_id)


}

export async function headerListRow(self, row, args) {
	const db = args.db
	const curr_id = row.curr_id

	const sql = `select * from ${TABLE.currrate} where curr_id=\${curr_id} and currrate_date<=now() order by currrate_date desc limit 1`
	const data = await db.oneOrNone(sql, { curr_id })

	row.curr_rate = data.currrate_value
	row.curr_date = data.currrate_date

}

export async function detilUpdated(self, tx, ret, data, logMetadata) {
	await updateHeaderValue(self, tx, ret.paymreq_id)
}

export async function detilDeleted(self, tx, deletedRow, logMetadata) {
	await updateHeaderValue(self, tx, deletedRow.paymreq_id)
}

export async function detilCreated(self, tx, ret, data, logMetadata, args) {
	await updateHeaderValue(self, tx, data.paymreq_id)
}


export async function getTotalValue(self, db, body) {
	const { paymreq_id } = body

	sqlUtil.connect(db)

	try {
		const sql = `
			select paymreq_value, paymreq_ppn, paymreq_pph, paymreq_bill, paymreq_total 
			from ${TABLE.paymreq} 
			where paymreq_id=\${paymreq_id}`

		const row = await db.one(sql, { paymreq_id: paymreq_id })
		return row
	} catch (err) {
		throw err
	}
}

export async function commit(self, db, body, paymreq_log) {
	const { paymreq_id } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()

	try {

		const sqlCurent = `
			select paymreq_version, iscommit, isapproved 
			from ${TABLE.paymreq}
			where paymreq_id=\${paymreq_id}`
		const rowCurrent = await db.one(sqlCurent, { paymreq_id: paymreq_id })
		const iscommit = rowCurrent.iscommit

		// perlu cek apa dulu
		if (iscommit) {
			// tidak ada perubahan
			return {
				unchanged: true
			}
		}



		const result = await db.tx(async tx => {
			sqlUtil.connect(tx)

			const data = {
				paymreq_id,
				iscommit: true,
				_commitby: user_id,
				_commitdate: (new Date()).toISOString()
			}

			const cmd = sqlUtil.createUpdateCommand(TABLE.paymreq, data, ['paymreq_id'])
			const ret = await cmd.execute(data)

		})



		// cek hasil commit
		const sql = `
			select paymreq_version, iscommit, _commitby, _commitdate 
			from ${TABLE.paymreq}
			where paymreq_id=\${paymreq_id}`

		const row = await db.one(sql, { paymreq_id: paymreq_id })

		paymreq_log(self, body, startTime, TABLE.paymreq, paymreq_id, 'COMMIT', {}, `version ${row.paymreq_version}`)

		return {
			iscommit: row.iscommit,
			_commitby: row._commitby,
			_commitdate: row._commitdate,
			message: ''
		}
	} catch (err) {
		throw err

	}
}

export async function uncommit(self, db, body, paymreq_log) {
	const { paymreq_id } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()

	try {

		const sqlCurent = `
			select paymreq_version, iscommit, isapproved 
			from ${TABLE.paymreq}
			where paymreq_id=\${paymreq_id}`
		const rowCurrent = await db.one(sqlCurent, { paymreq_id: paymreq_id })
		const iscommit = rowCurrent.iscommit
		const isapproved = rowCurrent.isapproved

		if (!iscommit) {
			// tidak ada perubahan
			return {
				unchanged: true
			}
		}

		if (isapproved) {
			// tidak bisa uncommit data yang sudah diapprove
			throw new Error('tidak bisa un-commit dokument yang sudah diapprove')
		}


		// naikkan versi dokument
		const remark = `update version ${rowCurrent.paymreq_version} -> ${rowCurrent.paymreq_version + 1}`
		const version = rowCurrent.paymreq_version + 1


		const result = await db.tx(async tx => {
			sqlUtil.connect(tx)

			const data = {
				paymreq_id,
				paymreq_version: version,
				iscommit: false,
				_commitby: null,
				_commitdate: null
			}

			const cmd = sqlUtil.createUpdateCommand(TABLE.paymreq, data, ['paymreq_id'])
			const ret = await cmd.execute(data)

		})

		// cek hasil un-commit
		const sql = `
			select paymreq_version, iscommit, _commitby, _commitdate 
			from ${TABLE.paymreq}
			where paymreq_id=\${paymreq_id}`

		const row = await db.one(sql, { paymreq_id: paymreq_id })

		paymreq_log(self, body, startTime, TABLE.paymreq, paymreq_id, 'UNCOMMIT', {}, remark)

		return {
			iscommit: row.iscommit,
			version: row.paymreq_version,
			message: ''
		}
	} catch (err) {
		throw err

	}
}

export async function approve(self, db, body, paymreq_log) {
	const { paymreq_id } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()

	try {
		const sqlCurent = `
			select paymreq_version, struct_id, iscommit, isapproved 
			from ${TABLE.paymreq}
			where paymreq_id=\${paymreq_id}`
		const rowCurrent = await db.one(sqlCurent, { paymreq_id: paymreq_id })
		const iscommit = rowCurrent.iscommit
		const isapproved = rowCurrent.isapproved


		if (isapproved) {
			// tidak ada perubahan
			return {
				unchanged: true
			}
		}

		if (!iscommit) {
			// tidak bisa approve data yang belum di commit
			throw new Error('tidak bisa approve dokumen yang belum dicommit')
		}


		// main process
		// commit jurnal
		const sqlCommit = 'call public.paymreq_approve(${paymreq_id}, ${user_id})'
		await db.none(sqlCommit, {
			paymreq_id: paymreq_id,
			user_id: user_id
		})


		// const result = await db.tx(async tx => {
		// 	sqlUtil.connect(tx)

		// 	const data = {
		// 		paymreq_id,
		// 		isapproved: true,
		// 		_approveby: user_id,
		// 		_approvedate: (new Date()).toISOString()
		// 	}

		// 	const cmd = sqlUtil.createUpdateCommand(TABLE.paymreq, data, ['paymreq_id'])
		// 	const ret = await cmd.execute(data)
		// })

		// cek hasil approval
		const sql = `
			select isapproved, _approveby, _approvedate 
			from ${TABLE.paymreq}
			where paymreq_id=\${paymreq_id}`

		const row = await db.one(sql, { paymreq_id: paymreq_id })

		paymreq_log(self, body, startTime, TABLE.paymreq, paymreq_id, 'APPROVED')


		return {
			isapproved: row.isapproved,
			_approveby: row._approveby,
			_approvedate: row._approvedate,
			message: ''
		}
	} catch (err) {
		throw err

	}
}

export async function reject(self, db, body, paymreq_log) {
	const { paymreq_id, rejectMessage } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()

	try {

		const sqlCurent = `
			select paymreq_version, struct_id, iscommit, isapproved 
			from ${TABLE.paymreq}
			where paymreq_id=\${paymreq_id}`
		const rowCurrent = await db.one(sqlCurent, { paymreq_id: paymreq_id })
		const isapproved = rowCurrent.isapproved

		if (!isapproved) {
			// tidak ada perubahan
			return {
				unchanged: true
			}
		}

		// cek apakah dokument sudah di tarik ke jurnal
		// jika sudah ditarik ke jurnal tidak bisa direject
		// ???

		// main process
		// commit jurnal
		const sqlCommit = 'call public.paymreq_reject(${paymreq_id}, ${user_id})'
		await db.none(sqlCommit, {
			paymreq_id: paymreq_id,
			user_id: user_id
		})

		// const result = await db.tx(async tx => {
		// 	sqlUtil.connect(tx)

		// 	const data = {
		// 		paymreq_id,
		// 		isapproved: false,
		// 		_approveby: null,
		// 		_approvedate: null
		// 	}

		// 	const cmd = sqlUtil.createUpdateCommand(TABLE.paymreq, data, ['paymreq_id'])
		// 	const ret = await cmd.execute(data)
		// })

		// cek hasil approval
		const sql = `
			select isapproved, _approveby, _approvedate 
			from ${TABLE.paymreq}
			where paymreq_id=\${paymreq_id}`

		const row = await db.one(sql, { paymreq_id: paymreq_id })

		paymreq_log(self, body, startTime, TABLE.paymreq, paymreq_id, 'REJECT', {}, rejectMessage)

		return {
			isapproved: row.isapproved,
			message: ''
		}
	} catch (err) {
		throw err

	}
}


export async function getPrintData(self, db, body) {
	const { paymreq_id } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()

	sqlUtil.connect(db)

	const sekarang = new Date();
	const offset = sekarang.getTimezoneOffset() * 60000; // konversi ke milidetik
	const waktuLokalISO = new Date(sekarang - offset).toISOString().slice(0, -1);

	try {
		const header = await sqlUtil.lookupdb(db, TABLE.paymreq, 'paymreq_id', paymreq_id)
		const struct = await sqlUtil.lookupdb(db, TABLE.struct, 'struct_id', header.struct_id)
		const site = await sqlUtil.lookupdb(db, TABLE.site, 'site_id', header.site_id)
		const unit = await sqlUtil.lookupdb(db, TABLE.unit, 'unit_id', header.unit_id)
		const partner = await sqlUtil.lookupdb(db, TABLE.partner, 'partner_id', header.partner_id)
		const partnercontact = await sqlUtil.lookupdb(db, TABLE.partnercontact, 'partnercontact_id', header.partnercontact_id)
		const project = await sqlUtil.lookupdb(db, TABLE.project, 'project_id', header.project_id)
		const user = await sqlUtil.lookupdb(db, TABLE.user, 'user_id', header._createby)
		const auth = await sqlUtil.lookupdb(db, TABLE.auth, 'auth_id', struct.auth_id)
		const authuser = await sqlUtil.lookupdb(db, TABLE.user, 'user_id', auth.user_id)
		const paymtype = await sqlUtil.lookupdb(db, TABLE.paymtype, 'paymtype_id', header.paymtype_id)


		const data = {
			title: 'Advance Request',
			header: {
				printdate: sqlUtil.formatISODate(waktuLokalISO, 'dd/mm/yyyy'),

				paymreq_doc: header.paymreq_doc,
				paymreq_version: header.paymreq_version,
				paymreq_date: sqlUtil.formatISODate(header.paymreq_date, 'dd/mm/yyyy'),
				paymreq_duedate: sqlUtil.formatISODate(header.paymreq_datedue, 'dd/mm/yyyy'),
				paymreq_descr: header.paymreq_descr,
				struct_name: struct.struct_name,
				project_name: project.project_name ?? '-',
				site_name: site.site_name,
				unit_name: unit.unit_name,
				total_value: sqlUtil.formatDecimal(header.paymreq_total, 0),

				partner_name: partner.partner_name,
				partner_bank: '',
				partner_contact: '',

				dibuat_nama: user.user_fullname,

				menyetujui_caption_1: 'Menyetujui',
				menyetujui_title_1: auth.auth_label,
				menyetujui_nama_1: authuser.user_fullname,

				menyetujui_caption_2: 'Menyetujui',
				menyetujui_title_2: 'Direktur',
				menyetujui_nama_2: '',

				menyetujui_caption_3: 'Menyetujui',
				menyetujui_title_3: 'Direktur',
				menyetujui_nama_3: '',
			},

			detil: [
				// { "no": 2, "paymreqdetil_descr": "Biaya Transportasi Tim", "paymreqdetil_value": 75000 },
			]
		}


		// partnerbank
		if (header.partnerbank_id == null) {
			data.header.partner_bank = paymtype.paymtype_name
		} else {
			let partner_bank = '<u>' + paymtype.paymtype_name + '</u><br>'
			partner_bank += header.partnerbank_bankname + '<br>'
			partner_bank += '<b>' + header.partnerbank_account + '</b><br>'
			partner_bank += header.partnerbank_accountname + '<br>'
			data.header.partner_bank = partner_bank
		}


		// partner contact


		// detil
		const sql = `select * from ${TABLE.paymreqdetil} where paymreq_id = \${paymreq_id}`
		const rows = await db.any(sql, { paymreq_id: paymreq_id })
		let i = 0
		for (let row of rows) {
			i++
			data.detil.push({
				no: i,
				paymreqdetil_descr: row.paymreqdetil_descr,
				paymreqdetil_value: sqlUtil.formatDecimal(row.paymreqdetil_value, 0),
			})
		}

		if (header.ppn_id != null) {
			const paymtype = await sqlUtil.lookupdb(db, TABLE.taxtype, 'taxtype_id', header.ppn_id)
			data.detil.push({
				no: ++i,
				paymreqdetil_descr: `<b>PPN</b>`,
				paymreqdetil_value: sqlUtil.formatDecimal(header.paymreq_ppn, 0),
			})
		}


		if (header.pph_id != null) {
			const paymtype = await sqlUtil.lookupdb(db, TABLE.taxtype, 'taxtype_id', header.pph_id)
			data.detil.push({
				no: ++i,
				paymreqdetil_descr: `<b>PPh</b>`,
				paymreqdetil_value: '(' + sqlUtil.formatDecimal(header.paymreq_pph, 0) + ')',
			})
		}


		return data
	} catch (err) {
		throw err
	}
}



async function updateHeaderValue(self, tx, paymreq_id) {
	sqlUtil.connect(tx)


	try {
		const sqlSum = `select sum(paymreqdetil_value) as value from ${TABLE.paymreqdetil} where paymreq_id=\${paymreq_id}`
		const rowSum = await tx.one(sqlSum, { paymreq_id: paymreq_id })
		const value = Number(rowSum.value)

		// ambil data header
		const sqlHead = `select ppn_id, pph_id from ${TABLE.paymreq} where paymreq_id=\${paymreq_id}`
		const rowHead = await tx.one(sqlHead, { paymreq_id: paymreq_id })
		const ppn_id = rowHead.ppn_id
		const pph_id = rowHead.pph_id

		// cek PPN
		let ppnPercent = 0
		if (ppn_id != null) {
			const sqlPPN = `select taxtype_value from ${TABLE.taxtype} where taxtype_id=\${taxtype_id}`
			const rowPPN = await tx.one(sqlPPN, { taxtype_id: ppn_id })
			ppnPercent = rowPPN.taxtype_value

		}

		// cek PPh
		let pphPercent = 0
		if (pph_id != null) {
			const sqlPPh = `select taxtype_value from ${TABLE.taxtype} where taxtype_id=\${taxtype_id}`
			const rowPPh = await tx.one(sqlPPh, { taxtype_id: pph_id })
			pphPercent = rowPPh.taxtype_value
		}


		// hitung 
		const ppnValue = (ppnPercent / 100) * value
		const pphValue = (pphPercent / 100) * value
		const bill = value + ppnValue
		const total = value + ppnValue - pphValue


		// update ke header
		const data = {
			paymreq_id: paymreq_id,
			paymreq_value: value,
			paymreq_ppn: ppnValue,
			paymreq_pph: pphValue,
			paymreq_bill: bill,
			paymreq_total: total
		}
		const cmd = sqlUtil.createUpdateCommand(TABLE.paymreq, data, ['paymreq_id'])
		await cmd.execute(data)

	} catch (err) {
		throw err
	}
}
