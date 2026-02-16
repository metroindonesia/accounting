import sqlUtil from '@agung_dhewe/pgsqlc'

const TABLE = {
	paymreq: 'public.paymreq',
	paymreqdetil: 'public.paymreq',
	paymreqtype: 'public.paymreqtype',
	paymtype: 'public.paymtype',
	taxtype: 'public.taxtype'
}

export async function paymreq_init(self, initialData) {
	const req = self.req
	initialData.setting.defaultCurr = req.app.locals.appConfig.defaultCurr
}



export async function headerCreating(self, tx, data, seqdata) {
	// buang data yang tidak boleh dimodif user

	data.paymreq_doc = seqdata.doc;

}

export async function headerListCriteria(self, db, searchMap, criteria, sort, columns, args) {
	const req = self.req
	const user_id = req.session.user.userId

	// criteria.user_id = user_id

	searchMap.iscommit = 'iscommit = ${iscommit}'
	searchMap.isapproved = 'isapproved = ${isapproved}'
	searchMap.user_id = 'struct_id IN (select struct_id from public.structmember where user_id=${user_id})'
	searchMap.struct_id = 'struct_id = ${struct_id}'

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

export async function detilUpdated(self, tx, ret, data, logMetadata) {
	await updateHeaderValue(self, tx, ret.paymreq_id)
}

export async function detilDeleted(self, tx, deletedRow, logMetadata) {
	await updateHeaderValue(self, tx, deletedRow.paymreq_id)
}

export async function detilCreated(self, tx, ret, data, logMetadata, args) {
	await updateHeaderValue(self, tx, data.paymreq_id)
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
			const sqlPPh = `select taxtype_value from ${TABLE.taxtype} where taxtype_id=${taxtype_id}`
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


export async function getTotalValue(self, db, fnParams) {

	const paymreq_id = fnParams.paymreq_id

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

		const result = await db.tx(async tx => {
			sqlUtil.connect(tx)

			const data = {
				paymreq_id,
				isapproved: true,
				_approveby: user_id,
				_approvedate: (new Date()).toISOString()
			}

			const cmd = sqlUtil.createUpdateCommand(TABLE.paymreq, data, ['paymreq_id'])
			const ret = await cmd.execute(data)
		})

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


		const result = await db.tx(async tx => {
			sqlUtil.connect(tx)

			const data = {
				paymreq_id,
				isapproved: false,
				_approveby: null,
				_approvedate: null
			}

			const cmd = sqlUtil.createUpdateCommand(TABLE.paymreq, data, ['paymreq_id'])
			const ret = await cmd.execute(data)
		})

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
