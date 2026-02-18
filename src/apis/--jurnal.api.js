import pgp from 'pg-promise';

import db from '@agung_dhewe/webapps/src/db.js'
import Api from '@agung_dhewe/webapps/src/api.js'
import sqlUtil from '@agung_dhewe/pgsqlc'
import context from '@agung_dhewe/webapps/src/context.js'  
import logger from '@agung_dhewe/webapps/src/logger.js'
import { createSequencerDocument } from '@agung_dhewe/webapps/src/sequencerdoc.js' 
import { createSequencerLine } from '@agung_dhewe/webapps/src/sequencerline.js' 

import * as Extender from './extenders/jurnal.apiext.js'

const moduleName = 'jurnal'
const headerSectionName = 'header'
const headerTableName = 'act.jurnal' 
const detilTableName = 'act.jurnaldetil'  	

// api: account
export default class extends Api {
	constructor(req, res, next) {
		super(req, res, next);
		Api.cekLogin(req)
	}


	// dipanggil dengan model snake syntax
	// contoh: header-list
	//         header-open-data
	async init(body) { return await jurnal_init(this, body) }

	// header
	async headerList(body) { return await jurnal_headerList(this, body) }
	async headerOpen(body) { return await jurnal_headerOpen(this, body) }
	async headerUpdate(body) { return await jurnal_headerUpdate(this, body)}
	async headerCreate(body) { return await jurnal_headerCreate(this, body)}
	async headerDelete(body) { return await jurnal_headerDelete(this, body) }
	
	
	// detil	
	async detilList(body) { return await jurnal_detilList(this, body) }
	async detilOpen(body) { return await jurnal_detilOpen(this, body) }
	async detilUpdate(body) { return await jurnal_detilUpdate(this, body)}
	async detilCreate(body) { return await jurnal_detilCreate(this, body) }
	async detilDelete(body) { return await jurnal_detilDelete(this, body) }
	async detilDeleteRows(body) { return await jurnal_detilDeleteRows(this, body) }
			
}	

// init module
async function jurnal_init(self, body) {
	const req = self.req

	// set sid untuk session ini, diperlukan ini agar session aktif
	req.session.sid = req.sessionID

	try {
		// ambil data app dari database
		const sql = 'select apps_id, apps_url from core."apps"'
		const result = await db.any(sql)

		const appsUrls = {}
		for (let row of result) {
			appsUrls[row.apps_id] = {
				url: row.apps_url
			}
		}

		const initialData = {
			userId: req.session.user.userId,
			userName: req.session.user.userName,
			userFullname: req.session.userFullname,
			sid: req.session.sid ,
			notifierId: Api.generateNotifierId(moduleName, req.sessionID),
			notifierSocket: req.app.locals.appConfig.notifierSocket,
			appsUrls: appsUrls,
			setting: {}
		}
		
		if (typeof Extender.jurnal_init === 'function') {
			// export async function jurnal_init(self, initialData) {}
			await Extender.jurnal_init(self, initialData)
		}

		return initialData
		
	} catch (err) {
		throw err
	}
}


// data logging
async function jurnal_log(self, body, startTime, tablename, id, action, data={}, remark='') {
	const { source } = body
	const req = self.req
	const user_id = req.session.user.userId
	const user_name = req.session.user.userFullname
	const ipaddress = req.ip
	const metadata = JSON.stringify({...{source:source}, ...data})
	const endTime = process.hrtime.bigint();
	const executionTimeMs = Number((endTime - startTime) / 1_000_000n); // hasil dalam ms tanpa desimal
	
	const logdata = {id, user_id, user_name, moduleName, action, tablename, executionTimeMs, remark, metadata, ipaddress}
	const ret = await logger.log(logdata)
	return ret
}



async function jurnal_headerList(self, body) {
	const tablename = headerTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		searchtext: `jurnal_id=try_cast_bigint(\${searchtext}, 0) OR jurnal_doc = \${searchtext} OR jurnal_descr ILIKE '%' || \${searchtext} || '%'`,
	};

	try {
	
		// jika tidak ada default searchtext
		if (searchMap.searchtext===undefined) {
			throw new Error(`'searchtext' belum didefinisikan di searchMap`)	
		}
		

		// hilangkan criteria '' atau null
		for (var cname in criteria) {
			if (criteria[cname]==='' || criteria[cname]===null) {
				delete criteria[cname]
			}
		}

		const args = { db, criteria }

		// apabila ada keperluan untuk recompose criteria
		if (typeof Extender.headerListCriteria === 'function') {
			// export async function headerListCriteria(self, db, searchMap, criteria, sort, columns, args) {}
			await Extender.headerListCriteria(self, db, searchMap, criteria, sort, columns, args)
		}

		var max_rows = limit==0 ? 10 : limit
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({tablename, columns, whereClause, sort, limit:max_rows+1, offset, queryParams})
		const rows = await db.any(sql, queryParams);

		
		var i = 0
		const data = []
		for (var row of rows) {
			i++
			if (i>max_rows) { break }

			// lookup: jurnaltype_name dari field jurnaltype_name pada table act.jurnaltype dimana (act.jurnaltype.jurnaltype_id = act.jurnal.jurnaltype_id)
			{
				const { jurnaltype_name } = await sqlUtil.lookupdb(db, 'act.jurnaltype', 'jurnaltype_id', row.jurnaltype_id)
				row.jurnaltype_name = jurnaltype_name
			}
			// lookup: paymreq_doc dari field paymreq_doc pada table act.paymreqterm dimana (act.paymreqterm.paymreqterm_id = act.jurnal.paymreqterm_id)
			{
				const { paymreq_doc } = await sqlUtil.lookupdb(db, 'act.paymreqterm', 'paymreqterm_id', row.paymreqterm_id)
				row.paymreq_doc = paymreq_doc
			}
			// lookup: periode_name dari field periode_name pada table act.periode dimana (act.periode.periode_id = act.jurnal.periode_id)
			{
				const { periode_name } = await sqlUtil.lookupdb(db, 'act.periode', 'periode_id', row.periode_id)
				row.periode_name = periode_name
			}
			// lookup: partner_name dari field partner_name pada table ent.partner dimana (ent.partner.partner_id = act.jurnal.partner_id)
			{
				const { partner_name } = await sqlUtil.lookupdb(db, 'ent.partner', 'partner_id', row.partner_id)
				row.partner_name = partner_name
			}
			// lookup: paymtype_name dari field paymtype_name pada table act.paymtype dimana (act.paymtype.paymtype_id = act.jurnal.paymtype_id)
			{
				const { paymtype_name } = await sqlUtil.lookupdb(db, 'act.paymtype', 'paymtype_id', row.paymtype_id)
				row.paymtype_name = paymtype_name
			}
			// lookup: partnerbank_name dari field partnerbank_name pada table ent.partnerbank dimana (ent.partnerbank.partnerbank_id = act.jurnal.partnerbank_id)
			{
				const { partnerbank_name } = await sqlUtil.lookupdb(db, 'ent.partnerbank', 'partnerbank_id', row.partnerbank_id)
				row.partnerbank_name = partnerbank_name
			}
			// lookup: partnercontact_name dari field partnercontact_name pada table ent.partnercontact dimana (ent.partnercontact.partnercontact_id = act.jurnal.partnercontact_id)
			{
				const { partnercontact_name } = await sqlUtil.lookupdb(db, 'ent.partnercontact', 'partnercontact_id', row.partnercontact_id)
				row.partnercontact_name = partnercontact_name
			}
			// lookup: coa_name dari field coa_name pada table act.coa dimana (act.coa.coa_id = act.jurnal.coa_id)
			{
				const { coa_name } = await sqlUtil.lookupdb(db, 'act.coa', 'coa_id', row.coa_id)
				row.coa_name = coa_name
			}
			// lookup: dept_name dari field dept_name pada table ent.dept dimana (ent.dept.dept_id = act.jurnal.dept_id)
			{
				const { dept_name } = await sqlUtil.lookupdb(db, 'ent.dept', 'dept_id', row.dept_id)
				row.dept_name = dept_name
			}
			// lookup: site_name dari field site_name pada table ent.site dimana (ent.site.site_id = act.jurnal.site_id)
			{
				const { site_name } = await sqlUtil.lookupdb(db, 'ent.site', 'site_id', row.site_id)
				row.site_name = site_name
			}
			// lookup: unit_name dari field unit_name pada table ent.unit dimana (ent.unit.unit_id = act.jurnal.unit_id)
			{
				const { unit_name } = await sqlUtil.lookupdb(db, 'ent.unit', 'unit_id', row.unit_id)
				row.unit_name = unit_name
			}
			// lookup: project_name dari field project_name pada table prj.project dimana (prj.project.project_id = act.jurnal.project_id)
			{
				const { project_name } = await sqlUtil.lookupdb(db, 'prj.project', 'project_id', row.project_id)
				row.project_name = project_name
			}
			// lookup: curr_code dari field curr_code pada table ent.curr dimana (ent.curr.curr_id = act.jurnal.curr_id)
			{
				const { curr_code } = await sqlUtil.lookupdb(db, 'ent.curr', 'curr_id', row.curr_id)
				row.curr_code = curr_code
			}
			
			// pasang extender di sini
			if (typeof Extender.headerListRow === 'function') {
				// export async function headerListRow(self, row, args) {}
				await Extender.headerListRow(self, row, args)
			}

			data.push(row)
		}

		var nextoffset = null
		if (rows.length>max_rows) {
			nextoffset = offset+max_rows
		}

		return {
			criteria: criteria,
			limit:  max_rows,
			nextoffset: nextoffset,
			data: data
		}

	} catch (err) {
		throw err
	}
}

async function jurnal_headerOpen(self, body) {
	const tablename = headerTableName

	try {
		const { id } = body 
		const criteria = { jurnal_id: id }
		const searchMap = { jurnal_id: `jurnal_id = \${jurnal_id}`}
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({
			tablename: tablename, 
			columns:[], 
			whereClause, 
			sort:{}, 
			limit:0, 
			offset:0, 
			queryParams
		})
		const data = await db.one(sql, queryParams);
		if (data==null) { 
			throw new Error(`[${tablename}] data dengan id '${id}' tidak ditemukan`) 
		}	

		// lookup: jurnaltype_name dari field jurnaltype_name pada table act.jurnaltype dimana (act.jurnaltype.jurnaltype_id = act.jurnal.jurnaltype_id)
		{
			const { jurnaltype_name } = await sqlUtil.lookupdb(db, 'act.jurnaltype', 'jurnaltype_id', data.jurnaltype_id)
			data.jurnaltype_name = jurnaltype_name
		}
		// lookup: paymreq_doc dari field paymreq_doc pada table act.paymreqterm dimana (act.paymreqterm.paymreqterm_id = act.jurnal.paymreqterm_id)
		{
			const { paymreq_doc } = await sqlUtil.lookupdb(db, 'act.paymreqterm', 'paymreqterm_id', data.paymreqterm_id)
			data.paymreq_doc = paymreq_doc
		}
		// lookup: periode_name dari field periode_name pada table act.periode dimana (act.periode.periode_id = act.jurnal.periode_id)
		{
			const { periode_name } = await sqlUtil.lookupdb(db, 'act.periode', 'periode_id', data.periode_id)
			data.periode_name = periode_name
		}
		// lookup: partner_name dari field partner_name pada table ent.partner dimana (ent.partner.partner_id = act.jurnal.partner_id)
		{
			const { partner_name } = await sqlUtil.lookupdb(db, 'ent.partner', 'partner_id', data.partner_id)
			data.partner_name = partner_name
		}
		// lookup: paymtype_name dari field paymtype_name pada table act.paymtype dimana (act.paymtype.paymtype_id = act.jurnal.paymtype_id)
		{
			const { paymtype_name } = await sqlUtil.lookupdb(db, 'act.paymtype', 'paymtype_id', data.paymtype_id)
			data.paymtype_name = paymtype_name
		}
		// lookup: partnerbank_name dari field partnerbank_name pada table ent.partnerbank dimana (ent.partnerbank.partnerbank_id = act.jurnal.partnerbank_id)
		{
			const { partnerbank_name } = await sqlUtil.lookupdb(db, 'ent.partnerbank', 'partnerbank_id', data.partnerbank_id)
			data.partnerbank_name = partnerbank_name
		}
		// lookup: partnercontact_name dari field partnercontact_name pada table ent.partnercontact dimana (ent.partnercontact.partnercontact_id = act.jurnal.partnercontact_id)
		{
			const { partnercontact_name } = await sqlUtil.lookupdb(db, 'ent.partnercontact', 'partnercontact_id', data.partnercontact_id)
			data.partnercontact_name = partnercontact_name
		}
		// lookup: coa_name dari field coa_name pada table act.coa dimana (act.coa.coa_id = act.jurnal.coa_id)
		{
			const { coa_name } = await sqlUtil.lookupdb(db, 'act.coa', 'coa_id', data.coa_id)
			data.coa_name = coa_name
		}
		// lookup: dept_name dari field dept_name pada table ent.dept dimana (ent.dept.dept_id = act.jurnal.dept_id)
		{
			const { dept_name } = await sqlUtil.lookupdb(db, 'ent.dept', 'dept_id', data.dept_id)
			data.dept_name = dept_name
		}
		// lookup: site_name dari field site_name pada table ent.site dimana (ent.site.site_id = act.jurnal.site_id)
		{
			const { site_name } = await sqlUtil.lookupdb(db, 'ent.site', 'site_id', data.site_id)
			data.site_name = site_name
		}
		// lookup: unit_name dari field unit_name pada table ent.unit dimana (ent.unit.unit_id = act.jurnal.unit_id)
		{
			const { unit_name } = await sqlUtil.lookupdb(db, 'ent.unit', 'unit_id', data.unit_id)
			data.unit_name = unit_name
		}
		// lookup: project_name dari field project_name pada table prj.project dimana (prj.project.project_id = act.jurnal.project_id)
		{
			const { project_name } = await sqlUtil.lookupdb(db, 'prj.project', 'project_id', data.project_id)
			data.project_name = project_name
		}
		// lookup: curr_code dari field curr_code pada table ent.curr dimana (ent.curr.curr_id = act.jurnal.curr_id)
		{
			const { curr_code } = await sqlUtil.lookupdb(db, 'ent.curr', 'curr_id', data.curr_id)
			data.curr_code = curr_code
		}
		

		// lookup data createby
		{
			const { user_fullname } = await sqlUtil.lookupdb(db, 'core.user', 'user_id', data._createby)
			data._createby = user_fullname ?? ''
		}

		// lookup data modifyby
		{
			const { user_fullname } = await sqlUtil.lookupdb(db, 'core.user', 'user_id', data._modifyby)
			data._modifyby = user_fullname ?? ''
		}
		
		// pasang extender untuk olah data
		// export async function headerOpen(self, db, data) {}
		if (typeof Extender.headerOpen === 'function') {
			// export async function headerOpen(self, db, data) {}
			await Extender.headerOpen(self, db, data)
		}

		return data
	} catch (err) {
		throw err
	}
}


async function jurnal_headerCreate(self, body) {
	const { source='jurnal', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = headerTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._createby = user_id
		data._createdate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			const args = { section: 'header', prefix:'XX' }

			// set default document prefix
			args.prefix = 'XX'	
				
			// buat sequencer document	
			const sequencer = createSequencerDocument(tx, { 
				COMPANY_CODE: req.app.locals.appConfig.COMPANY_CODE,
				blockLength: 3,
				numberLength: 6,
			})

			if (typeof Extender.sequencerSetup === 'function') {
				// jika ada keperluan menambahkan code block/cluster di sequencer
				// dapat diimplementasikan di exterder sequencerSetup 
				// export async function sequencerSetup(self, tx, sequencer, data, args) {}
				await Extender.sequencerSetup(self, tx, sequencer, data, args)
			}

			// generate data sesuai prefix (default: XX) reset perbulan
			const seqdata = await sequencer.monthly(args.prefix)	
			data.jurnal_id = seqdata.id

			// apabila ada keperluan pengelohan data sebelum disimpan, lakukan di extender headerCreating
			if (typeof Extender.headerCreating === 'function') {
				// export async function headerCreating(self, tx, data, seqdata, args) {}
				await Extender.headerCreating(self, tx, data, seqdata, args)
			}			
			
			

			const cmd = sqlUtil.createInsertCommand(tablename, data)
			const ret = await cmd.execute(data)

			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.headerCreated === 'function') {
				// export async function headerCreated(self, tx, ret, data, logMetadata, args) {}
				await Extender.headerCreated(self, tx, ret, data, logMetadata, args)
			}

			// record log
			jurnal_log(self, body, startTime, tablename, ret.jurnal_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function jurnal_headerUpdate(self, body) {
	const { source='jurnal', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = headerTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._modifyby = user_id
		data._modifydate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			// apabila ada keperluan pengelohan data sebelum disimpan, lakukan di extender headerCreating
			if (typeof Extender.headerUpdating === 'function') {
				// export async function headerUpdating(self, tx, data) {}
				await Extender.headerUpdating(self, tx, data)
			}

			// eksekusi update
			const cmd = sqlUtil.createUpdateCommand(tablename, data, ['jurnal_id'])
			const ret = await cmd.execute(data)

			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.headerUpdated === 'function') {
				// export async function headerUpdated(self, tx, ret, data, logMetadata) {}
				await Extender.headerUpdated(self, tx, ret, data, logMetadata)
			}			

			// record log
			jurnal_log(self, body, startTime, tablename, data.jurnal_id, 'UPDATE')

			return ret
		})
		

		return result
	} catch (err) {
		throw err
	}
}


async function jurnal_headerDelete(self, body) {
	const { source, id } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = headerTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {jurnal_id: id}

			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender headerDeleting
			if (typeof Extender.headerDeleting === 'function') {
				// export async function headerDeleting(self, tx, dataToRemove) {}
				await Extender.headerDeleting(self, tx, dataToRemove)
			}

			
			// hapus data detil
			{
				const sql = `select * from ${detilTableName} where jurnal_id=\${jurnal_id}`
				const rows = await tx.any(sql, dataToRemove)
				for (let rowdetil of rows) {
					// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
					if (typeof Extender.detilDeleting === 'function') {
						// export async function detilDeleting(self, tx, rowdetil, logMetadata) {}
						await Extender.detilDeleting(self, tx, rowdetil, logMetadata)
					}

					const param = {jurnaldetil_id: rowdetil.jurnaldetil_id}
					const cmd = sqlUtil.createDeleteCommand(detilTableName, ['jurnaldetil_id'])
					const deletedRow = await cmd.execute(param)

					// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
					if (typeof Extender.detilDeleted === 'function') {
						// export async function detilDeleted(self, tx, deletedRow, logMetadata) {}
						await Extender.detilDeleted(self, tx, deletedRow, logMetadata)
					}					

					jurnal_log(self, body, startTime, detilTableName, rowdetil.jurnaldetil_id, 'DELETE', {rowdata: deletedRow})
					jurnal_log(self, body, startTime, headerTableName, rowdetil.jurnal_id, 'DELETE ROW DETIL', {jurnaldetil_id: rowdetil.jurnaldetil_id, tablename: detilTableName}, `removed: ${rowdetil.jurnaldetil_id}`)


				}	
			}

			
			

			// hapus data header
			const cmd = sqlUtil.createDeleteCommand(tablename, ['jurnal_id'])
			const deletedRow = await cmd.execute(dataToRemove)

			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender headerDeleted
			if (typeof Extender.headerDeleted === 'function') {
				// export async function headerDeleted(self, tx, ret, logMetadata) {}
				await Extender.headerDeleted(self, tx, ret, logMetadata)
			}

			// record log
			jurnal_log(self, body, startTime, tablename, id, 'DELETE', logMetadata)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}



// detil	

async function jurnal_detilList(self, body) {
	const tablename = detilTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		jurnal_id: `jurnal_id=try_cast_bigint(\${jurnal_id}, 0)`,
	};


	if (Object.keys(sort).length === 0) {
		sort.jurnaldetil_id = 'asc'
	}


	try {
	
		// hilangkan criteria '' atau null
		for (var cname in criteria) {
			if (criteria[cname]==='' || criteria[cname]===null) {
				delete criteria[cname]
			}
		}

		const args = { db, criteria }

		// apabila ada keperluan untuk recompose criteria
		if (typeof Extender.detilListCriteria === 'function') {
			// export async function detilListCriteria(self, db, searchMap, criteria, sort, columns, args) {}
			await Extender.detilListCriteria(self, db, searchMap, criteria, sort, columns, args)
		}

		var max_rows = limit==0 ? 10 : limit
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({tablename, columns, whereClause, sort, limit:max_rows+1, offset, queryParams})
		const rows = await db.any(sql, queryParams);

		
		var i = 0
		const data = []
		for (var row of rows) {
			i++
			if (i>max_rows) { break }

			// lookup: coa_name dari field coa_name pada table act.coa dimana (act.coa.coa_id = act.jurnal.coa_id)
			{
				const { coa_name } = await sqlUtil.lookupdb(db, 'act.coa', 'coa_id', row.coa_id)
				row.coa_name = coa_name
			}
			// lookup: partner_name dari field partner_name pada table ent.partner dimana (ent.partner.partner_id = act.jurnal.partner_id)
			{
				const { partner_name } = await sqlUtil.lookupdb(db, 'ent.partner', 'partner_id', row.partner_id)
				row.partner_name = partner_name
			}
			// lookup: dept_name dari field dept_name pada table ent.dept dimana (ent.dept.dept_id = act.jurnal.dept_id)
			{
				const { dept_name } = await sqlUtil.lookupdb(db, 'ent.dept', 'dept_id', row.dept_id)
				row.dept_name = dept_name
			}
			// lookup: site_name dari field site_name pada table ent.site dimana (ent.site.site_id = act.jurnal.site_id)
			{
				const { site_name } = await sqlUtil.lookupdb(db, 'ent.site', 'site_id', row.site_id)
				row.site_name = site_name
			}
			// lookup: unit_name dari field unit_name pada table ent.unit dimana (ent.unit.unit_id = act.jurnal.unit_id)
			{
				const { unit_name } = await sqlUtil.lookupdb(db, 'ent.unit', 'unit_id', row.unit_id)
				row.unit_name = unit_name
			}
			// lookup: project_name dari field project_name pada table prj.project dimana (prj.project.project_id = act.jurnal.project_id)
			{
				const { project_name } = await sqlUtil.lookupdb(db, 'prj.project', 'project_id', row.project_id)
				row.project_name = project_name
			}
			// lookup: curr_code dari field curr_code pada table ent.curr dimana (ent.curr.curr_id = act.jurnal.curr_id)
			{
				const { curr_code } = await sqlUtil.lookupdb(db, 'ent.curr', 'curr_id', row.curr_id)
				row.curr_code = curr_code
			}
			// lookup: periode_name dari field periode_name pada table act.periode dimana (act.periode.periode_id = act.jurnal.periode_id)
			{
				const { periode_name } = await sqlUtil.lookupdb(db, 'act.periode', 'periode_id', row.periode_id)
				row.periode_name = periode_name
			}
			

			// pasang extender di sini
			if (typeof Extender.detilListRow === 'function') {
				// export async function detilListRow(self, row, args) {}
				await Extender.detilListRow(self, row, args)
			}

			data.push(row)
		}

		var nextoffset = null
		if (rows.length>max_rows) {
			nextoffset = offset+max_rows
		}

		return {
			criteria: criteria,
			limit:  max_rows,
			nextoffset: nextoffset,
			data: data
		}

	} catch (err) {
		throw err
	}
}

async function jurnal_detilOpen(self, body) {
	const tablename = detilTableName

	try {
		const { id } = body 
		const criteria = { jurnaldetil_id: id }
		const searchMap = { jurnaldetil_id: `jurnaldetil_id = \${jurnaldetil_id}`}
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({
			tablename, 
			columns:[], 
			whereClause, 
			sort:{}, 
			limit:0, 
			offset:0, 
			queryParams
		})
		const data = await db.one(sql, queryParams);
		if (data==null) { 
			throw new Error(`[${tablename}] data dengan id '${id}' tidak ditemukan`) 
		}	


		// lookup: coa_name dari field coa_name pada table act.coa dimana (act.coa.coa_id = act.jurnal.coa_id)
		{
			const { coa_name } = await sqlUtil.lookupdb(db, 'act.coa', 'coa_id', data.coa_id)
			data.coa_name = coa_name
		}
		// lookup: partner_name dari field partner_name pada table ent.partner dimana (ent.partner.partner_id = act.jurnal.partner_id)
		{
			const { partner_name } = await sqlUtil.lookupdb(db, 'ent.partner', 'partner_id', data.partner_id)
			data.partner_name = partner_name
		}
		// lookup: dept_name dari field dept_name pada table ent.dept dimana (ent.dept.dept_id = act.jurnal.dept_id)
		{
			const { dept_name } = await sqlUtil.lookupdb(db, 'ent.dept', 'dept_id', data.dept_id)
			data.dept_name = dept_name
		}
		// lookup: site_name dari field site_name pada table ent.site dimana (ent.site.site_id = act.jurnal.site_id)
		{
			const { site_name } = await sqlUtil.lookupdb(db, 'ent.site', 'site_id', data.site_id)
			data.site_name = site_name
		}
		// lookup: unit_name dari field unit_name pada table ent.unit dimana (ent.unit.unit_id = act.jurnal.unit_id)
		{
			const { unit_name } = await sqlUtil.lookupdb(db, 'ent.unit', 'unit_id', data.unit_id)
			data.unit_name = unit_name
		}
		// lookup: project_name dari field project_name pada table prj.project dimana (prj.project.project_id = act.jurnal.project_id)
		{
			const { project_name } = await sqlUtil.lookupdb(db, 'prj.project', 'project_id', data.project_id)
			data.project_name = project_name
		}
		// lookup: curr_code dari field curr_code pada table ent.curr dimana (ent.curr.curr_id = act.jurnal.curr_id)
		{
			const { curr_code } = await sqlUtil.lookupdb(db, 'ent.curr', 'curr_id', data.curr_id)
			data.curr_code = curr_code
		}
		// lookup: periode_name dari field periode_name pada table act.periode dimana (act.periode.periode_id = act.jurnal.periode_id)
		{
			const { periode_name } = await sqlUtil.lookupdb(db, 'act.periode', 'periode_id', data.periode_id)
			data.periode_name = periode_name
		}
		

		// lookup data createby
		{
			const { user_fullname } = await sqlUtil.lookupdb(db, 'core.user', 'user_id', data._createby)
			data._createby = user_fullname ?? ''
		}

		// lookup data modifyby
		{
			const { user_fullname } = await sqlUtil.lookupdb(db, 'core.user', 'user_id', data._modifyby)
			data._modifyby = user_fullname ?? ''
		}	


		// pasang extender untuk olah data
		// export async function detilOpen(self, db, data) {}
		if (typeof Extender.detilOpen === 'function') {
			// export async function detilOpen(self, db, data) {}
			await Extender.detilOpen(self, db, data)
		}

		return data
	} catch (err) {
		throw err
	}
}

async function jurnal_detilCreate(self, body) {
	const { source='jurnal', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = detilTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._createby = user_id
		data._createdate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			const args = { 
				section: 'detil', 
				prefix: 'XX'	
			}

			const sequencer = createSequencerLine(tx, {})


			if (typeof Extender.sequencerSetup === 'function') {
				// jika ada keperluan menambahkan code block/cluster di sequencer
				// dapat diimplementasikan di exterder sequencerSetup 
				// export async function sequencerSetup(self, tx, sequencer, data, args) {}
				await Extender.sequencerSetup(self, tx, sequencer, data, args)
			}


			const seqdata = await sequencer.increment(args.prefix)
			data.jurnaldetil_id = seqdata.id

			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.detilCreating === 'function') {
				// export async function detilCreating(self, tx, data, seqdata, args) {}
				await Extender.detilCreating(self, tx, data, seqdata, args)
			}

			const cmd = sqlUtil.createInsertCommand(tablename, data)
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.detilCreated === 'function') {
				// export async function detilCreated(self, tx, ret, data, logMetadata, args) {}
				await Extender.detilCreated(self, tx, ret, data, logMetadata, args)
			}

			// record log
			jurnal_log(self, body, startTime, tablename, ret.jurnaldetil_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function jurnal_detilUpdate(self, body) {
	const { source='jurnal', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = detilTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._modifyby = user_id
		data._modifydate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.detilUpdating === 'function') {
				// export async function detilUpdating(self, tx, data) {}
				await Extender.detilUpdating(self, tx, data)
			}			
			
			const cmd =  sqlUtil.createUpdateCommand(tablename, data, ['jurnaldetil_id'])
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.detilUpdated === 'function') {
				// export async function detilUpdated(self, tx, ret, data, logMetadata) {}
				await Extender.detilUpdated(self, tx, ret, data, logMetadata)
			}

			// record log
			jurnal_log(self, body, startTime, tablename, data.jurnaldetil_id, 'UPDATE', logMetadata)

			return ret
		})
	
		return result
	} catch (err) {
		throw err
	}
}

async function jurnal_detilDelete(self, body) {
	const { source, id } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = detilTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {jurnaldetil_id: id}
			const sql = `select * from ${detilTableName} where jurnaldetil_id=\${jurnaldetil_id}`
			const rowdetil = await tx.oneOrNone(sql, dataToRemove)


			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
			if (typeof Extender.detilDeleting === 'function') {
				// export async function detilDeleting(self, tx, rowdetil, logMetadata) {}
				await Extender.detilDeleting(self, tx, rowdetil, logMetadata)
			}

			const param = {jurnaldetil_id: rowdetil.jurnaldetil_id}
			const cmd = sqlUtil.createDeleteCommand(detilTableName, ['jurnaldetil_id'])
			const deletedRow = await cmd.execute(param)

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
			if (typeof Extender.detilDeleted === 'function') {
				// export async function detilDeleted(self, tx, deletedRow, logMetadata) {}
				await Extender.detilDeleted(self, tx, deletedRow, logMetadata)
			}					

			jurnal_log(self, body, startTime, detilTableName, rowdetil.jurnaldetil_id, 'DELETE', {rowdata: deletedRow})
			jurnal_log(self, body, startTime, headerTableName, rowdetil.jurnal_id, 'DELETE ROW DETIL', {jurnaldetil_id: rowdetil.jurnaldetil_id, tablename: detilTableName}, `removed: ${rowdetil.jurnaldetil_id}`)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}

async function jurnal_detilDeleteRows(self, body) {
	const { data } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = detilTableName


	try {
		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			for (let id of data) {
				const dataToRemove = {jurnaldetil_id: id}
				const sql = `select * from ${detilTableName} where jurnaldetil_id=\${jurnaldetil_id}`
				const rowdetil = await tx.oneOrNone(sql, dataToRemove)

				// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
				if (typeof Extender.detilDeleting === 'function') {
					// async function detilDeleting(self, tx, rowdetil, logMetadata) {}
					await Extender.detilDeleting(self, tx, rowdetil, logMetadata)
				}

				const param = {jurnaldetil_id: rowdetil.jurnaldetil_id}
				const cmd = sqlUtil.createDeleteCommand(detilTableName, ['jurnaldetil_id'])
				const deletedRow = await cmd.execute(param)

				// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
				if (typeof Extender.detilDeleted === 'function') {
					// export async function detilDeleted(self, tx, deletedRow, logMetadata) {}
					await Extender.detilDeleted(self, tx, deletedRow, logMetadata)
				}					

				jurnal_log(self, body, startTime, detilTableName, rowdetil.jurnaldetil_id, 'DELETE', {rowdata: deletedRow})
				jurnal_log(self, body, startTime, headerTableName, rowdetil.jurnal_id, 'DELETE ROW DETIL', {jurnaldetil_id: rowdetil.jurnaldetil_id, tablename: detilTableName}, `removed: ${rowdetil.jurnaldetil_id}`)
			}
		})

		const res = {
			deleted: true,
			message: ''
		}
		return res
	} catch (err) {
		throw err
	}	
}

	