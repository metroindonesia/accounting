import pgp from 'pg-promise';

import db from '@agung_dhewe/webapps/src/db.js'
import Api from '@agung_dhewe/webapps/src/api.js'
import sqlUtil from '@agung_dhewe/pgsqlc'
import context from '@agung_dhewe/webapps/src/context.js'  
import logger from '@agung_dhewe/webapps/src/logger.js'
import { createSequencerLine } from '@agung_dhewe/webapps/src/sequencerline.js' 

import * as Extender from './extenders/partner.apiext.js'

const moduleName = 'partner'
const headerSectionName = 'header'
const headerTableName = 'public.partner' 
const bankTableName = 'public.partnerbank'  
const contactTableName = 'public.partnercontact'  	

// api: account
export default class extends Api {
	constructor(req, res, next) {
		super(req, res, next);
		Api.cekLogin(req)
	}


	// dipanggil dengan model snake syntax
	// contoh: header-list
	//         header-open-data
	async init(body) { return await partner_init(this, body) }

	// header
	async headerList(body) { return await partner_headerList(this, body) }
	async headerOpen(body) { return await partner_headerOpen(this, body) }
	async headerUpdate(body) { return await partner_headerUpdate(this, body)}
	async headerCreate(body) { return await partner_headerCreate(this, body)}
	async headerDelete(body) { return await partner_headerDelete(this, body) }
	
	
	// bank	
	async bankList(body) { return await partner_bankList(this, body) }
	async bankOpen(body) { return await partner_bankOpen(this, body) }
	async bankUpdate(body) { return await partner_bankUpdate(this, body)}
	async bankCreate(body) { return await partner_bankCreate(this, body) }
	async bankDelete(body) { return await partner_bankDelete(this, body) }
	async bankDeleteRows(body) { return await partner_bankDeleteRows(this, body) }
	
	// contact	
	async contactList(body) { return await partner_contactList(this, body) }
	async contactOpen(body) { return await partner_contactOpen(this, body) }
	async contactUpdate(body) { return await partner_contactUpdate(this, body)}
	async contactCreate(body) { return await partner_contactCreate(this, body) }
	async contactDelete(body) { return await partner_contactDelete(this, body) }
	async contactDeleteRows(body) { return await partner_contactDeleteRows(this, body) }
			
}	

// init module
async function partner_init(self, body) {
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
		
		if (typeof Extender.partner_init === 'function') {
			// export async function partner_init(self, initialData) {}
			await Extender.partner_init(self, initialData)
		}

		return initialData
		
	} catch (err) {
		throw err
	}
}


// data logging
async function partner_log(self, body, startTime, tablename, id, action, data={}, remark='') {
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



async function partner_headerList(self, body) {
	const tablename = headerTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		searchtext: `partner_name ILIKE '%' || \${searchtext} || '%'`,
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

			// lookup: partnertype_name dari field partnertype_name pada table public.partnertype dimana (public.partnertype.partnertype_id = public.partner.partnertype_id)
			{
				const { partnertype_name } = await sqlUtil.lookupdb(db, 'public.partnertype', 'partnertype_id', row.partnertype_id)
				row.partnertype_name = partnertype_name
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

async function partner_headerOpen(self, body) {
	const tablename = headerTableName

	try {
		const { id } = body 
		const criteria = { partner_id: id }
		const searchMap = { partner_id: `partner_id = \${partner_id}`}
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

		// lookup: partnertype_name dari field partnertype_name pada table public.partnertype dimana (public.partnertype.partnertype_id = public.partner.partnertype_id)
		{
			const { partnertype_name } = await sqlUtil.lookupdb(db, 'public.partnertype', 'partnertype_id', data.partnertype_id)
			data.partnertype_name = partnertype_name
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


async function partner_headerCreate(self, body) {
	const { source='partner', data={} } = body
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


			const args = { section: 'header', prefix:'PATR' }

			
			// buat short sequencer	
			const sequencer = createSequencerLine(tx, {})

			if (typeof Extender.sequencerSetup === 'function') {
				// jika ada keperluan menambahkan code block/cluster di sequencer
				// dapat diimplementasikan di exterder sequencerSetup 
				// export async function sequencerSetup(self, tx, sequencer, data, args) {}
				await Extender.sequencerSetup(self, tx, sequencer, data, args)
			}

			// generate short id sesuai prefix (default: PATR) reset pertahun
			const seqdata = await sequencer.yearlyshort(args.prefix)
			data.partner_id = seqdata.id

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
			partner_log(self, body, startTime, tablename, ret.partner_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function partner_headerUpdate(self, body) {
	const { source='partner', data={} } = body
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
			const cmd = sqlUtil.createUpdateCommand(tablename, data, ['partner_id'])
			const ret = await cmd.execute(data)

			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.headerUpdated === 'function') {
				// export async function headerUpdated(self, tx, ret, data, logMetadata) {}
				await Extender.headerUpdated(self, tx, ret, data, logMetadata)
			}			

			// record log
			partner_log(self, body, startTime, tablename, data.partner_id, 'UPDATE')

			return ret
		})
		

		return result
	} catch (err) {
		throw err
	}
}


async function partner_headerDelete(self, body) {
	const { source, id } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = headerTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {partner_id: id}

			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender headerDeleting
			if (typeof Extender.headerDeleting === 'function') {
				// export async function headerDeleting(self, tx, dataToRemove) {}
				await Extender.headerDeleting(self, tx, dataToRemove)
			}

			
			// hapus data bank
			{
				const sql = `select * from ${bankTableName} where partner_id=\${partner_id}`
				const rows = await tx.any(sql, dataToRemove)
				for (let rowbank of rows) {
					// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
					if (typeof Extender.bankDeleting === 'function') {
						// export async function bankDeleting(self, tx, rowbank, logMetadata) {}
						await Extender.bankDeleting(self, tx, rowbank, logMetadata)
					}

					const param = {partnerbank_id: rowbank.partnerbank_id}
					const cmd = sqlUtil.createDeleteCommand(bankTableName, ['partnerbank_id'])
					const deletedRow = await cmd.execute(param)

					// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
					if (typeof Extender.bankDeleted === 'function') {
						// export async function bankDeleted(self, tx, deletedRow, logMetadata) {}
						await Extender.bankDeleted(self, tx, deletedRow, logMetadata)
					}					

					partner_log(self, body, startTime, bankTableName, rowbank.partnerbank_id, 'DELETE', {rowdata: deletedRow})
					partner_log(self, body, startTime, headerTableName, rowbank.partner_id, 'DELETE ROW BANK', {partnerbank_id: rowbank.partnerbank_id, tablename: bankTableName}, `removed: ${rowbank.partnerbank_id}`)


				}	
			}

			// hapus data contact
			{
				const sql = `select * from ${contactTableName} where partner_id=\${partner_id}`
				const rows = await tx.any(sql, dataToRemove)
				for (let rowcontact of rows) {
					// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
					if (typeof Extender.contactDeleting === 'function') {
						// export async function contactDeleting(self, tx, rowcontact, logMetadata) {}
						await Extender.contactDeleting(self, tx, rowcontact, logMetadata)
					}

					const param = {partnercontact_id: rowcontact.partnercontact_id}
					const cmd = sqlUtil.createDeleteCommand(contactTableName, ['partnercontact_id'])
					const deletedRow = await cmd.execute(param)

					// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
					if (typeof Extender.contactDeleted === 'function') {
						// export async function contactDeleted(self, tx, deletedRow, logMetadata) {}
						await Extender.contactDeleted(self, tx, deletedRow, logMetadata)
					}					

					partner_log(self, body, startTime, contactTableName, rowcontact.partnercontact_id, 'DELETE', {rowdata: deletedRow})
					partner_log(self, body, startTime, headerTableName, rowcontact.partner_id, 'DELETE ROW CONTACT', {partnercontact_id: rowcontact.partnercontact_id, tablename: contactTableName}, `removed: ${rowcontact.partnercontact_id}`)


				}	
			}

			
			

			// hapus data header
			const cmd = sqlUtil.createDeleteCommand(tablename, ['partner_id'])
			const deletedRow = await cmd.execute(dataToRemove)

			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender headerDeleted
			if (typeof Extender.headerDeleted === 'function') {
				// export async function headerDeleted(self, tx, ret, logMetadata) {}
				await Extender.headerDeleted(self, tx, ret, logMetadata)
			}

			// record log
			partner_log(self, body, startTime, tablename, id, 'DELETE', logMetadata)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}



// bank	

async function partner_bankList(self, body) {
	const tablename = bankTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		partner_id: `partner_id=try_cast_bigint(\${partner_id}, 0)`,
	};


	if (Object.keys(sort).length === 0) {
		sort.partnerbank_id = 'asc'
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
		if (typeof Extender.bankListCriteria === 'function') {
			// export async function bankListCriteria(self, db, searchMap, criteria, sort, columns, args) {}
			await Extender.bankListCriteria(self, db, searchMap, criteria, sort, columns, args)
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

async function partner_bankOpen(self, body) {
	const tablename = bankTableName

	try {
		const { id } = body 
		const criteria = { partnerbank_id: id }
		const searchMap = { partnerbank_id: `partnerbank_id = \${partnerbank_id}`}
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
		// export async function bankOpen(self, db, data) {}
		if (typeof Extender.bankOpen === 'function') {
			// export async function bankOpen(self, db, data) {}
			await Extender.bankOpen(self, db, data)
		}

		return data
	} catch (err) {
		throw err
	}
}

async function partner_bankCreate(self, body) {
	const { source='partner', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = bankTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._createby = user_id
		data._createdate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			const args = { 
				section: 'bank', 
				prefix: 'PATR'	
			}

			const sequencer = createSequencerLine(tx, {})


			if (typeof Extender.sequencerSetup === 'function') {
				// jika ada keperluan menambahkan code block/cluster di sequencer
				// dapat diimplementasikan di exterder sequencerSetup 
				// export async function sequencerSetup(self, tx, sequencer, data, args) {}
				await Extender.sequencerSetup(self, tx, sequencer, data, args)
			}


			const seqdata = await sequencer.increment(args.prefix)
			data.partnerbank_id = seqdata.id

			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.bankCreating === 'function') {
				// export async function bankCreating(self, tx, data, seqdata, args) {}
				await Extender.bankCreating(self, tx, data, seqdata, args)
			}

			const cmd = sqlUtil.createInsertCommand(tablename, data)
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.bankCreated === 'function') {
				// export async function bankCreated(self, tx, ret, data, logMetadata, args) {}
				await Extender.bankCreated(self, tx, ret, data, logMetadata, args)
			}

			// record log
			partner_log(self, body, startTime, tablename, ret.partnerbank_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function partner_bankUpdate(self, body) {
	const { source='partner', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = bankTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._modifyby = user_id
		data._modifydate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.bankUpdating === 'function') {
				// export async function bankUpdating(self, tx, data) {}
				await Extender.bankUpdating(self, tx, data)
			}			
			
			const cmd =  sqlUtil.createUpdateCommand(tablename, data, ['partnerbank_id'])
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.bankUpdated === 'function') {
				// export async function bankUpdated(self, tx, ret, data, logMetadata) {}
				await Extender.bankUpdated(self, tx, ret, data, logMetadata)
			}

			// record log
			partner_log(self, body, startTime, tablename, data.partnerbank_id, 'UPDATE', logMetadata)

			return ret
		})
	
		return result
	} catch (err) {
		throw err
	}
}

async function partner_bankDelete(self, body) {
	const { source, id } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = bankTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {partnerbank_id: id}
			const sql = `select * from ${bankTableName} where partnerbank_id=\${partnerbank_id}`
			const rowbank = await tx.oneOrNone(sql, dataToRemove)


			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
			if (typeof Extender.bankDeleting === 'function') {
				// export async function bankDeleting(self, tx, rowbank, logMetadata) {}
				await Extender.bankDeleting(self, tx, rowbank, logMetadata)
			}

			const param = {partnerbank_id: rowbank.partnerbank_id}
			const cmd = sqlUtil.createDeleteCommand(bankTableName, ['partnerbank_id'])
			const deletedRow = await cmd.execute(param)

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
			if (typeof Extender.bankDeleted === 'function') {
				// export async function bankDeleted(self, tx, deletedRow, logMetadata) {}
				await Extender.bankDeleted(self, tx, deletedRow, logMetadata)
			}					

			partner_log(self, body, startTime, bankTableName, rowbank.partnerbank_id, 'DELETE', {rowdata: deletedRow})
			partner_log(self, body, startTime, headerTableName, rowbank.partner_id, 'DELETE ROW BANK', {partnerbank_id: rowbank.partnerbank_id, tablename: bankTableName}, `removed: ${rowbank.partnerbank_id}`)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}

async function partner_bankDeleteRows(self, body) {
	const { data } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = bankTableName


	try {
		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			for (let id of data) {
				const dataToRemove = {partnerbank_id: id}
				const sql = `select * from ${bankTableName} where partnerbank_id=\${partnerbank_id}`
				const rowbank = await tx.oneOrNone(sql, dataToRemove)

				// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
				if (typeof Extender.bankDeleting === 'function') {
					// async function bankDeleting(self, tx, rowbank, logMetadata) {}
					await Extender.bankDeleting(self, tx, rowbank, logMetadata)
				}

				const param = {partnerbank_id: rowbank.partnerbank_id}
				const cmd = sqlUtil.createDeleteCommand(bankTableName, ['partnerbank_id'])
				const deletedRow = await cmd.execute(param)

				// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
				if (typeof Extender.bankDeleted === 'function') {
					// export async function bankDeleted(self, tx, deletedRow, logMetadata) {}
					await Extender.bankDeleted(self, tx, deletedRow, logMetadata)
				}					

				partner_log(self, body, startTime, bankTableName, rowbank.partnerbank_id, 'DELETE', {rowdata: deletedRow})
				partner_log(self, body, startTime, headerTableName, rowbank.partner_id, 'DELETE ROW BANK', {partnerbank_id: rowbank.partnerbank_id, tablename: bankTableName}, `removed: ${rowbank.partnerbank_id}`)
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


// contact	

async function partner_contactList(self, body) {
	const tablename = contactTableName
	const { criteria={}, limit=0, offset=0, columns=[], sort={} } = body
	const searchMap = {
		partner_id: `partner_id=try_cast_bigint(\${partner_id}, 0)`,
	};


	if (Object.keys(sort).length === 0) {
		sort.partnercontact_id = 'asc'
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
		if (typeof Extender.contactListCriteria === 'function') {
			// export async function contactListCriteria(self, db, searchMap, criteria, sort, columns, args) {}
			await Extender.contactListCriteria(self, db, searchMap, criteria, sort, columns, args)
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

async function partner_contactOpen(self, body) {
	const tablename = contactTableName

	try {
		const { id } = body 
		const criteria = { partnercontact_id: id }
		const searchMap = { partnercontact_id: `partnercontact_id = \${partnercontact_id}`}
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
		// export async function contactOpen(self, db, data) {}
		if (typeof Extender.contactOpen === 'function') {
			// export async function contactOpen(self, db, data) {}
			await Extender.contactOpen(self, db, data)
		}

		return data
	} catch (err) {
		throw err
	}
}

async function partner_contactCreate(self, body) {
	const { source='partner', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = contactTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._createby = user_id
		data._createdate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			const args = { 
				section: 'contact', 
				prefix: 'PATR'	
			}

			const sequencer = createSequencerLine(tx, {})


			if (typeof Extender.sequencerSetup === 'function') {
				// jika ada keperluan menambahkan code block/cluster di sequencer
				// dapat diimplementasikan di exterder sequencerSetup 
				// export async function sequencerSetup(self, tx, sequencer, data, args) {}
				await Extender.sequencerSetup(self, tx, sequencer, data, args)
			}


			const seqdata = await sequencer.increment(args.prefix)
			data.partnercontact_id = seqdata.id

			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.contactCreating === 'function') {
				// export async function contactCreating(self, tx, data, seqdata, args) {}
				await Extender.contactCreating(self, tx, data, seqdata, args)
			}

			const cmd = sqlUtil.createInsertCommand(tablename, data)
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.contactCreated === 'function') {
				// export async function contactCreated(self, tx, ret, data, logMetadata, args) {}
				await Extender.contactCreated(self, tx, ret, data, logMetadata, args)
			}

			// record log
			partner_log(self, body, startTime, tablename, ret.partnercontact_id, 'CREATE', logMetadata)

			return ret
		})

		return result
	} catch (err) {
		throw err
	}
}

async function partner_contactUpdate(self, body) {
	const { source='partner', data={} } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = contactTableName

	try {

		// parse uploaded data
		const files = Api.parseUploadData(data, req.files)


		data._modifyby = user_id
		data._modifydate = (new Date()).toISOString()

		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)


			// apabila ada keperluan pengolahan data SEBELUM disimpan
			if (typeof Extender.contactUpdating === 'function') {
				// export async function contactUpdating(self, tx, data) {}
				await Extender.contactUpdating(self, tx, data)
			}			
			
			const cmd =  sqlUtil.createUpdateCommand(tablename, data, ['partnercontact_id'])
			const ret = await cmd.execute(data)
			
			const logMetadata = {}

			// apabila ada keperluan pengelohan data setelah disimpan, lakukan di extender headerCreated
			if (typeof Extender.contactUpdated === 'function') {
				// export async function contactUpdated(self, tx, ret, data, logMetadata) {}
				await Extender.contactUpdated(self, tx, ret, data, logMetadata)
			}

			// record log
			partner_log(self, body, startTime, tablename, data.partnercontact_id, 'UPDATE', logMetadata)

			return ret
		})
	
		return result
	} catch (err) {
		throw err
	}
}

async function partner_contactDelete(self, body) {
	const { source, id } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()
	const tablename = contactTableName

	try {

		const deletedRow = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			const dataToRemove = {partnercontact_id: id}
			const sql = `select * from ${contactTableName} where partnercontact_id=\${partnercontact_id}`
			const rowcontact = await tx.oneOrNone(sql, dataToRemove)


			// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
			if (typeof Extender.contactDeleting === 'function') {
				// export async function contactDeleting(self, tx, rowcontact, logMetadata) {}
				await Extender.contactDeleting(self, tx, rowcontact, logMetadata)
			}

			const param = {partnercontact_id: rowcontact.partnercontact_id}
			const cmd = sqlUtil.createDeleteCommand(contactTableName, ['partnercontact_id'])
			const deletedRow = await cmd.execute(param)

			// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
			if (typeof Extender.contactDeleted === 'function') {
				// export async function contactDeleted(self, tx, deletedRow, logMetadata) {}
				await Extender.contactDeleted(self, tx, deletedRow, logMetadata)
			}					

			partner_log(self, body, startTime, contactTableName, rowcontact.partnercontact_id, 'DELETE', {rowdata: deletedRow})
			partner_log(self, body, startTime, headerTableName, rowcontact.partner_id, 'DELETE ROW CONTACT', {partnercontact_id: rowcontact.partnercontact_id, tablename: contactTableName}, `removed: ${rowcontact.partnercontact_id}`)

			return deletedRow
		})
	

		return deletedRow
	} catch (err) {
		throw err
	}
}

async function partner_contactDeleteRows(self, body) {
	const { data } = body 
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();
	const tablename = contactTableName


	try {
		const result = await db.tx(async tx=>{
			sqlUtil.connect(tx)

			for (let id of data) {
				const dataToRemove = {partnercontact_id: id}
				const sql = `select * from ${contactTableName} where partnercontact_id=\${partnercontact_id}`
				const rowcontact = await tx.oneOrNone(sql, dataToRemove)

				// apabila ada keperluan pengelohan data sebelum dihapus, lakukan di extender
				if (typeof Extender.contactDeleting === 'function') {
					// async function contactDeleting(self, tx, rowcontact, logMetadata) {}
					await Extender.contactDeleting(self, tx, rowcontact, logMetadata)
				}

				const param = {partnercontact_id: rowcontact.partnercontact_id}
				const cmd = sqlUtil.createDeleteCommand(contactTableName, ['partnercontact_id'])
				const deletedRow = await cmd.execute(param)

				// apabila ada keperluan pengelohan data setelah dihapus, lakukan di extender
				if (typeof Extender.contactDeleted === 'function') {
					// export async function contactDeleted(self, tx, deletedRow, logMetadata) {}
					await Extender.contactDeleted(self, tx, deletedRow, logMetadata)
				}					

				partner_log(self, body, startTime, contactTableName, rowcontact.partnercontact_id, 'DELETE', {rowdata: deletedRow})
				partner_log(self, body, startTime, headerTableName, rowcontact.partner_id, 'DELETE ROW CONTACT', {partnercontact_id: rowcontact.partnercontact_id, tablename: contactTableName}, `removed: ${rowcontact.partnercontact_id}`)
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

	