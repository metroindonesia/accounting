import pgp from 'pg-promise';

import db from '@agung_dhewe/webapps/src/db.js'
import Api from '@agung_dhewe/webapps/src/api.js'
import sqlUtil from '@agung_dhewe/pgsqlc'
import context from '@agung_dhewe/webapps/src/context.js'
import logger from '@agung_dhewe/webapps/src/logger.js'


const moduleName = 'jurnal'

// api: account
export default class extends Api {
	constructor(req, res, next) {
		super(req, res, next);
		Api.cekLogin(req)
	}

	async listAP(body) { return await jurnalOutstanding_listAP(this, body) }
	async listAR(body) { return await jurnalOutstanding_listAR(this, body) }
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
	const { partner_id, coa_id, curr_id, paymdate, searchtext } = body

	try {
		const sqlOutstanding = 'call public.outstanding_ar(${paymdate}, ${partner_id}, ${coa_id}, ${curr_id})'
		await db.none(sqlOutstanding, {
			paymdate,
			partner_id,
			coa_id,
			curr_id
		})

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