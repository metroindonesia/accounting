import pgp from 'pg-promise';

import db from '@agung_dhewe/webapps/src/db.js'
import Api from '@agung_dhewe/webapps/src/api.js'
import sqlUtil from '@agung_dhewe/pgsqlc'
import context from '@agung_dhewe/webapps/src/context.js'  
import logger from '@agung_dhewe/webapps/src/logger.js'
import { createSequencerLine } from '@agung_dhewe/webapps/src/sequencerline.js' 

import * as Extender from './extenders/curr.apiext.js'

const moduleName = 'curr'
const headerSectionName = 'header'
const headerTableName = 'public.curr' 
const rateTableName = 'public.currrate'  	

// api: account
export default class extends Api {
	constructor(req, res, next) {
		super(req, res, next);
		Api.cekLogin(req)
	}


	// dipanggil dengan model snake syntax
	// contoh: header-list
	//         header-open-data
	async init(body) { return await curr_init(this, body) }

	// extender call
	async execute(body) { return await curr_execute(this, body) }

	// header
	async headerList(body) { return await curr_headerList(this, body) }
	async headerOpen(body) { return await curr_headerOpen(this, body) }
	async headerUpdate(body) { return await curr_headerUpdate(this, body)}
	async headerCreate(body) { return await curr_headerCreate(this, body)}
	async headerDelete(body) { return await curr_headerDelete(this, body) }

	
	// rate	
	async rateList(body) { return await curr_rateList(this, body) }
	async rateOpen(body) { return await curr_rateOpen(this, body) }
	async rateUpdate(body) { return await curr_rateUpdate(this, body)}
	async rateCreate(body) { return await curr_rateCreate(this, body) }
	async rateDelete(body) { return await curr_rateDelete(this, body) }
	async rateDeleteRows(body) { return await curr_rateDeleteRows(this, body) }
			
}	

// init module
async function curr_init(self, body) {
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
		
		if (typeof Extender.curr_init === 'function') {
			// export async function curr_init(self, initialData) {}
			await Extender.curr_init(self, initialData)
		}

		return initialData
		
	} catch (err) {
		throw err
	}
}


// execute extender function
async function curr_execute(self, body) {
	const { fnName } = body

	if (fnName==null || fnName=='') {
		throw new Error('fnName belum didefinisikan di api call') 
	}

	if (typeof Extender[fnName] === 'function') {
		// export async function [fnName](self, db, body, curr_log) {}
		return await Extender[fnName](self, db, body, curr_log)
	} else {
		// api function extender tidak ditemukan
		throw new Error(`${fnName} tidak ditmukan di extender`)
	}
}


// data logging
async function curr_log(self, body, startTime, tablename, id, action, data={}, remark='') {
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





async function curr_headerList(self, body) {
	const tablename = headerTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		searchtext: `curr_name = \${searchtext} OR curr_descr ILIKE '%' || \${searchtext} || '%'`,
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

async function curr_headerOpen(self, body) {
	const tablename = headerTableName

	try {
		const { id } = body 
		const criteria = { curr_id: id }
		const searchMap = { curr_id: `curr_id = \${curr_id}`}
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


async function curr_headerCreate(self, body) {
	const { source='curr', data={} } = body
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


			const args = { section: 'header', doc_id:'' }

				
			// apabila ada keperluan pengelohan data sebelum disimpan, lakukan di extender headerCreating
			if (typeof Extender.headerCreating === 'function') {
				// export async function headerCreating(self, tx, data, seqdata, args) {}
				await Extender.headerCreating(self, tx, data, null, args)
			}

			const cmd = sqlUtil.createInsertCommand(tablename, data, ['curr_id'])
			const ret = await cmd.execute(data)

			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.headerCreated === 'function') {
				// export async function headerCreated(self, tx, ret, data, logMetadata, args) {}
				await Extender.headerCreated(self, tx, ret, data, logMetadata, args)
			}

			// record log
			curr_log(self, body, startTime, tablename, ret.curr_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function curr_headerUpdate(self, body) {
	const { source='curr', data={} } = body
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
			const cmd = sqlUtil.createUpdateCommand(tablename, data, ['curr_id'])
			const ret = await cmd.execute(data)

			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.headerUpdated === 'function') {
				// export async function headerUpdated(self, tx, ret, data, logMetadata) {}
				await Extender.headerUpdated(self, tx, ret, data, logMetadata)
			}			

			// record log
			curr_log(self, body, startTime, tablename, data.curr_id, 'UPDATE')

			return ret
		})
		

		return result
	} catch (err) {
		throw err
	}
}


async function curr_headerDelete(self, body) {
	const { source, id } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = headerTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {curr_id: id}

			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender headerDeleting
			if (typeof Extender.headerDeleting === 'function') {
				// export async function headerDeleting(self, tx, dataToRemove) {}
				await Extender.headerDeleting(self, tx, dataToRemove)
			}

			
			// hapus data rate
			{
				const sql = `select * from ${rateTableName} where curr_id=\${curr_id}`
				const rows = await tx.any(sql, dataToRemove)
				for (let rowrate of rows) {
					
					const logMetadata = {}
					
					// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
					if (typeof Extender.rateDeleting === 'function') {
						// export async function rateDeleting(self, tx, rowrate, logMetadata) {}
						await Extender.rateDeleting(self, tx, rowrate, logMetadata)
					}

					const param = {currrate_id: rowrate.currrate_id}
					const cmd = sqlUtil.createDeleteCommand(rateTableName, ['currrate_id'])
					const deletedRow = await cmd.execute(param)

					// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
					if (typeof Extender.rateDeleted === 'function') {
						// export async function rateDeleted(self, tx, deletedRow, logMetadata) {}
						await Extender.rateDeleted(self, tx, deletedRow, logMetadata)
					}					

					curr_log(self, body, startTime, rateTableName, rowrate.currrate_id, 'DELETE', {rowdata: deletedRow})
					curr_log(self, body, startTime, headerTableName, rowrate.curr_id, 'DELETE ROW RATE', {currrate_id: rowrate.currrate_id, tablename: rateTableName}, `removed: ${rowrate.currrate_id}`)


				}	
			}

			
			

			// hapus data header
			const cmd = sqlUtil.createDeleteCommand(tablename, ['curr_id'])
			const deletedRow = await cmd.execute(dataToRemove)

			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender headerDeleted
			if (typeof Extender.headerDeleted === 'function') {
				// export async function headerDeleted(self, tx, deletedRow, logMetadata) {}
				await Extender.headerDeleted(self, tx, deletedRow, logMetadata)
			}

			// record log
			curr_log(self, body, startTime, tablename, id, 'DELETE', logMetadata)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}



// rate	

async function curr_rateList(self, body) {
	const tablename = rateTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		curr_id: `curr_id=try_cast_bigint(\${curr_id}, 0)`,
	};


	if (Object.keys(sort).length === 0) {
		sort.currrate_id = 'asc'
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
		if (typeof Extender.rateListCriteria === 'function') {
			// export async function rateListCriteria(self, db, searchMap, criteria, sort, columns, args) {}
			await Extender.rateListCriteria(self, db, searchMap, criteria, sort, columns, args)
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

async function curr_rateOpen(self, body) {
	const tablename = rateTableName

	try {
		const { id } = body 
		const criteria = { currrate_id: id }
		const searchMap = { currrate_id: `currrate_id = \${currrate_id}`}
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
		// export async function rateOpen(self, db, data) {}
		if (typeof Extender.rateOpen === 'function') {
			// export async function rateOpen(self, db, data) {}
			await Extender.rateOpen(self, db, data)
		}

		return data
	} catch (err) {
		throw err
	}
}

async function curr_rateCreate(self, body) {
	const { source='curr', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = rateTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._createby = user_id
		data._createdate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			const args = { 
				section: 'rate', 
				prefix: ''	
			}

			const sequencer = createSequencerLine(tx, {})


			if (typeof Extender.sequencerSetup === 'function') {
				// jika ada keperluan menambahkan code block/cluster di sequencer
				// dapat diimplementasikan di exterder sequencerSetup 
				// export async function sequencerSetup(self, tx, sequencer, data, args) {}
				await Extender.sequencerSetup(self, tx, sequencer, data, args)
			}


			const seqdata = await sequencer.increment(args.prefix)
			data.currrate_id = seqdata.id

			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.rateCreating === 'function') {
				// export async function rateCreating(self, tx, data, seqdata, args) {}
				await Extender.rateCreating(self, tx, data, seqdata, args)
			}

			const cmd = sqlUtil.createInsertCommand(tablename, data)
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.rateCreated === 'function') {
				// export async function rateCreated(self, tx, ret, data, logMetadata, args) {}
				await Extender.rateCreated(self, tx, ret, data, logMetadata, args)
			}

			// record log
			curr_log(self, body, startTime, tablename, ret.currrate_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function curr_rateUpdate(self, body) {
	const { source='curr', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = rateTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._modifyby = user_id
		data._modifydate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.rateUpdating === 'function') {
				// export async function rateUpdating(self, tx, data) {}
				await Extender.rateUpdating(self, tx, data)
			}			
			
			const cmd =  sqlUtil.createUpdateCommand(tablename, data, ['currrate_id'])
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.rateUpdated === 'function') {
				// export async function rateUpdated(self, tx, ret, data, logMetadata) {}
				await Extender.rateUpdated(self, tx, ret, data, logMetadata)
			}

			// record log
			curr_log(self, body, startTime, tablename, data.currrate_id, 'UPDATE', logMetadata)

			return ret
		})
	
		return result
	} catch (err) {
		throw err
	}
}

async function curr_rateDelete(self, body) {
	const { source, id } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = rateTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {currrate_id: id}
			const sql = `select * from ${rateTableName} where currrate_id=\${currrate_id}`
			const rowrate = await tx.oneOrNone(sql, dataToRemove)

			const logMetadata = {}

			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
			if (typeof Extender.rateDeleting === 'function') {
				// export async function rateDeleting(self, tx, rowrate, logMetadata) {}
				await Extender.rateDeleting(self, tx, rowrate, logMetadata)
			}

			const param = {currrate_id: rowrate.currrate_id}
			const cmd = sqlUtil.createDeleteCommand(rateTableName, ['currrate_id'])
			const deletedRow = await cmd.execute(param)

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
			if (typeof Extender.rateDeleted === 'function') {
				// export async function rateDeleted(self, tx, deletedRow, logMetadata) {}
				await Extender.rateDeleted(self, tx, deletedRow, logMetadata)
			}					

			curr_log(self, body, startTime, rateTableName, rowrate.currrate_id, 'DELETE', {rowdata: deletedRow})
			curr_log(self, body, startTime, headerTableName, rowrate.curr_id, 'DELETE ROW RATE', {currrate_id: rowrate.currrate_id, tablename: rateTableName}, `removed: ${rowrate.currrate_id}`)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}

async function curr_rateDeleteRows(self, body) {
	const { data } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = rateTableName


	try {

		let curr_id
		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			for (let id of data) {
				const dataToRemove = {currrate_id: id}
				const sql = `select * from ${rateTableName} where currrate_id=\${currrate_id}`
				const rowrate = await tx.oneOrNone(sql, dataToRemove)
				curr_id = rowrate.curr_id

				const logMetadata = {}

				
				// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
				if (typeof Extender.rateDeleting === 'function') {
					// async function rateDeleting(self, tx, rowrate, logMetadata) {}
					await Extender.rateDeleting(self, tx, rowrate, logMetadata)
				}

				const param = {currrate_id: rowrate.currrate_id}
				const cmd = sqlUtil.createDeleteCommand(rateTableName, ['currrate_id'])
				const deletedRow = await cmd.execute(param)

				// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
				if (typeof Extender.rateDeleted === 'function') {
					// export async function rateDeleted(self, tx, deletedRow, logMetadata) {}
					await Extender.rateDeleted(self, tx, deletedRow, logMetadata)
				}					

				curr_log(self, body, startTime, rateTableName, rowrate.currrate_id, 'DELETE', {rowdata: deletedRow})
				curr_log(self, body, startTime, headerTableName, rowrate.curr_id, 'DELETE ROW RATE', {currrate_id: rowrate.currrate_id, tablename: rateTableName}, `removed: ${rowrate.currrate_id}`)
			}
		})
		

		const res = {
			deleted: true,
			curr_id: curr_id,
			message: ''
		}

		// apabila ada keperluan update info / pemrosesan data setelah hapus multirow, lakukan di extender
		const fn_name = 'rateRowsDeleted'
		const fn = Extender[fn_name]
		if (typeof fn === 'function') {
			// export async function rateRowsDeleted(self, db, res) {}
			await fn(self, db, res)
		}

		return res
	} catch (err) {
		throw err
	}	
}

	