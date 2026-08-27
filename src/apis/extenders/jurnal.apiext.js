import sqlUtil from '@agung_dhewe/pgsqlc'
import db from '@agung_dhewe/webapps/src/db.js'
import { createSequencerLine } from '@agung_dhewe/webapps/src/sequencerline.js'
import { getUserPermission } from '@agung_dhewe/webapps/src/permission.js'
import { processApBill } from './jurnal.apiext.ap-bill.js'
import { processApPayment } from './jurnal.apiext.ap-payment.js'
import { processAdvancePayment } from './jurnal.apiext.adv-payment.js'
import { processDirectPayment } from './jurnal.apiext.direct-payment.js'
import { reopen } from './periode.apiext.js'
import * as PERMISSION from '../../../public/modules/jurnal/jurnal.permission.mjs'


const TABLE = {
	jurnal: 'public.jurnal',
	jurnaldetil: 'public.jurnaldetil',
	jurnaltype: 'public.jurnaltype',
	paymtype: 'public.paymtype',
	periode: 'public.periode',
	jurnaltypeuser: 'public.jurnaltypeuser',
	jurnaldetil: 'public.jurnaldetil',
	doc: 'core.doc',
	user: 'core.user',
	coa: 'public.coa',
	periode: 'public.periode',
	struct: 'public.struct',
	partner: 'public.partner',
	partnerbank: 'public.partnerbank',
	partnercontact: 'public.partnercontact',
	site: 'public.site',
	unit: 'public.unit',
	project: 'public.project',
	user: 'core.user',
	auth: 'core.auth',
	curr: "public.curr",
	currrate: "public.currrate",
}


export async function jurnal_init(self, initialData) {
	const req = self.req
	initialData.setting.defaultCurr = req.app.locals.appConfig.defaultCurr
	initialData.setting.COMPANY_PRINTLOGO = req.app.locals.appConfig.COMPANY_PRINTLOGO



	try {

		/* ambil data paymtype */
		const sqlPaymtype = `
			select 
				paymtype_id, 
				ishaspartnercontact, ishaspartnerbankselector , 
				ishasbankaccount, ishasbankaccountname, 
				ishasbankname, ishasgiro
			from ${TABLE.paymtype}`

		const rowsPaymtype = await db.any(sqlPaymtype)
		const paymtype = {}
		for (let row of rowsPaymtype) {
			paymtype[row.paymtype_id] = row
		}
		initialData.setting.paymtype = paymtype

		// cek data
		// debugger
		const rowTimezone = await db.one(`SELECT CURRENT_DATE, NOW(), current_setting('timezone')`);


		/* ambil data current periode_id */
		const sqlCurrentPeriode = `
			select 
				periode_id, periode_name, periode_start, periode_end
			from ${TABLE.periode}
			where 
				    periode_start <= CURRENT_DATE
				and periode_end >= CURRENT_DATE
				and periode_isclosed=false
			limit 1
		`

		const rowPeriode = await db.oneOrNone(sqlCurrentPeriode)
		if (rowPeriode != null) {
			initialData.setting.currentPeriode = {
				periode_id: rowPeriode.periode_id,
				periode_name: rowPeriode.periode_name,
				periode_start: rowPeriode.periode_start,
				periode_end: rowPeriode.periode_end
			}
		} else {
			initialData.setting.currentPeriode = null
		}


	} catch (err) {
		throw err
	}


}

export async function sequencerSetup(self, tx, sequencer, data, args) {
	sqlUtil.connect(tx)
	try {
		// ambil document
		const { doc_id } = await sqlUtil.lookupdb(tx, TABLE.jurnaltype, 'jurnaltype_id', data.jurnaltype_id)
		args.doc_id = doc_id
	} catch (err) {
		throw err
	}
}

export async function headerListCriteria(self, db, searchMap, criteria, sort, columns, args) {
	searchMap.periode_id = 'periode_id = ${periode_id}'
	searchMap.iscommit = 'iscommit = ${iscommit}'
	searchMap.ispost = 'ispost = ${ispost}'
	searchMap.jurnaltype_id = 'jurnaltype_id = ${jurnaltype_id}'



}

export async function headerListRow(self, row, args) {
	const db = args.db
	const jurnal_id = row.jurnal_id

	const balance = await getBalance(self, db, jurnal_id)
	row.balance_idr = balance.balance_idr
	row.balance_value = balance.balance_value

}

export async function headerCreating(self, tx, data, seqdata) {
	excludeNonEditableHeader(data)  // buang data yang tidak boleh dimodif user
	data.jurnal_doc = seqdata.doc;
}

export async function headerCreated(self, tx, ret, data, logMetadata, args) {
	sqlUtil.connect(tx)
	const { jurnaltype_headcopyto, doc_id } = await sqlUtil.lookupdb(tx, TABLE.jurnaltype, 'jurnaltype_id', ret.jurnaltype_id)
	if (jurnaltype_headcopyto == 'K' || jurnaltype_headcopyto == 'D') {
		const param = { jurnaltype_headcopyto, doc_id }
		await createDetilFromHeader(self, tx, ret, param)
	}

	await calculateTotal(self, tx, ret)
}

export async function headerUpdating(self, tx, data) {
	const { jurnal_id } = data

	excludeNonEditableHeader(data) 	// buang data yang tidak boleh dimodif user

	await cekJurnalForModification(self, tx, jurnal_id)
}

export async function headerDeleting(self, tx, dataToRemove) {
	const user_id = self.req.session.user.userId;
	const { jurnal_id } = dataToRemove


	// apakah user boleh menghapus jurnal
	const allowed = await getUserPermission(tx, user_id, PERMISSION.DELETE)
	if (!allowed) {
		const err = new Error('tidak ada permission untuk menghapus jurnal')
		err.status = 403
		throw err
	}


	await cekJurnalForModification(self, tx, jurnal_id)


	// sebelum header dihapus, unset dahulu jurnaldetil_id_link
	const sqlUnlinkDetil = `update ${TABLE.jurnal} set jurnaldetil_id_link=null where jurnal_id=\${jurnal_id}`
	await tx.none(sqlUnlinkDetil, { jurnal_id })

	// lakukan pre-cleanup
	const sqlCleanup = `call public.jurnal_precleanup(\${jurnal_id})`
	await tx.none(sqlCleanup, { jurnal_id })

}

export async function headerDeleted(self, tx, deletedRow, logMetadata) {
}

export async function headerUpdated(self, tx, ret, data, logMetadata) {
	sqlUtil.connect(tx)
	const { jurnaltype_headcopyto, doc_id } = await sqlUtil.lookupdb(tx, TABLE.jurnaltype, 'jurnaltype_id', ret.jurnaltype_id)
	if (jurnaltype_headcopyto == 'K' || jurnaltype_headcopyto == 'D') {
		const param = { jurnaltype_headcopyto, doc_id }
		const jurnaldetil_id_link = ret.jurnaldetil_id_link
		if (jurnaldetil_id_link == null) {
			await createDetilFromHeader(self, tx, ret, param)
		} else {
			await updateDetilFromHeader(self, tx, ret, param)
		}
	}

	await calculateTotal(self, tx, ret)
}

export async function getPrintData(self, db, body) {
	const { jurnal_id } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()

	sqlUtil.connect(db)

	const sekarang = new Date();
	const offset = sekarang.getTimezoneOffset() * 60000; // konversi ke milidetik
	const waktuLokalISO = new Date(sekarang - offset).toISOString().slice(0, -1);

	try {
		const header = await sqlUtil.lookupdb(db, TABLE.jurnal, 'jurnal_id', jurnal_id)
		const struct = await sqlUtil.lookupdb(db, TABLE.struct, 'struct_id', header.struct_id)
		const jurnaltype = await sqlUtil.lookupdb(db, TABLE.jurnaltype, 'jurnaltype_id', header.jurnaltype_id)
		const curr = await sqlUtil.lookupdb(db, TABLE.curr, 'curr_id', header.curr_id)
		const coa = await sqlUtil.lookupdb(db, TABLE.coa, 'coa_id', header.coa_id)
		const site = await sqlUtil.lookupdb(db, TABLE.site, 'site_id', header.site_id)
		const unit = await sqlUtil.lookupdb(db, TABLE.unit, 'unit_id', header.unit_id)
		const partner = await sqlUtil.lookupdb(db, TABLE.partner, 'partner_id', header.partner_id)
		const partnercontact = await sqlUtil.lookupdb(db, TABLE.partnercontact, 'partnercontact_id', header.partnercontact_id)
		const project = await sqlUtil.lookupdb(db, TABLE.project, 'project_id', header.project_id)
		const user = await sqlUtil.lookupdb(db, TABLE.user, 'user_id', header._createby)
		const paymtype = await sqlUtil.lookupdb(db, TABLE.paymtype, 'paymtype_id', header.paymtype_id)


		const sqlBalance = `
			select 
			sum(jurnaldetil_value) as balance_value, sum(jurnaldetil_idr) as balance_idr
			from public.jurnaldetil
			where jurnal_id=\${jurnal_id}`

		const rowBalance = await db.one(sqlBalance, { jurnal_id })
		const balance_value = rowBalance.balance_value
		const balance_idr = rowBalance.balance_idr


		// hitung total nilai jurnal
		let total_value = header.jurnal_value
		let total_idr = header.jurnal_idr

		// apabila coa di header dipilih (!=null, makan nilai total ambil dari detil yang sesuai dengan header)
		const coa_id = header.coa_id
		if (coa_id != null) {
			const sqlTotal = `
				select 
				sum(jurnaldetil_value) as total_value, sum(jurnaldetil_idr) as total_idr
				from public.jurnaldetil
				where 
					jurnal_id=\${jurnal_id}
				and coa_id=\${coa_id}`

			const rowTotal = await db.one(sqlTotal, { jurnal_id, coa_id })
			total_value = rowTotal.total_value
			total_idr = rowTotal.total_idr
		}


		const data = {
			title: jurnaltype.jurnaltype_title,
			headertext: header.jurnal_doc + ' - ' + header.jurnal_descr,
			jurnaltype_printout: jurnaltype.jurnaltype_printout,
			printdate: sqlUtil.formatISODate(waktuLokalISO, 'dd/mm/yyyy'),
			jurnal_doc: header.jurnal_doc,
			jurnal_version: header.jurnal_version,
			jurnal_date: sqlUtil.formatISODate(header.jurnal_date, 'dd/mm/yyyy'),
			jurnal_datedue: sqlUtil.formatISODate(header.jurnal_datedue, 'dd/mm/yyyy'),
			jurnal_descr: header.jurnal_descr,
			dibuat_nama: user.user_fullname,
			coa_name: coa.coa_name,
			site_name: site.site_name,
			unit_name: unit.unit_name,
			struct_name: struct.struct_name,
			partner_name: partner.partner_name,
			paymtype_name: paymtype.paymtype_name,
			payment_bgno: header.payment_bgno,
			partnerbank_account: header.partnerbank_account,
			partnerbank_bankname: header.partnerbank_bankname,
			partnerbank_accountname: header.partnerbank_accountname,
			partnercontact: '',
			total_idr: sqlUtil.formatDecimal(total_idr, 0),
			balance_idr: sqlUtil.formatDecimal(balance_idr, 0),

			items: []
		}

		if (header.curr_id == 1) {
			data.total_value = ''
			data.balance_value = ''
			data.curr_name = ''
		} else {
			data.total_value = sqlUtil.formatDecimal(total_value, 0)
			data.balance_value = sqlUtil.formatDecimal(balance_value, 0)
			data.curr_name = curr.curr_name
		}



		// detil
		const sqlDetil = `
			select * from ${TABLE.jurnaldetil} 
			where jurnal_id = \${jurnal_id}
			order by
				(case when jurnaldetil_value>=0 then 0 else 1 end),
				blockorder ASC,
				(case when jurnaldetil_value>=0 then jurnaldetil_value end) DESC,
				(case when jurnaldetil_value<0 then jurnaldetil_value end) ASC`


		const rowsDetil = await db.any(sqlDetil, { jurnal_id: jurnal_id })
		let i = 0
		for (let row of rowsDetil) {
			i++

			const curr = await sqlUtil.lookupdb(db, TABLE.curr, 'curr_id', row.curr_id)
			const coa = await sqlUtil.lookupdb(db, TABLE.coa, 'coa_id', row.coa_id)
			const site = await sqlUtil.lookupdb(db, TABLE.site, 'site_id', row.site_id)
			const unit = await sqlUtil.lookupdb(db, TABLE.unit, 'unit_id', row.unit_id)
			const struct = await sqlUtil.lookupdb(db, TABLE.struct, 'struct_id', row.struct_id)

			const rowDetil = {
				no: i,
				jurnaldetil_descr: row.jurnaldetil_descr,
				coa_name: coa.coa_name,
				jurnaldetil_idr: sqlUtil.formatDecimal(row.jurnaldetil_idr, 0),
				jurnaldetil_ishead: row.jurnaldetil_ishead,
				tag_paymreq_data: row.tag_paymreq_data
			}

			if (row.site_id != null) {
				rowDetil.site_name = '<b>site:</b> ' + site.site_name
			}

			if (row.unit_id != null) {
				rowDetil.unit_name = '<b>unit:</b> ' + unit.unit_name
			}

			if (row.struct_id != null) {
				rowDetil.struct_name = struct.struct_name
			}

			if (row.curr_id == 1) {
				rowDetil.curr_name = ''
				rowDetil.jurnaldetil_value = ''
			} else {
				rowDetil.curr_name = curr.curr_name
				rowDetil.jurnaldetil_value = sqlUtil.formatDecimal(row.jurnaldetil_value, 0)
			}

			if (row.jurnaldetil_idr >= 0) {
				rowDetil.prn_row_account_class = 'prn-row-account-debet'
			} else {
				rowDetil.prn_row_account_class = 'prn-row-account-kredit'
			}

			data.items.push(rowDetil)
		}



		return data
	} catch (err) {
		throw err
	}
}







export async function headerOpen(self, db, data) {
	const { userId: user_id } = self.req.session.user;
	const { jurnaltype_id, paymtype_id, jurnal_id, periode_id, _postby, _commitby } = data;

	sqlUtil.connect(db);

	// Jalankan semua query secara paralel menggunakan Promise.all
	const [
		jurnaltype,
		paymtype,
		periode,
		postByUser,
		commitByUser,
		allowRow,
		balance,
		reference,
		response,
	] = await Promise.all([
		sqlUtil.lookupdb(db, TABLE.jurnaltype, 'jurnaltype_id', jurnaltype_id),
		sqlUtil.lookupdb(db, TABLE.paymtype, 'paymtype_id', paymtype_id),
		sqlUtil.lookupdb(db, TABLE.periode, 'periode_id', periode_id),
		sqlUtil.lookupdb(db, TABLE.user, 'user_id', _postby),
		sqlUtil.lookupdb(db, TABLE.user, 'user_id', _commitby),
		db.oneOrNone(`SELECT isallowposting, isallowunposting FROM ${TABLE.jurnaltypeuser} WHERE jurnaltype_id=\${jurnaltype_id} AND user_id=\${user_id}`, { jurnaltype_id, user_id }),
		db.oneOrNone(`SELECT SUM(jurnaldetil_value) as balance_value, SUM(jurnaldetil_idr) as balance_idr FROM ${TABLE.jurnaldetil} WHERE jurnal_id = \${jurnal_id}`, { jurnal_id }),
		getReference(data.jurnal_id),
		getResponse(data.jurnal_id)
	]);


	// Mapping hasil secara ringkas
	Object.assign(data, {
		jurnaltype,
		paymtype,
		periode,
		// periode_isclosed: periode?.periode_isclosed,
		_postby: postByUser?.user_fullname ?? '',
		_commitby: commitByUser?.user_fullname ?? '',
		isallowposting: allowRow?.isallowposting ?? false,
		isallowunposting: allowRow?.isallowunposting ?? false,
		balance_value: balance?.balance_value ?? 0,
		balance_idr: balance?.balance_idr ?? 0,
		reference,
		response
	});
}


async function getReference(jurnal_id) {
	await db.none('call public.jurnal_reference(${jurnal_id})', { jurnal_id })
	const reference = await db.any('select * from TEMP_JURNAL_REFERENCE order by docorder, docdate')
	return reference
}


async function getResponse(jurnal_id) {
	await db.none('call public.jurnal_response(${jurnal_id})', { jurnal_id })
	const response = await db.any('select * from TEMP_JURNAL_RESPONSE order by docdate')
	return response
}




export async function detilOpen(self, db, data) {
	const { coa_id } = data;

	sqlUtil.connect(db);

	const [
		coa,
	] = await Promise.all([
		sqlUtil.lookupdb(db, TABLE.coa, 'coa_id', coa_id),
	]);

	Object.assign(data, {
		coa
	})
}

export async function detilListCriteria(self, db, searchMap, criteria, sort, columns, args) {
	args.sqlSort = `
		(case when jurnaldetil_value>=0 then 0 else 1 end),
		blockorder ASC,
		(case when jurnaldetil_value>=0 then jurnaldetil_value end) DESC,
		(case when jurnaldetil_value<0 then jurnaldetil_value end) ASC`
}

export async function detilList(self, listData, args) {
	const { db, criteria } = args
	const { jurnal_id } = criteria

	const balance = await getBalance(self, db, jurnal_id)
	listData.balance_idr = balance.balance_idr
	listData.balance_value = balance.balance_value
}

export async function detilCreating(self, tx, data, seqdata, args) {
	excludeNonEditableDetil(data)
}

export async function detilCreated(self, tx, ret, data, logMetadata, args) {
	const { jurnal_id } = ret
	const { balance_idr, balance_value } = await getBalance(self, tx, jurnal_id)
	ret.balance_idr = balance_idr
	ret.balance_value = balance_value

	await updateHeaderValue(self, tx, ret, jurnal_id)
}

export async function detilUpdating(self, tx, data) {
	const { jurnaldetil_id } = data
	const jurnal = await sqlUtil.lookupdb(tx, TABLE.jurnaldetil, 'jurnaldetil_id', jurnaldetil_id)

	excludeNonEditableDetil(data)
	await cekJurnalForModification(self, tx, jurnal.jurnal_id)
}

export async function detilUpdated(self, tx, ret, data, logMetadata) {
	const { jurnal_id } = ret
	const { balance_idr, balance_value } = await getBalance(self, tx, jurnal_id)
	ret.balance_idr = balance_idr
	ret.balance_value = balance_value

	await updateHeaderValue(self, tx, ret, jurnal_id)
}

export async function detilDeleting(self, tx, rowdetil, logMetadata) {
	const { jurnaldetil_id } = rowdetil
	const jurnal = await sqlUtil.lookupdb(tx, TABLE.jurnaldetil, 'jurnaldetil_id', jurnaldetil_id)

	await cekJurnalForModification(self, tx, jurnal.jurnal_id)
}



export async function detilDeleted(self, tx, deletedRow, logMetadata) {
	const { jurnal_id } = deletedRow
	const { balance_idr, balance_value } = await getBalance(self, tx, jurnal_id)
	deletedRow.balance_idr = balance_idr
	deletedRow.balance_value = balance_value

	await updateHeaderValue(self, tx, deletedRow, jurnal_id)
}

export async function detilRowsDeleted(self, db, res) {
	const { jurnal_id } = res
	const { balance_idr, balance_value } = await getBalance(self, db, jurnal_id)
	res.balance_idr = balance_idr
	res.balance_value = balance_value

	await updateHeaderValue(self, db, res, jurnal_id)
}


export async function commit(self, db, body, jurnal_log) {
	const { jurnal_id } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()

	try {

		const sqlCurent = `
			select periode_id, iscommit, ispost 
			from ${TABLE.jurnal}
			where jurnal_id=\${jurnal_id}`
		const rowCurrent = await db.one(sqlCurent, { jurnal_id })
		const iscommit = rowCurrent.iscommit
		const ispost = rowCurrent.ispost
		const periode_id = rowCurrent.periode_id

		// perlu cek apa dulu
		if (iscommit) {
			// tidak ada perubahan
			return {
				unchanged: true
			}
		}

		// cek periode closed ?




		// cek yang lain
		await checkJurnalRow(self, db, jurnal_id)
		await checkBalance(self, db, jurnal_id)
		await checkPeriode(self, db, jurnal_id)




		// main process
		// commit jurnal
		const sqlCommit = 'call public.jurnal_commit(${jurnal_id}, ${iscommit}, ${user_id})'
		await db.none(sqlCommit, {
			jurnal_id: jurnal_id,
			iscommit: true,
			user_id: user_id
		})


		// cek hasil commit
		const sql = `
			select jurnal_version, iscommit, _commitby, _commitdate 
			from ${TABLE.jurnal}
			where jurnal_id=\${jurnal_id}`

		const row = await db.one(sql, { jurnal_id: jurnal_id })
		const version = row.jurnal_version

		const remark = `version ${version}`
		jurnal_log(self, body, startTime, TABLE.jurnal, jurnal_id, 'COMMIT', {}, remark)

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

export async function uncommit(self, db, body, jurnal_log) {
	const { jurnal_id } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()

	try {

		const sqlCurent = `
			select jurnal_version, periode_id, iscommit, ispost 
			from ${TABLE.jurnal}
			where jurnal_id=\${jurnal_id}`
		const rowCurrent = await db.one(sqlCurent, { jurnal_id: jurnal_id })
		const prevVersion = rowCurrent.jurnal_version
		const iscommit = rowCurrent.iscommit
		const ispost = rowCurrent.ispost
		const periode_id = rowCurrent.periode_id


		if (!iscommit) {
			// tidak ada perubahan
			return {
				unchanged: true
			}
		}

		if (ispost) {
			// tidak bisa uncommit data yang sudah diapprove
			throw new Error('tidak bisa un-commit dokument yang sudah posting')
		}


		// main process
		// commit jurnal
		const sqlCommit = 'call public.jurnal_commit(${jurnal_id}, ${iscommit}, ${user_id})'
		await db.none(sqlCommit, {
			jurnal_id: jurnal_id,
			iscommit: false,
			user_id: user_id
		})



		// cek hasil un-commit
		const sql = `
			select jurnal_version, iscommit, _commitby, _commitdate 
			from ${TABLE.jurnal}
			where jurnal_id=\${jurnal_id}`

		const row = await db.one(sql, { jurnal_id: jurnal_id })
		const newVersion = row.jurnal_version


		const remark = `update version ${prevVersion} -> ${newVersion}`
		jurnal_log(self, body, startTime, TABLE.jurnal, jurnal_id, 'UNCOMMIT', {}, remark)

		return {
			iscommit: row.iscommit,
			version: newVersion,
			message: ''
		}
	} catch (err) {
		throw err

	}
}




export async function post(self, db, body, jurnal_log) {
	const { jurnal_id } = body
	const req = self.req
	const user_id = self.req.session.user.userId;
	const startTime = process.hrtime.bigint()

	try {

		// cek apakah user beleh melakukan unpost
		const allowed = await getUserPermission(db, user_id, PERMISSION.POSTING)
		if (!allowed) {
			throw new Error('tidak ada permission untuk posting jurnal')
		}


		const sqlCurent = `
			select periode_id, iscommit, ispost 
			from ${TABLE.jurnal}
			where jurnal_id=\${jurnal_id}`
		const rowCurrent = await db.one(sqlCurent, { jurnal_id })
		const iscommit = rowCurrent.iscommit
		const ispost = rowCurrent.ispost
		const periode_id = rowCurrent.periode_id

		// perlu cek apa dulu
		if (ispost) {
			// tidak ada perubahan
			return {
				unchanged: true
			}
		}

		if (!iscommit) {
			// tidak bisa approve data yang belum di commit
			throw new Error('tidak bisa approve jurnal yang belum dicommit')
		}

		// cek periode closed ?

		// cek yang lain


		// main process
		// commit jurnal
		const sqlCommit = 'call public.jurnal_post(${jurnal_id}, ${ispost}, ${user_id})'
		await db.none(sqlCommit, {
			jurnal_id: jurnal_id,
			ispost: true,
			user_id: user_id
		})


		// cek hasil posting
		const sql = `
			select ispost, _postby, _postdate 
			from ${TABLE.jurnal}
			where jurnal_id=\${jurnal_id}`

		const row = await db.one(sql, { jurnal_id: jurnal_id })

		const remark = ''
		jurnal_log(self, body, startTime, TABLE.jurnal, jurnal_id, 'POST', {}, remark)

		return {
			ispost: row.ispost,
			_postby: row._postby,
			_commitdate: row._commitdate,
			message: ''
		}
	} catch (err) {
		throw err

	}
}



export async function unpost(self, db, body, jurnal_log) {
	const { jurnal_id, upostMessage } = body
	const req = self.req
	const user_id = self.req.session.user.userId;
	const startTime = process.hrtime.bigint()

	try {

		// cek apakah user beleh melakukan unpost
		const allowed = await getUserPermission(db, user_id, PERMISSION.UNPOSTING)
		if (!allowed) {
			throw new Error('tidak ada permission untuk posting jurnal')
		}

		const sqlCurent = `
			select iscommit, ispost 
			from ${TABLE.jurnal}
			where jurnal_id=\${jurnal_id}`
		const rowCurrent = await db.one(sqlCurent, { jurnal_id: jurnal_id })
		const ispost = rowCurrent.ispost

		if (!ispost) {
			// tidak ada perubahan
			return {
				unchanged: true
			}
		}

		// cek apakah dokument sudah di tarik ke jurnal lain
		// jika sudah ditarik ke jurnal tidak bisa unpost
		// ???



		// main process
		// commit jurnal
		const sqlCommit = 'call public.jurnal_post(${jurnal_id}, ${ispost}, ${user_id})'
		await db.none(sqlCommit, {
			jurnal_id: jurnal_id,
			ispost: false,
			user_id: user_id
		})

		// cek hasil posting
		const sql = `
			select ispost, _postby, _postdate 
			from ${TABLE.jurnal}
			where jurnal_id=\${jurnal_id}`

		const row = await db.one(sql, { jurnal_id: jurnal_id })

		jurnal_log(self, body, startTime, TABLE.jurnal, jurnal_id, 'UNPOST', {}, upostMessage)

		return {
			ispost: row.ispost,
			message: ''
		}
	} catch (err) {
		throw err

	}
}






function excludeNonEditableHeader(data) {
	//  data ini tidak bisa diisi saat insert
	delete data.iscommit
	delete data.ispost
	delete data.jurnaldetil_id_link
	delete data._postby
	delete data._postdate
	delete data._commitby
	delete data._commitdate

}

function excludeNonEditableDetil(data) {
	delete data.jurnaldetil_ishead

	if (data.jurnaldetil_id_ref == '') {
		data.jurnaldetil_id_ref = null
	}

	if (data.paymreq_id == '') {
		data.paymreq_id = null
	}

	if (data.paymreqdetil_id == '') {
		data.paymreqdetil_id = null
	}

	if (data.agingtype_id == '') {
		data.agingtype_id = null
	}
}


async function composeDataDetil(tx, data, copyto) {
	sqlUtil.connect(tx)
	const { agingtype_id, curr_id } = await sqlUtil.lookupdb(tx, TABLE.coa, 'coa_id', data.coa_id)
	data.agingtype_id = agingtype_id
	data.coacurr = curr_id

	return {
		jurnaldetil_ishead: true,
		jurnaldetil_descr: data.jurnal_descr,
		jurnaldetil_value: copyto == 'K' ? -1 * data.jurnal_value : data.jurnal_value,
		jurnaldetil_idr: copyto == 'K' ? -1 * data.jurnal_idr : data.jurnal_idr,
		coa_id: data.coa_id,
		unit_id: data.unit_id,
		site_id: data.site_id,
		struct_id: data.struct_id,
		partner_id: data.partner_id,
		project_id: data.project_id,
		curr_id: data.curr_id,
		curr_rate: data.curr_rate,
		coacurr: data.coacurr,
		agingtype_id: data.agingtype_id,
		periode_id: data.periode_id,
		jurnal_date: data.jurnal_date,
		jurnal_datedue: data.jurnal_datedue,
		jurnaltype_id: data.jurnaltype_id,
		jurnal_doc: data.jurnal_doc,
		jurnal_id: data.jurnal_id
	}
}

async function createDetilFromHeader(self, tx, ret, param) {
	const req = self.req
	const user_id = req.session.user.userId
	const jurnal_id = ret.jurnal_id
	const { doc_id } = param

	sqlUtil.connect(tx)



	try {
		const sequencer = createSequencerLine(tx, {})
		const seqdata = await sequencer.increment(param.doc_id)

		const data = await composeDataDetil(tx, ret, param.jurnaltype_headcopyto)
		data.jurnaldetil_id = seqdata.id
		data._createby = user_id
		data._createdate = (new Date()).toISOString()

		const cmd = sqlUtil.createInsertCommand(TABLE.jurnaldetil, data)
		await cmd.execute(data)


		// update header jurnaldetil_id_link
		const headdata = {
			jurnal_id: jurnal_id,
			jurnaldetil_id_link: data.jurnaldetil_id
		}
		const cmdHead = sqlUtil.createUpdateCommand(TABLE.jurnal, headdata, ['jurnal_id'])
		await cmdHead.execute(headdata)

		// tambahkan jurnaldetil_id_link untuk diambil pada proses berikutnya
		ret.jurnaldetil_id_link = headdata.jurnaldetil_id_link

		// berikutnya cek process pada paymentrequest jika memenuhi syarat 
		await processPaymreq(self, tx, doc_id, ret)

	} catch (err) {
		throw err
	}
}


async function updateDetilFromHeader(self, tx, ret, param) {
	const req = self.req
	const user_id = req.session.user.userId
	const { doc_id } = param


	sqlUtil.connect(tx)


	try {

		const data = await composeDataDetil(tx, ret, param.jurnaltype_headcopyto)
		data.jurnaldetil_id = ret.jurnaldetil_id_link
		data._modifyby = user_id
		data._modifydate = (new Date()).toISOString()

		const cmd = sqlUtil.createUpdateCommand(TABLE.jurnaldetil, data, ['jurnaldetil_id'])
		const result = await cmd.execute(data)


		// berikutnya cek process pada paymentrequest jika memenuhi syarat 
		await processPaymreq(self, tx, doc_id, ret)


	} catch (err) {
		throw err
	}
}

async function processPaymreq(self, tx, doc_id, jurnalHeader) {
	const { jurnaltype_id } = jurnalHeader

	try {
		//  cek processing pada jurnaltype_id
		const { paymreqprocess } = await sqlUtil.lookupdb(tx, TABLE.jurnaltype, 'jurnaltype_id', jurnaltype_id)
		if (paymreqprocess == 'ap-bill') {
			await processApBill(self, tx, doc_id, jurnalHeader)
		} else if (paymreqprocess == 'ap-payment') {
			await processApPayment(self, tx, doc_id, jurnalHeader)
		} else if (paymreqprocess == 'advance-payment') {
			await processAdvancePayment(self, tx, doc_id, jurnalHeader)
		} else if (paymreqprocess == 'direct-payment') {
			await processDirectPayment(self, tx, doc_id, jurnalHeader)
		}
	} catch (err) {
		throw err
	}
}


async function calculateTotal(self, db, ret) {
	const jurnal_id = ret.jurnal_id

	const balance = await getBalance(self, db, jurnal_id)
	if (balance != null) {
		ret.balance_value = balance.balance_value
		ret.balance_idr = balance.balance_idr
	} else {
		ret.balance_value = 0
		ret.balance_idr = 0
	}
}


async function checkBalance(self, db, jurnal_id) {
	const { balance_idr, balance_value } = await getBalance(self, db, jurnal_id)
	if (balance_idr != 0) {
		throw new Error('Jurnal belum balance. Cek nilai IDR')
	}

	// cek apa perlu cek balance untuk yang value. 
	// pertimbangan tidak perlu dicek, karena apabila mata uang berbeda tidak bisa dijumlah
	// if (balance_value != 0) {
	// 	throw new Error('Jurnal belum balance. Cek Value')
	// }

}

async function checkJurnalRow(self, db, jurnal_id) {
	const sqlRowcount = `select count(jurnaldetil_id) as rowcount from ${TABLE.jurnaldetil} where jurnal_id=\${jurnal_id}`
	const rowBal = await db.one(sqlRowcount, { jurnal_id })
	if (Number(rowBal.rowcount) == 0) {
		throw new Error('Belum ada baris jurnal')
	}

	const sqlCekCoa = `select count(jurnaldetil_id) as rowcount from  ${TABLE.jurnaldetil} where jurnal_id=\${jurnal_id} and coa_id is null`
	const rowCekCoa = await db.one(sqlCekCoa, { jurnal_id })
	if (Number(rowCekCoa.rowcount) > 0) {
		throw new Error('Ada beberapa baris jurnal yang belum assign Chart of Account')
	}

}

async function checkPeriode(self, db, jurnal_id) {

}




async function getBalance(self, db, jurnal_id) {
	const sqlBalance = `
			select 
			sum(jurnaldetil_value) as balance_value , sum(jurnaldetil_idr) as balance_idr 
			from public.jurnaldetil where jurnal_id=\${jurnal_id}`
	const rowBal = await db.one(sqlBalance, { jurnal_id })
	const balance_idr = Number(rowBal.balance_idr)
	const balance_value = Number(rowBal.balance_value)
	return { balance_idr, balance_value }
}

async function getDebetValue(self, db, jurnal_id) {

}

async function updateHeaderValue(self, db, ret, jurnal_id) {
	sqlUtil.connect(db)

	try {
		const sql = `select jurnaldetil_id_link from ${TABLE.jurnal} where jurnal_id=\${jurnal_id}`
		const row = await db.one(sql, { jurnal_id })


		// hanya update jurnal_value, dan jurnal_idr jika tidak link ke detil (jurnaldetil_id_link == null)
		if (row.jurnaldetil_id_link == null) {
			// jurnal header value tidak terkait dengan detil
			// update value berdasarkan value debet (+)
			const sqlDebet = `
				select 
				sum(jurnaldetil_value) as total_value, sum(jurnaldetil_idr) as total_idr
				from ${TABLE.jurnaldetil} where jurnal_id=\${jurnal_id} and jurnaldetil_idr > 0`
			const rowSum = await db.one(sqlDebet, { jurnal_id })
			const total_idr = Number(rowSum.total_idr)
			const total_value = Number(rowSum.total_value)

			// update header
			const data = {
				jurnal_id,
				jurnal_idr: total_idr
			}
			const cmd = sqlUtil.createUpdateCommand(TABLE.jurnal, data, ['jurnal_id'])
			await cmd.execute(data)

			ret.total_idr = total_idr
			ret.total_value = total_value
			ret.updateTotal = true
		} else {
			ret.updateTotal = false
		}
	} catch (err) {
		throw err
	}
}


async function cekJurnalForModification(self, tx, jurnal_id) {
	const sqlCek = `select jurnal_doc, ispost, iscommit from public.jurnal where jurnal_id=\${jurnal_id}`
	const rowCek = await tx.one(sqlCek, { jurnal_id })
	const { jurnal_doc, ispost, iscommit } = rowCek

	if (iscommit) {
		throw new Error(`jurnal ${jurnal_doc} tidak bisa dimodifikasi, status jurnal: <b>commit</b>`)
	}

	if (ispost) {
		throw new Error(`jurnal ${jurnal_doc} tidak bisa dimodifikasi, status jurnal: <b>posted`)
	}

}



export async function uploadJurnalChunk(self, db, body, jurnal_log) {
	const user_id = self.req.session.user.userId;
	const { jurnal_id, chunk, meta } = body
	const uploadId = meta.uploadId




	console.log(jurnal_id)
	console.log(chunk)
}


export async function verifyJurnalChunk(self, db, body, jurnal_log) {


}