import pgp from 'pg-promise';

import db from '@agung_dhewe/webapps/src/db.js'
import Api from '@agung_dhewe/webapps/src/api.js'
import sqlUtil from '@agung_dhewe/pgsqlc'
import context from '@agung_dhewe/webapps/src/context.js'  
import logger from '@agung_dhewe/webapps/src/logger.js'
import { createSequencerLine } from '@agung_dhewe/webapps/src/sequencerline.js' 

import * as Extender from './extenders/jurnaltype.apiext.js'

const moduleName = 'jurnaltype'
const headerSectionName = 'header'
const headerTableName = 'public.jurnaltype' 
const coaTableName = 'public.jurnaltypecoa'  
const userTableName = 'public.jurnaltypeuser'  	

// api: account
export default class extends Api {
	constructor(req, res, next) {
		super(req, res, next);
		Api.cekLogin(req)
	}


	// dipanggil dengan model snake syntax
	// contoh: header-list
	//         header-open-data
	async init(body) { return await jurnaltype_init(this, body) }

	// header
	async headerList(body) { return await jurnaltype_headerList(this, body) }
	async headerOpen(body) { return await jurnaltype_headerOpen(this, body) }
	async headerUpdate(body) { return await jurnaltype_headerUpdate(this, body)}
	async headerCreate(body) { return await jurnaltype_headerCreate(this, body)}
	async headerDelete(body) { return await jurnaltype_headerDelete(this, body) }
	
	
	// coa	
	async coaList(body) { return await jurnaltype_coaList(this, body) }
	async coaOpen(body) { return await jurnaltype_coaOpen(this, body) }
	async coaUpdate(body) { return await jurnaltype_coaUpdate(this, body)}
	async coaCreate(body) { return await jurnaltype_coaCreate(this, body) }
	async coaDelete(body) { return await jurnaltype_coaDelete(this, body) }
	async coaDeleteRows(body) { return await jurnaltype_coaDeleteRows(this, body) }
	
	// user	
	async userList(body) { return await jurnaltype_userList(this, body) }
	async userOpen(body) { return await jurnaltype_userOpen(this, body) }
	async userUpdate(body) { return await jurnaltype_userUpdate(this, body)}
	async userCreate(body) { return await jurnaltype_userCreate(this, body) }
	async userDelete(body) { return await jurnaltype_userDelete(this, body) }
	async userDeleteRows(body) { return await jurnaltype_userDeleteRows(this, body) }
			
}	

// init module
async function jurnaltype_init(self, body) {
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
		
		if (typeof Extender.jurnaltype_init === 'function') {
			// export async function jurnaltype_init(self, initialData) {}
			await Extender.jurnaltype_init(self, initialData)
		}

		return initialData
		
	} catch (err) {
		throw err
	}
}


// data logging
async function jurnaltype_log(self, body, startTime, tablename, id, action, data={}, remark='') {
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



async function jurnaltype_headerList(self, body) {
	const tablename = headerTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		searchtext: `jurnaltype_name ILIKE '%' || \${searchtext} || '%'`,
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

async function jurnaltype_headerOpen(self, body) {
	const tablename = headerTableName

	try {
		const { id } = body 
		const criteria = { jurnaltype_id: id }
		const searchMap = { jurnaltype_id: `jurnaltype_id = \${jurnaltype_id}`}
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


async function jurnaltype_headerCreate(self, body) {
	const { source='jurnaltype', data={} } = body
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


			const args = { section: 'header', prefix:'' }

				
			// apabila ada keperluan pengelohan data sebelum disimpan, lakukan di extender headerCreating
			if (typeof Extender.headerCreating === 'function') {
				// export async function headerCreating(self, tx, data, seqdata, args) {}
				await Extender.headerCreating(self, tx, data, null, args)
			}

			const cmd = sqlUtil.createInsertCommand(tablename, data, ['jurnaltype_id'])
			const ret = await cmd.execute(data)

			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.headerCreated === 'function') {
				// export async function headerCreated(self, tx, ret, data, logMetadata, args) {}
				await Extender.headerCreated(self, tx, ret, data, logMetadata, args)
			}

			// record log
			jurnaltype_log(self, body, startTime, tablename, ret.jurnaltype_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function jurnaltype_headerUpdate(self, body) {
	const { source='jurnaltype', data={} } = body
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
			const cmd = sqlUtil.createUpdateCommand(tablename, data, ['jurnaltype_id'])
			const ret = await cmd.execute(data)

			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.headerUpdated === 'function') {
				// export async function headerUpdated(self, tx, ret, data, logMetadata) {}
				await Extender.headerUpdated(self, tx, ret, data, logMetadata)
			}			

			// record log
			jurnaltype_log(self, body, startTime, tablename, data.jurnaltype_id, 'UPDATE')

			return ret
		})
		

		return result
	} catch (err) {
		throw err
	}
}


async function jurnaltype_headerDelete(self, body) {
	const { source, id } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = headerTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {jurnaltype_id: id}

			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender headerDeleting
			if (typeof Extender.headerDeleting === 'function') {
				// export async function headerDeleting(self, tx, dataToRemove) {}
				await Extender.headerDeleting(self, tx, dataToRemove)
			}

			
			// hapus data coa
			{
				const sql = `select * from ${coaTableName} where jurnaltype_id=\${jurnaltype_id}`
				const rows = await tx.any(sql, dataToRemove)
				for (let rowcoa of rows) {
					// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
					if (typeof Extender.coaDeleting === 'function') {
						// export async function coaDeleting(self, tx, rowcoa, logMetadata) {}
						await Extender.coaDeleting(self, tx, rowcoa, logMetadata)
					}

					const param = {jurnaltypecoa_id: rowcoa.jurnaltypecoa_id}
					const cmd = sqlUtil.createDeleteCommand(coaTableName, ['jurnaltypecoa_id'])
					const deletedRow = await cmd.execute(param)

					// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
					if (typeof Extender.coaDeleted === 'function') {
						// export async function coaDeleted(self, tx, deletedRow, logMetadata) {}
						await Extender.coaDeleted(self, tx, deletedRow, logMetadata)
					}					

					jurnaltype_log(self, body, startTime, coaTableName, rowcoa.jurnaltypecoa_id, 'DELETE', {rowdata: deletedRow})
					jurnaltype_log(self, body, startTime, headerTableName, rowcoa.jurnaltype_id, 'DELETE ROW COA', {jurnaltypecoa_id: rowcoa.jurnaltypecoa_id, tablename: coaTableName}, `removed: ${rowcoa.jurnaltypecoa_id}`)


				}	
			}

			// hapus data user
			{
				const sql = `select * from ${userTableName} where jurnaltype_id=\${jurnaltype_id}`
				const rows = await tx.any(sql, dataToRemove)
				for (let rowuser of rows) {
					// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
					if (typeof Extender.userDeleting === 'function') {
						// export async function userDeleting(self, tx, rowuser, logMetadata) {}
						await Extender.userDeleting(self, tx, rowuser, logMetadata)
					}

					const param = {jurnaltypeuser_id: rowuser.jurnaltypeuser_id}
					const cmd = sqlUtil.createDeleteCommand(userTableName, ['jurnaltypeuser_id'])
					const deletedRow = await cmd.execute(param)

					// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
					if (typeof Extender.userDeleted === 'function') {
						// export async function userDeleted(self, tx, deletedRow, logMetadata) {}
						await Extender.userDeleted(self, tx, deletedRow, logMetadata)
					}					

					jurnaltype_log(self, body, startTime, userTableName, rowuser.jurnaltypeuser_id, 'DELETE', {rowdata: deletedRow})
					jurnaltype_log(self, body, startTime, headerTableName, rowuser.jurnaltype_id, 'DELETE ROW USER', {jurnaltypeuser_id: rowuser.jurnaltypeuser_id, tablename: userTableName}, `removed: ${rowuser.jurnaltypeuser_id}`)


				}	
			}

			
			

			// hapus data header
			const cmd = sqlUtil.createDeleteCommand(tablename, ['jurnaltype_id'])
			const deletedRow = await cmd.execute(dataToRemove)

			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender headerDeleted
			if (typeof Extender.headerDeleted === 'function') {
				// export async function headerDeleted(self, tx, ret, logMetadata) {}
				await Extender.headerDeleted(self, tx, ret, logMetadata)
			}

			// record log
			jurnaltype_log(self, body, startTime, tablename, id, 'DELETE', logMetadata)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}



// coa	

async function jurnaltype_coaList(self, body) {
	const tablename = coaTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		jurnaltype_id: `jurnaltype_id=try_cast_bigint(\${jurnaltype_id}, 0)`,
	};


	if (Object.keys(sort).length === 0) {
		sort.jurnaltypecoa_id = 'asc'
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
		if (typeof Extender.coaListCriteria === 'function') {
			// export async function coaListCriteria(self, db, searchMap, criteria, sort, columns, args) {}
			await Extender.coaListCriteria(self, db, searchMap, criteria, sort, columns, args)
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

			// lookup: coa_name dari field coa_name pada table public.coa dimana (public.coa.coa_id = public.jurnaltype.coa_id)
			{
				const { coa_name } = await sqlUtil.lookupdb(db, 'public.coa', 'coa_id', row.coa_id)
				row.coa_name = coa_name
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

async function jurnaltype_coaOpen(self, body) {
	const tablename = coaTableName

	try {
		const { id } = body 
		const criteria = { jurnaltypecoa_id: id }
		const searchMap = { jurnaltypecoa_id: `jurnaltypecoa_id = \${jurnaltypecoa_id}`}
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


		// lookup: coa_name dari field coa_name pada table public.coa dimana (public.coa.coa_id = public.jurnaltype.coa_id)
		{
			const { coa_name } = await sqlUtil.lookupdb(db, 'public.coa', 'coa_id', data.coa_id)
			data.coa_name = coa_name
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
		// export async function coaOpen(self, db, data) {}
		if (typeof Extender.coaOpen === 'function') {
			// export async function coaOpen(self, db, data) {}
			await Extender.coaOpen(self, db, data)
		}

		return data
	} catch (err) {
		throw err
	}
}

async function jurnaltype_coaCreate(self, body) {
	const { source='jurnaltype', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = coaTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._createby = user_id
		data._createdate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			const args = { 
				section: 'coa', 
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
			data.jurnaltypecoa_id = seqdata.id

			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.coaCreating === 'function') {
				// export async function coaCreating(self, tx, data, seqdata, args) {}
				await Extender.coaCreating(self, tx, data, seqdata, args)
			}

			const cmd = sqlUtil.createInsertCommand(tablename, data)
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.coaCreated === 'function') {
				// export async function coaCreated(self, tx, ret, data, logMetadata, args) {}
				await Extender.coaCreated(self, tx, ret, data, logMetadata, args)
			}

			// record log
			jurnaltype_log(self, body, startTime, tablename, ret.jurnaltypecoa_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function jurnaltype_coaUpdate(self, body) {
	const { source='jurnaltype', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = coaTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._modifyby = user_id
		data._modifydate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.coaUpdating === 'function') {
				// export async function coaUpdating(self, tx, data) {}
				await Extender.coaUpdating(self, tx, data)
			}			
			
			const cmd =  sqlUtil.createUpdateCommand(tablename, data, ['jurnaltypecoa_id'])
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.coaUpdated === 'function') {
				// export async function coaUpdated(self, tx, ret, data, logMetadata) {}
				await Extender.coaUpdated(self, tx, ret, data, logMetadata)
			}

			// record log
			jurnaltype_log(self, body, startTime, tablename, data.jurnaltypecoa_id, 'UPDATE', logMetadata)

			return ret
		})
	
		return result
	} catch (err) {
		throw err
	}
}

async function jurnaltype_coaDelete(self, body) {
	const { source, id } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = coaTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {jurnaltypecoa_id: id}
			const sql = `select * from ${coaTableName} where jurnaltypecoa_id=\${jurnaltypecoa_id}`
			const rowcoa = await tx.oneOrNone(sql, dataToRemove)


			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
			if (typeof Extender.coaDeleting === 'function') {
				// export async function coaDeleting(self, tx, rowcoa, logMetadata) {}
				await Extender.coaDeleting(self, tx, rowcoa, logMetadata)
			}

			const param = {jurnaltypecoa_id: rowcoa.jurnaltypecoa_id}
			const cmd = sqlUtil.createDeleteCommand(coaTableName, ['jurnaltypecoa_id'])
			const deletedRow = await cmd.execute(param)

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
			if (typeof Extender.coaDeleted === 'function') {
				// export async function coaDeleted(self, tx, deletedRow, logMetadata) {}
				await Extender.coaDeleted(self, tx, deletedRow, logMetadata)
			}					

			jurnaltype_log(self, body, startTime, coaTableName, rowcoa.jurnaltypecoa_id, 'DELETE', {rowdata: deletedRow})
			jurnaltype_log(self, body, startTime, headerTableName, rowcoa.jurnaltype_id, 'DELETE ROW COA', {jurnaltypecoa_id: rowcoa.jurnaltypecoa_id, tablename: coaTableName}, `removed: ${rowcoa.jurnaltypecoa_id}`)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}

async function jurnaltype_coaDeleteRows(self, body) {
	const { data } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = coaTableName


	try {
		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			for (let id of data) {
				const dataToRemove = {jurnaltypecoa_id: id}
				const sql = `select * from ${coaTableName} where jurnaltypecoa_id=\${jurnaltypecoa_id}`
				const rowcoa = await tx.oneOrNone(sql, dataToRemove)

				// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
				if (typeof Extender.coaDeleting === 'function') {
					// async function coaDeleting(self, tx, rowcoa, logMetadata) {}
					await Extender.coaDeleting(self, tx, rowcoa, logMetadata)
				}

				const param = {jurnaltypecoa_id: rowcoa.jurnaltypecoa_id}
				const cmd = sqlUtil.createDeleteCommand(coaTableName, ['jurnaltypecoa_id'])
				const deletedRow = await cmd.execute(param)

				// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
				if (typeof Extender.coaDeleted === 'function') {
					// export async function coaDeleted(self, tx, deletedRow, logMetadata) {}
					await Extender.coaDeleted(self, tx, deletedRow, logMetadata)
				}					

				jurnaltype_log(self, body, startTime, coaTableName, rowcoa.jurnaltypecoa_id, 'DELETE', {rowdata: deletedRow})
				jurnaltype_log(self, body, startTime, headerTableName, rowcoa.jurnaltype_id, 'DELETE ROW COA', {jurnaltypecoa_id: rowcoa.jurnaltypecoa_id, tablename: coaTableName}, `removed: ${rowcoa.jurnaltypecoa_id}`)
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


// user	

async function jurnaltype_userList(self, body) {
	const tablename = userTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		jurnaltype_id: `jurnaltype_id=try_cast_bigint(\${jurnaltype_id}, 0)`,
	};


	if (Object.keys(sort).length === 0) {
		sort.jurnaltypeuser_id = 'asc'
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
		if (typeof Extender.userListCriteria === 'function') {
			// export async function userListCriteria(self, db, searchMap, criteria, sort, columns, args) {}
			await Extender.userListCriteria(self, db, searchMap, criteria, sort, columns, args)
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

			// lookup: user_fullname dari field user_fullname pada table core.user dimana (core.user.user_id = public.jurnaltype.user_id)
			{
				const { user_fullname } = await sqlUtil.lookupdb(db, 'core.user', 'user_id', row.user_id)
				row.user_fullname = user_fullname
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

async function jurnaltype_userOpen(self, body) {
	const tablename = userTableName

	try {
		const { id } = body 
		const criteria = { jurnaltypeuser_id: id }
		const searchMap = { jurnaltypeuser_id: `jurnaltypeuser_id = \${jurnaltypeuser_id}`}
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


		// lookup: user_fullname dari field user_fullname pada table core.user dimana (core.user.user_id = public.jurnaltype.user_id)
		{
			const { user_fullname } = await sqlUtil.lookupdb(db, 'core.user', 'user_id', data.user_id)
			data.user_fullname = user_fullname
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
		// export async function userOpen(self, db, data) {}
		if (typeof Extender.userOpen === 'function') {
			// export async function userOpen(self, db, data) {}
			await Extender.userOpen(self, db, data)
		}

		return data
	} catch (err) {
		throw err
	}
}

async function jurnaltype_userCreate(self, body) {
	const { source='jurnaltype', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = userTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._createby = user_id
		data._createdate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			const args = { 
				section: 'user', 
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
			data.jurnaltypeuser_id = seqdata.id

			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.userCreating === 'function') {
				// export async function userCreating(self, tx, data, seqdata, args) {}
				await Extender.userCreating(self, tx, data, seqdata, args)
			}

			const cmd = sqlUtil.createInsertCommand(tablename, data)
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.userCreated === 'function') {
				// export async function userCreated(self, tx, ret, data, logMetadata, args) {}
				await Extender.userCreated(self, tx, ret, data, logMetadata, args)
			}

			// record log
			jurnaltype_log(self, body, startTime, tablename, ret.jurnaltypeuser_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function jurnaltype_userUpdate(self, body) {
	const { source='jurnaltype', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = userTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._modifyby = user_id
		data._modifydate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.userUpdating === 'function') {
				// export async function userUpdating(self, tx, data) {}
				await Extender.userUpdating(self, tx, data)
			}			
			
			const cmd =  sqlUtil.createUpdateCommand(tablename, data, ['jurnaltypeuser_id'])
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.userUpdated === 'function') {
				// export async function userUpdated(self, tx, ret, data, logMetadata) {}
				await Extender.userUpdated(self, tx, ret, data, logMetadata)
			}

			// record log
			jurnaltype_log(self, body, startTime, tablename, data.jurnaltypeuser_id, 'UPDATE', logMetadata)

			return ret
		})
	
		return result
	} catch (err) {
		throw err
	}
}

async function jurnaltype_userDelete(self, body) {
	const { source, id } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = userTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {jurnaltypeuser_id: id}
			const sql = `select * from ${userTableName} where jurnaltypeuser_id=\${jurnaltypeuser_id}`
			const rowuser = await tx.oneOrNone(sql, dataToRemove)


			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
			if (typeof Extender.userDeleting === 'function') {
				// export async function userDeleting(self, tx, rowuser, logMetadata) {}
				await Extender.userDeleting(self, tx, rowuser, logMetadata)
			}

			const param = {jurnaltypeuser_id: rowuser.jurnaltypeuser_id}
			const cmd = sqlUtil.createDeleteCommand(userTableName, ['jurnaltypeuser_id'])
			const deletedRow = await cmd.execute(param)

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
			if (typeof Extender.userDeleted === 'function') {
				// export async function userDeleted(self, tx, deletedRow, logMetadata) {}
				await Extender.userDeleted(self, tx, deletedRow, logMetadata)
			}					

			jurnaltype_log(self, body, startTime, userTableName, rowuser.jurnaltypeuser_id, 'DELETE', {rowdata: deletedRow})
			jurnaltype_log(self, body, startTime, headerTableName, rowuser.jurnaltype_id, 'DELETE ROW USER', {jurnaltypeuser_id: rowuser.jurnaltypeuser_id, tablename: userTableName}, `removed: ${rowuser.jurnaltypeuser_id}`)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}

async function jurnaltype_userDeleteRows(self, body) {
	const { data } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = userTableName


	try {
		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			for (let id of data) {
				const dataToRemove = {jurnaltypeuser_id: id}
				const sql = `select * from ${userTableName} where jurnaltypeuser_id=\${jurnaltypeuser_id}`
				const rowuser = await tx.oneOrNone(sql, dataToRemove)

				// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
				if (typeof Extender.userDeleting === 'function') {
					// async function userDeleting(self, tx, rowuser, logMetadata) {}
					await Extender.userDeleting(self, tx, rowuser, logMetadata)
				}

				const param = {jurnaltypeuser_id: rowuser.jurnaltypeuser_id}
				const cmd = sqlUtil.createDeleteCommand(userTableName, ['jurnaltypeuser_id'])
				const deletedRow = await cmd.execute(param)

				// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
				if (typeof Extender.userDeleted === 'function') {
					// export async function userDeleted(self, tx, deletedRow, logMetadata) {}
					await Extender.userDeleted(self, tx, deletedRow, logMetadata)
				}					

				jurnaltype_log(self, body, startTime, userTableName, rowuser.jurnaltypeuser_id, 'DELETE', {rowdata: deletedRow})
				jurnaltype_log(self, body, startTime, headerTableName, rowuser.jurnaltype_id, 'DELETE ROW USER', {jurnaltypeuser_id: rowuser.jurnaltypeuser_id, tablename: userTableName}, `removed: ${rowuser.jurnaltypeuser_id}`)
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

	