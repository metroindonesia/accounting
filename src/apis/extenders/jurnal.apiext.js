import sqlUtil from '@agung_dhewe/pgsqlc'
import db from '@agung_dhewe/webapps/src/db.js'
import { createSequencerLine } from '@agung_dhewe/webapps/src/sequencerline.js'

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
	coa: 'public.coa'
}

export async function jurnal_init(self, initialData) {
	const req = self.req
	initialData.setting.defaultCurr = req.app.locals.appConfig.defaultCurr
	initialData.setting.COMPANY_PRINTLOGO = req.app.locals.appConfig.COMPANY_PRINTLOGO


	/* ambil data paymtype */
	try {
		const sql = `
		select 
			paymtype_id, 
			ishaspartnercontact, ishaspartnerbankselector , ishasbankaccount, 
			ishasbankaccountname, ishasbankname, ishasgiro
		from ${TABLE.paymtype}
		`
		const rows = await db.any(sql)
		const paymtype = {}
		for (let row of rows) {
			paymtype[row.paymtype_id] = row
		}
		initialData.setting.paymtype = paymtype
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
	excludeNonEditableHeader(data) 	// buang data yang tidak boleh dimodif user
}

export async function headerDeleting(self, tx, dataToRemove) {
	// sebelum header dihapus, unset dahulu jurnaldetil_id_link
	const { jurnal_id } = dataToRemove
	const sqlUnlinkDetil = `update ${TABLE.jurnal} set jurnaldetil_id_link=null where jurnal_id=\${jurnal_id}`
	await tx.none(sqlUnlinkDetil, { jurnal_id })
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
		balance
	] = await Promise.all([
		sqlUtil.lookupdb(db, TABLE.jurnaltype, 'jurnaltype_id', jurnaltype_id),
		sqlUtil.lookupdb(db, TABLE.paymtype, 'paymtype_id', paymtype_id),
		sqlUtil.lookupdb(db, TABLE.periode, 'periode_id', periode_id),
		sqlUtil.lookupdb(db, TABLE.user, 'user_id', _postby),
		sqlUtil.lookupdb(db, TABLE.user, 'user_id', _commitby),
		db.oneOrNone(`SELECT isallowposting, isallowunposting FROM ${TABLE.jurnaltypeuser} WHERE jurnaltype_id=\${jurnaltype_id} AND user_id=\${user_id}`, { jurnaltype_id, user_id }),
		db.oneOrNone(`SELECT SUM(jurnaldetil_value) as balance_value, SUM(jurnaldetil_idr) as balance_idr FROM ${TABLE.jurnaldetil} WHERE jurnal_id = \${jurnal_id}`, { jurnal_id })
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
		balance_idr: balance?.balance_idr ?? 0
	});
}



export async function detilList(self, listData, args) {
	const { db, criteria } = args
	const { jurnal_id } = criteria

	const sqlBalance = `select sum(jurnaldetil_idr) as balance_idr from ${TABLE.jurnaldetil} where jurnal_id=\${jurnal_id}`
	const row = await db.one(sqlBalance, { jurnal_id })

	listData.balance_idr = row.balance_idr
}

export async function detilCreating(self, tx, data, seqdata, args) {
	excludeNonEditableDetil(data)
}

export async function detilCreated(self, tx, ret, data, logMetadata, args) {
	const { jurnal_id } = ret
	ret.balance_idr = await getBalance(self, tx, jurnal_id)
}

export async function detilUpdating(self, tx, data) {
	excludeNonEditableDetil(data)
}

export async function detilUpdated(self, tx, ret, data, logMetadata) {
	const { jurnal_id } = ret
	ret.balance_idr = await getBalance(self, tx, jurnal_id)
}

export async function detilDeleted(self, tx, deletedRow, logMetadata) {
	const { jurnal_id } = deletedRow
	deletedRow.balance_idr = await getBalance(self, tx, jurnal_id)
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
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()

	try {

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
			jurnal_id: ret.jurnal_id,
			jurnaldetil_id_link: data.jurnaldetil_id
		}
		const cmdHead = sqlUtil.createUpdateCommand(TABLE.jurnal, headdata, ['jurnal_id'])
		await cmdHead.execute(headdata)

	} catch (err) {
		throw err
	}
}


async function updateDetilFromHeader(self, tx, ret, param) {
	const req = self.req
	const user_id = req.session.user.userId

	sqlUtil.connect(tx)


	try {
		const data = await composeDataDetil(tx, ret, param.jurnaltype_headcopyto)
		data.jurnaldetil_id = ret.jurnaldetil_id_link
		data._modifyby = user_id
		data._modifydate = (new Date()).toISOString()

		const cmd = sqlUtil.createUpdateCommand(TABLE.jurnaldetil, data, ['jurnaldetil_id'])
		const result = await cmd.execute(data)

	} catch (err) {
		throw err
	}
}

async function calculateTotal(self, db, ret) {
	const jurnal_id = ret.jurnal_id
	const sql = `select sum(jurnaldetil_value) as balance_value, sum(jurnaldetil_idr) as balance_idr from ${TABLE.jurnaldetil} where jurnal_id=\${jurnal_id}`
	const row = await db.oneOrNone(sql, { jurnal_id })
	if (row != null) {
		ret.balance_value = row.balance_value
		ret.balance_idr = row.balance_idr
	} else {
		ret.balance_value = 0
		ret.balance_idr = 0
	}
}


async function checkBalance(self, db, jurnal_id) {
	const balance = await getBalance(self, db, jurnal_id)
	if (balance != 0) {
		throw new Error('Jurnal belum balace')
	}
}

async function checkJurnalRow(self, db, jurnal_id) {
	const sqlRowcount = 'select count(jurnaldetil_id) as rowcount from public.jurnaldetil where jurnal_id=${jurnal_id}'
	const rowBal = await db.one(sqlRowcount, { jurnal_id })
	const rowcount = Number(rowBal.rowcount)
	if (rowcount == 0) {
		throw new Error('Belum ada baris jurnal')
	}
}

async function checkPeriode(self, db, jurnal_id) {

}

async function getBalance(self, db, jurnal_id) {
	const sqlBalance = 'select sum(jurnaldetil_idr) as balance from public.jurnaldetil where jurnal_id=${jurnal_id}'
	const rowBal = await db.one(sqlBalance, { jurnal_id })
	const balance = Number(rowBal.balance)
	return balance
}