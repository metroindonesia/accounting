import sqlUtil from '@agung_dhewe/pgsqlc'
import { createSequencerLine } from '@agung_dhewe/webapps/src/sequencerline.js' 

function excludeNonEditableHeader(data) {
	//  data ini tidak bisa diisi saat insert
	delete data.iscommit
	delete data.ispost
	delete data._postby
	delete data._postdate
	delete data._commitby
	delete data._commitdate
}

function excludeNonEditableDetil(data) {
	delete data.jurnaldetil_id_ref
	delete data.jurnaldetil_ishead
	
}

export async function headerListCriteria(self, db, searchMap, criteria, sort, columns) {
	if (criteria.postedstatus_id!==undefined) {
		criteria.ispost = criteria.postedstatus_id=='POSTED' ? true : false;
		searchMap.ispost = 'ispost = ${ispost}'

		delete criteria.postedstatus_id;
	}


	searchMap.periode_id = 'periode_id = ${periode_id}'
	searchMap.jurnaltype_id = 'jurnaltype_id = ${jurnaltype_id}'
}


export async function headerCreating(self, tx, data, seqdata) {
	// buang data yang tidak boleh dimodif user
	excludeNonEditableHeader(data)

	data.jurnal_doc = seqdata.doc;

}


export async function headerUpdating(self, tx, data) {
	// buang data yang tidak boleh dimodif user
	excludeNonEditableHeader(data)

}

export async function headerOpen(self, db, data) {
	const req = self.req
	const user_id = req.session.user.userId
	const jurnaltype_id = data.jurnaltype_id
	const jurnal_id = data.jurnal_id

	sqlUtil.connect(db)


	// ambil data tipe jurnal
	data.jurnaltype = await sqlUtil.lookupdb(db, 'act.jurnaltype', 'jurnaltype_id', jurnaltype_id)

	// dapatkan informasi payment type
	data.paymtype = await sqlUtil.lookupdb(db, 'act.paymtype', 'paymtype_id', data.paymtype_id)


	// dapatkan informasi closing periode
	const periode = await sqlUtil.lookupdb(db, 'act.periode', 'periode_id', data.periode_id)
	data.periode_isclosed = periode.periode_isclosed


	// dapatkan informasi postby
	const { user_fullname } = await sqlUtil.lookupdb(db, 'core.user', 'user_id', data._postby)
	data._postby = user_fullname ?? ''


	// dapatkan informasi apakah boleh posting, unposting
	{
		const sql = 'select isallowposting, isallowunposting from act.jurnaltypeuser where jurnaltype_id=${jurnaltype_id} and user_id=${user_id}'
		const row = await db.oneOrNone(sql, {jurnaltype_id, user_id})
		if (row==null) {
			data.isallowposting = false
			data.isallowunposting = false
		} else {
			data.isallowposting = row.isallowposting
			data.isallowunposting = row.isallowunposting	
		}
	}



	// dapatkan informasi total value dan idr
	{
		const sql = 'select sum(jurnaldetil_value) as total_value, sum(jurnaldetil_idr) as total_idr from act.jurnaldetil where jurnal_id=${jurnal_id}'
		const row = await db.oneOrNone(sql, {jurnal_id})
		if (row!=null) {
			data.total_value = row.total_value
			data.total_idr = row.total_idr
		} else {
			data.total_value = 0
			data.total_idr = 0		
		}
	}




}

export async function sequencerSetup(self, tx, sequencer, data, args) {
	sqlUtil.connect(tx)
	try {
		const { jurnaltype_headcopyto, jurnaltype_code } = await sqlUtil.lookupdb(tx, 'act.jurnaltype', 'jurnaltype_id', data.jurnaltype_id)
		args.prefix = jurnaltype_code
		args.copyto = jurnaltype_headcopyto
	} catch (err) {
		throw err
	}
}

export async function detilCreating(self, tx, data, seqdata, args) {
	// jika jurnaldetil_id_ref=='' set jadi null
	if (data.jurnaldetil_id_ref=='') {
		data.jurnaldetil_id_ref = null
	}

	// jika agingtype_id='' set jadi null
	if (data.agingtype_id=='') {
		data.agingtype_id = null
	}
}



async function calculateTotal(self, db, ret) {
	const jurnal_id = ret.jurnal_id
	const sql = 'select sum(jurnaldetil_value) as total_value, sum(jurnaldetil_idr) as total_idr from act.jurnaldetil where jurnal_id=${jurnal_id}'
	const row = await db.oneOrNone(sql, {jurnal_id})
	if (row!=null) {
		ret.total_value = row.total_value
		ret.total_idr = row.total_idr
	} else {
		ret.total_value = 0
		ret.total_idr = 0		
	}
}



export async function headerUpdated(self, tx, ret, data, logMetadata) {
	sqlUtil.connect(tx)
	const { jurnaltype_headcopyto, jurnaltype_code } = await sqlUtil.lookupdb(tx, 'act.jurnaltype', 'jurnaltype_id', ret.jurnaltype_id)
	if (jurnaltype_headcopyto!=null) {
		const param = { jurnaltype_headcopyto, jurnaltype_code }
		const jurnaldetil_id_link = ret.jurnaldetil_id_link
		if (jurnaldetil_id_link==null) {
			await createDetilFromHeader(self, tx, ret, param)
		} else {
			await updateDetilFromHeader(self, tx, ret, param)
		}
	}

	await calculateTotal(self, tx, ret)
}


export async function headerCreated(self, tx, ret, data, logMetadata, args) {
	const jurnaltype_headcopyto = args.copyto  // ini di dapat saat sequencerSetup
	const jurnaltype_code = args.prefix
	if (jurnaltype_headcopyto!=null) {
		const param = { jurnaltype_headcopyto, jurnaltype_code }
		await createDetilFromHeader(self, tx, ret, param)
	}

	await calculateTotal(self, tx, ret)
}


async function composeDataDetil(tx, data, copyto) {
	sqlUtil.connect(tx)
	const { agingtype_id, curr_id } = await sqlUtil.lookupdb(tx, 'act.coa', 'coa_id', data.coa_id)
	data.agingtype_id = agingtype_id
	data.coacurr = curr_id

	return {
		jurnaldetil_ishead: true,
		jurnaldetil_descr: data.jurnal_descr,
		jurnaldetil_value: copyto=='K' ? -1*data.jurnal_value : data.jurnal_value,
		jurnaldetil_idr: copyto=='K' ? -1*data.jurnal_idr : data.jurnal_idr,
		coa_id: data.coa_id,
		unit_id: data.unit_id,
		site_id: data.site_id,
		dept_id: data.dept_id,
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

	const tablename = 'act.jurnaldetil'

	try {
		const sequencer = createSequencerLine(tx, {})
		const seqdata = await sequencer.increment(param.jurnaltype_code)

		const data = await composeDataDetil(tx, ret, param.jurnaltype_headcopyto)
		data.jurnaldetil_id = seqdata.id
		data._createby = user_id
		data._createdate = (new Date()).toISOString()

		const cmd = sqlUtil.createInsertCommand(tablename, data)
		await cmd.execute(data)


		// update header jurnaldetil_id_link
		const headdata = {
			jurnal_id: ret.jurnal_id,
			jurnaldetil_id_link: data.jurnaldetil_id
		}  
		const cmdHead =  sqlUtil.createUpdateCommand('act.jurnal', headdata, ['jurnal_id'])
		await cmdHead.execute(headdata)

	} catch (err) {
		throw err
	}
}


async function updateDetilFromHeader(self, tx, ret, param) {
	const req = self.req
	const user_id = req.session.user.userId

	sqlUtil.connect(tx)

	const tablename = 'act.jurnaldetil'

	try {
		const data = await composeDataDetil(tx, ret, param.jurnaltype_headcopyto)
		data.jurnaldetil_id = ret.jurnaldetil_id_link
		data._modifyby = user_id
		data._modifydate = (new Date()).toISOString()

		const cmd =  sqlUtil.createUpdateCommand(tablename, data, ['jurnaldetil_id'])
		const result = await cmd.execute(data)

	} catch (err) {
		throw err
	}
}



export async function detilOpen(self, db, data) {
	await calculateTotal(self, db, data)
}