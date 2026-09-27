import pgp from 'pg-promise';

import db from '@agung_dhewe/webapps/src/db.js'
import Api from '@agung_dhewe/webapps/src/api.js'
import sqlUtil from '@agung_dhewe/pgsqlc'
import context from '@agung_dhewe/webapps/src/context.js'
import logger from '@agung_dhewe/webapps/src/logger.js'
import { createSequencerLine } from '@agung_dhewe/webapps/src/sequencerline.js'

const moduleName = 'jurnal'

// api: account
export default class extends Api {
	constructor(req, res, next) {
		super(req, res, next);
		Api.cekLogin(req)
	}

	async listAP(body) { return await jurnalOutstanding_listAP(this, body) }
	async listAR(body) { return await jurnalOutstanding_listAR(this, body) }
	async process(body) { return await jurnalOutstanding_process(this, body) }
}


export async function jurnalOutstanding_listAP(self, body) {
	const req = self.req
	const { partner_id, coa_id, curr_id, paymdate, searchtext, jurnal_id } = body

	try {
		const sqlOutstanding = 'call public.outstanding_ap(${paymdate}, ${partner_id}, ${coa_id}, ${curr_id})'
		await db.none(sqlOutstanding, {
			paymdate,
			partner_id,
			coa_id,
			curr_id
		})


		// exclude data yang sudah dipilih di jurnal_id
		const sqlExclude = 'delete from TEMP_RAW_AGING where ref_jurnaldetil_id IN (select jurnaldetil_id_ref from public.jurnaldetil where jurnal_id=${jurnal_id})'
		await db.any(sqlExclude, { jurnal_id })


		// tampilkan data ke user
		if (searchtext != '') {
			const sql = "select * from TEMP_RAW_AGING where ref_jurnaldetil_descr ilike '%' || ${searchtext} || '%'"
			const rows = await db.any(sql, { searchtext })
			return rows
		} else {
			const sql = 'select * from TEMP_RAW_AGING'
			const rows = await db.any(sql)
			return rows
		}
	} catch (err) {
		throw err
	}
}


export async function jurnalOutstanding_listAR(self, body) {
	const req = self.req
	const { partner_id, coa_id, curr_id, paymdate, searchtext, jurnal_id } = body

	try {
		const sqlOutstanding = 'call public.outstanding_ar(${paymdate}, ${partner_id}, ${coa_id}, ${curr_id})'
		await db.none(sqlOutstanding, {
			paymdate,
			partner_id,
			coa_id,
			curr_id
		})

		// exclude data yang sudah dipilih di jurnal_id
		const sqlExclude = 'delete from TEMP_RAW_AGING where ref_jurnaldetil_id IN (select jurnaldetil_id_ref from public.jurnaldetil where jurnal_id=${jurnal_id})'
		await db.any(sqlExclude, { jurnal_id })


		if (searchtext != '') {
			const sql = "select * from TEMP_RAW_AGING where ref_jurnaldetil_descr ilike '%' || ${searchtext} || '%'"
			const rows = await db.any(sql, { searchtext })
			return rows
		} else {
			const sql = 'select * from TEMP_RAW_AGING'
			const rows = await db.any(sql)
			return rows
		}

	} catch (err) {
		throw err
	}
}


export async function jurnalOutstanding_process(self, body) {
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint();

	const { jurnal_id, tobeProcess } = body

	try {

		const { jurnaltype_id, jurnal_doc, periode_id, jurnal_date, jurnal_datedue } = await sqlUtil.lookupdb(db, 'public.jurnal', 'jurnal_id', jurnal_id)
		const { doc_id } = await sqlUtil.lookupdb(db, 'public.jurnaltype', 'jurnaltype_id', jurnaltype_id)


		const data_timestamp = (new Date()).toISOString()

		const result = await db.tx(async tx => {
			sqlUtil.connect(tx)


			const args = {
				section: 'detil',
				doc_id: doc_id
			}

			const sequencer = createSequencerLine(tx, {})


			const data = {
				jurnal_id,
				jurnal_doc,
				periode_id,
				jurnal_date,
				jurnal_datedue,
				jurnaltype_id,
				_createby: user_id,
				_createdate: data_timestamp,
				_timestamp: data_timestamp
			}

			for (const row of tobeProcess) {
				const { jurnaldetil_id, value, idr } = row

				// ambil data referensi jurnal
				const sql = `
					select 
						A.coa_id, A.partner_id, A.site_id, A.unit_id, A.struct_id, A.partner_id, A.project_id, 
						A.curr_id, A.curr_rate, A.jurnaldetil_descr,
						B.agingtype_id, B.curr_id as coacurr, B.iscurradj	 
					from
					public.jurnaldetil A left join public.coa B on B.coa_id = A.coa_id
					where 
					A.jurnaldetil_id = $[jurnaldetil_id] 
				`
				const refjurnaldetil = await tx.one(sql, { jurnaldetil_id })
				const jurnaldetil = {
					...data,
					...refjurnaldetil,
					jurnaldetil_id_ref: jurnaldetil_id,
					ismanuallink: true,
					jurnaldetil_value: value * -1,
					jurnaldetil_idr: idr * -1,
					isdebet: value >= 0 ? false : true, // ini kebalikannya (jurnal lawan), karena value dikalikan -1
					iskredit: value < 0 ? false : true,
				}

				const seqdata = await sequencer.increment(args.prefix)
				jurnaldetil.jurnaldetil_id = seqdata.id

				const cmd = sqlUtil.createInsertCommand('public.jurnaldetil', jurnaldetil)
				const ret = await cmd.execute(jurnaldetil)

				// record log
				const logMetadata = {}
				jurnal_log(self, body, startTime, 'public.jurnaldetil', jurnaldetil.jurnaldetil_id, 'CREATE', logMetadata)
			}


			// update header



		})




	} catch (err) {
		throw err
	}
}




// data logging
async function jurnal_log(self, body, startTime, tablename, id, action, data = {}, remark = '') {
	const { source } = body
	const req = self.req
	const user_id = req.session.user.userId
	const user_name = req.session.user.userFullname
	const ipaddress = req.ip
	const metadata = JSON.stringify({ ...{ source: source }, ...data })
	const endTime = process.hrtime.bigint();
	const executionTimeMs = Number((endTime - startTime) / 1_000_000n); // hasil dalam ms tanpa desimal

	const logdata = { id, user_id, user_name, moduleName, action, tablename, executionTimeMs, remark, metadata, ipaddress }
	const ret = await logger.log(logdata)
	return ret
}