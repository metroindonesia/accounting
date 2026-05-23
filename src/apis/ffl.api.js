import pgp from 'pg-promise';

import db from '@agung_dhewe/webapps/src/db.js'
import Api from '@agung_dhewe/webapps/src/api.js'
import sqlUtil from '@agung_dhewe/pgsqlc'
import context from '@agung_dhewe/webapps/src/context.js'  
import logger from '@agung_dhewe/webapps/src/logger.js'
import { createSequencerDocument } from '@agung_dhewe/webapps/src/sequencerdoc.js' 
import { createSequencerLine } from '@agung_dhewe/webapps/src/sequencerline.js' 

import * as Extender from './extenders/ffl.apiext.js'

const moduleName = 'ffl'
const headerSectionName = 'header'
const headerTableName = 'public.ffl' 
const detilTableName = 'public.ffldetil'  	

// api: account
export default class extends Api {
	constructor(req, res, next) {
		super(req, res, next);
		Api.cekLogin(req)
	}


	// dipanggil dengan model snake syntax
	// contoh: header-list
	//         header-open-data
	async init(body) { return await ffl_init(this, body) }

	// extender call
	async execute(body) { return await ffl_execute(this, body) }

	// header
	async headerList(body) { return await ffl_headerList(this, body) }
	async headerOpen(body) { return await ffl_headerOpen(this, body) }
	async headerUpdate(body) { return await ffl_headerUpdate(this, body)}
	async headerCreate(body) { return await ffl_headerCreate(this, body)}
	async headerDelete(body) { return await ffl_headerDelete(this, body) }

	
	// detil	
	async detilList(body) { return await ffl_detilList(this, body) }
	async detilOpen(body) { return await ffl_detilOpen(this, body) }
	async detilUpdate(body) { return await ffl_detilUpdate(this, body)}
	async detilCreate(body) { return await ffl_detilCreate(this, body) }
	async detilDelete(body) { return await ffl_detilDelete(this, body) }
	async detilDeleteRows(body) { return await ffl_detilDeleteRows(this, body) }
			
}	

// init module
async function ffl_init(self, body) {
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
			appName: req.app.locals.appConfig.appName,
			appsUrls: appsUrls,
			setting: {}
		}
		
		if (typeof Extender.ffl_init === 'function') {
			// export async function ffl_init(self, initialData) {}
			await Extender.ffl_init(self, initialData)
		}

		return initialData
		
	} catch (err) {
		throw err
	}
}


// execute extender function
async function ffl_execute(self, body) {
	const { fnName } = body

	if (fnName==null || fnName=='') {
		throw new Error('fnName belum didefinisikan di api call') 
	}

	if (typeof Extender[fnName] === 'function') {
		// export async function [fnName](self, db, body, ffl_log) {}
		return await Extender[fnName](self, db, body, ffl_log)
	} else {
		// api function extender tidak ditemukan
		throw new Error(`${fnName} tidak ditmukan di extender`)
	}
}


// data logging
async function ffl_log(self, body, startTime, tablename, id, action, data={}, remark='') {
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





async function ffl_headerList(self, body) {
	const tablename = headerTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		searchtext: `ffl_descr ILIKE '%' || \${searchtext} || '%'`,
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

		const args = { db, criteria, tablename }

		// apabila ada keperluan untuk recompose criteria
		if (typeof Extender.headerListCriteria === 'function') {
			// export async function headerListCriteria(self, db, searchMap, criteria, sort, columns, args) {}
			await Extender.headerListCriteria(self, db, searchMap, criteria, sort, columns, args)
		}

		var max_rows = limit==0 ? 10 : limit
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({
			tablename: args.tablename, 
			columns, 
			whereClause, 
			sort: args.sqlSort ?? sort,
			limit:max_rows+1, 
			offset, 
			queryParams
		})

		const rows = await db.any(sql, queryParams);

		
		var i = 0
		const data = []
		for (var row of rows) {
			i++
			if (i>max_rows) { break }

			
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

async function ffl_headerOpen(self, body) {
	const tablename = headerTableName

	try {
		const { id } = body 
		const criteria = { ffl_id: id }
		const searchMap = { ffl_id: `ffl_id = \${ffl_id}`}
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


async function ffl_headerCreate(self, body) {
	const { source='ffl', data={} } = body
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


			const args = { section: 'header', doc_id:'FLMN' }

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

			// generate data sesuai prefix dari doc_id (default:  FLMN) reset pertahun
			const seqdata = await sequencer.yearly(args.doc_id)	
			data.ffl_id = seqdata.id

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
			ffl_log(self, body, startTime, tablename, ret.ffl_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function ffl_headerUpdate(self, body) {
	const { source='ffl', data={} } = body
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
			const cmd = sqlUtil.createUpdateCommand(tablename, data, ['ffl_id'])
			const ret = await cmd.execute(data)

			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.headerUpdated === 'function') {
				// export async function headerUpdated(self, tx, ret, data, logMetadata) {}
				await Extender.headerUpdated(self, tx, ret, data, logMetadata)
			}			

			// record log
			ffl_log(self, body, startTime, tablename, data.ffl_id, 'UPDATE')

			return ret
		})
		

		return result
	} catch (err) {
		throw err
	}
}


async function ffl_headerDelete(self, body) {
	const { source, id } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = headerTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {ffl_id: id}

			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender headerDeleting
			if (typeof Extender.headerDeleting === 'function') {
				// export async function headerDeleting(self, tx, dataToRemove) {}
				await Extender.headerDeleting(self, tx, dataToRemove)
			}

			
			// hapus data detil
			{
				const sql = `select * from ${detilTableName} where ffl_id=\${ffl_id}`
				const rows = await tx.any(sql, dataToRemove)
				for (let rowdetil of rows) {
					
					const logMetadata = {}
					
					// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
					if (typeof Extender.detilDeleting === 'function') {
						// export async function detilDeleting(self, tx, rowdetil, logMetadata) {}
						await Extender.detilDeleting(self, tx, rowdetil, logMetadata)
					}

					const param = {ffldetil_id: rowdetil.ffldetil_id}
					const cmd = sqlUtil.createDeleteCommand(detilTableName, ['ffldetil_id'])
					const deletedRow = await cmd.execute(param)

					// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
					if (typeof Extender.detilDeleted === 'function') {
						// export async function detilDeleted(self, tx, deletedRow, logMetadata) {}
						await Extender.detilDeleted(self, tx, deletedRow, logMetadata)
					}					

					ffl_log(self, body, startTime, detilTableName, rowdetil.ffldetil_id, 'DELETE', {rowdata: deletedRow})
					ffl_log(self, body, startTime, headerTableName, rowdetil.ffl_id, 'DELETE ROW DETIL', {ffldetil_id: rowdetil.ffldetil_id, tablename: detilTableName}, `removed: ${rowdetil.ffldetil_id}`)


				}	
			}

			
			

			// hapus data header
			const cmd = sqlUtil.createDeleteCommand(tablename, ['ffl_id'])
			const deletedRow = await cmd.execute(dataToRemove)

			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender headerDeleted
			if (typeof Extender.headerDeleted === 'function') {
				// export async function headerDeleted(self, tx, deletedRow, logMetadata) {}
				await Extender.headerDeleted(self, tx, deletedRow, logMetadata)
			}

			// record log
			ffl_log(self, body, startTime, tablename, id, 'DELETE', logMetadata)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}



// detil	

async function ffl_detilList(self, body) {
	const tablename = detilTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		ffl_id: `ffl_id=try_cast_bigint(\${ffl_id}, 0)`,
	};


	if (Object.keys(sort).length === 0) {
		sort.ffldetil_id = 'asc'
	}


	try {
	
		// hilangkan criteria '' atau null
		for (var cname in criteria) {
			if (criteria[cname]==='' || criteria[cname]===null) {
				delete criteria[cname]
			}
		}

		const args = { db, criteria, tablename }

		// apabila ada keperluan untuk recompose criteria
		if (typeof Extender.detilListCriteria === 'function') {
			// export async function detilListCriteria(self, db, searchMap, criteria, sort, columns, args) {}
			await Extender.detilListCriteria(self, db, searchMap, criteria, sort, columns, args)
		}

		var max_rows = limit==0 ? 10 : limit
		const {whereClause, queryParams} = sqlUtil.createWhereClause(criteria, searchMap) 
		const sql = sqlUtil.createSqlSelect({
			tablename: args.tablename, 
			columns, 
			whereClause, 
			sort: args.sqlSort ?? sort, 
			limit:max_rows+1, 
			offset, 
			queryParams
		})
		const rows = await db.any(sql, queryParams);

		
		var i = 0
		const data = []
		for (var row of rows) {
			i++
			if (i>max_rows) { break }

			

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


		const listData = {
			criteria: criteria,
			limit:  max_rows,
			nextoffset: nextoffset,
			data: data
		}

		if (typeof Extender.detilList === 'function') {
			// export async function detilList(self, listData, args) {}
			await Extender.detilList(self, listData, args)
		}

		return listData
	} catch (err) {
		throw err
	}
}

async function ffl_detilOpen(self, body) {
	const tablename = detilTableName

	try {
		const { id } = body 
		const criteria = { ffldetil_id: id }
		const searchMap = { ffldetil_id: `ffldetil_id = \${ffldetil_id}`}
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

async function ffl_detilCreate(self, body) {
	const { source='ffl', data={} } = body
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
				prefix: 'FLMN'	
			}

			const sequencer = createSequencerLine(tx, {})


			if (typeof Extender.sequencerSetup === 'function') {
				// jika ada keperluan menambahkan code block/cluster di sequencer
				// dapat diimplementasikan di exterder sequencerSetup 
				// export async function sequencerSetup(self, tx, sequencer, data, args) {}
				await Extender.sequencerSetup(self, tx, sequencer, data, args)
			}


			const seqdata = await sequencer.increment(args.prefix)
			data.ffldetil_id = seqdata.id

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
			ffl_log(self, body, startTime, tablename, ret.ffldetil_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function ffl_detilUpdate(self, body) {
	const { source='ffl', data={} } = body
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
			
			const cmd =  sqlUtil.createUpdateCommand(tablename, data, ['ffldetil_id'])
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.detilUpdated === 'function') {
				// export async function detilUpdated(self, tx, ret, data, logMetadata) {}
				await Extender.detilUpdated(self, tx, ret, data, logMetadata)
			}

			// record log
			ffl_log(self, body, startTime, tablename, data.ffldetil_id, 'UPDATE', logMetadata)

			return ret
		})
	
		return result
	} catch (err) {
		throw err
	}
}

async function ffl_detilDelete(self, body) {
	const { source, id } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = detilTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {ffldetil_id: id}
			const sql = `select * from ${detilTableName} where ffldetil_id=\${ffldetil_id}`
			const rowdetil = await tx.oneOrNone(sql, dataToRemove)

			const logMetadata = {}

			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
			if (typeof Extender.detilDeleting === 'function') {
				// export async function detilDeleting(self, tx, rowdetil, logMetadata) {}
				await Extender.detilDeleting(self, tx, rowdetil, logMetadata)
			}

			const param = {ffldetil_id: rowdetil.ffldetil_id}
			const cmd = sqlUtil.createDeleteCommand(detilTableName, ['ffldetil_id'])
			const deletedRow = await cmd.execute(param)

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
			if (typeof Extender.detilDeleted === 'function') {
				// export async function detilDeleted(self, tx, deletedRow, logMetadata) {}
				await Extender.detilDeleted(self, tx, deletedRow, logMetadata)
			}					

			ffl_log(self, body, startTime, detilTableName, rowdetil.ffldetil_id, 'DELETE', {rowdata: deletedRow})
			ffl_log(self, body, startTime, headerTableName, rowdetil.ffl_id, 'DELETE ROW DETIL', {ffldetil_id: rowdetil.ffldetil_id, tablename: detilTableName}, `removed: ${rowdetil.ffldetil_id}`)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}

async function ffl_detilDeleteRows(self, body) {
	const { data } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = detilTableName


	try {

		let ffl_id
		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			for (let id of data) {
				const dataToRemove = {ffldetil_id: id}
				const sql = `select * from ${detilTableName} where ffldetil_id=\${ffldetil_id}`
				const rowdetil = await tx.oneOrNone(sql, dataToRemove)
				ffl_id = rowdetil.ffl_id

				const logMetadata = {}

				
				// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
				if (typeof Extender.detilDeleting === 'function') {
					// async function detilDeleting(self, tx, rowdetil, logMetadata) {}
					await Extender.detilDeleting(self, tx, rowdetil, logMetadata)
				}

				const param = {ffldetil_id: rowdetil.ffldetil_id}
				const cmd = sqlUtil.createDeleteCommand(detilTableName, ['ffldetil_id'])
				const deletedRow = await cmd.execute(param)

				// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
				if (typeof Extender.detilDeleted === 'function') {
					// export async function detilDeleted(self, tx, deletedRow, logMetadata) {}
					await Extender.detilDeleted(self, tx, deletedRow, logMetadata)
				}					

				ffl_log(self, body, startTime, detilTableName, rowdetil.ffldetil_id, 'DELETE', {rowdata: deletedRow})
				ffl_log(self, body, startTime, headerTableName, rowdetil.ffl_id, 'DELETE ROW DETIL', {ffldetil_id: rowdetil.ffldetil_id, tablename: detilTableName}, `removed: ${rowdetil.ffldetil_id}`)
			}
		})
		

		const res = {
			deleted: true,
			ffl_id: ffl_id,
			message: ''
		}

		// apabila ada keperluan update info / pemrosesan data setelah hapus multirow, lakukan di extender
		const fn_name = 'detilRowsDeleted'
		const fn = Extender[fn_name]
		if (typeof fn === 'function') {
			// export async function detilRowsDeleted(self, db, res) {}
			await fn(self, db, res)
		}

		return res
	} catch (err) {
		throw err
	}	
}

	