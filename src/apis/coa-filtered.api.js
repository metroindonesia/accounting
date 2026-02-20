import pgp from 'pg-promise';

import db from '@agung_dhewe/webapps/src/db.js'
import Api from '@agung_dhewe/webapps/src/api.js'
import sqlUtil from '@agung_dhewe/pgsqlc'
import context from '@agung_dhewe/webapps/src/context.js'

const TABLE = {
	coa: 'public.coa',
	jurnaltypecoa: 'public.jurnaltypecoa'
}


// api: account
export default class extends Api {
	constructor(req, res, next) {
		super(req, res, next);
		Api.cekLogin(req)
	}

	async listByJurnaltype(body) { return await coa_listByJurnaltype(this, body) }
}

export async function coa_listByJurnaltype(self, body) {
	const tablename = `${TABLE.coa} A inner join ${TABLE.jurnaltypecoa} B on B.coa_id = A.coa_id`
	const columns = ['A.*', 'B.jurnaltypecoa_isdr as isdebet', 'B.jurnaltypecoa_iscr as iskredit']
	const { criteria = {}, limit = 0, offset = 0, sort = {} } = body
	const searchMap = {
		searchtext: `A.coa_name ILIKE '%' || \${searchtext} || '%'`,
		coa_isdisabled: 'A.coa_isdisabled = ${coa_isdisabled}',
		jurnaltype_id: 'B.jurnaltype_id = ${jurnaltype_id}',
		curr_id: '(A.curr_id is null or A.curr_id = ${curr_id})',
		isdebet: 'B.jurnaltypecoa_isdr = ${isdebet}',
		iskredit: 'B.jurnaltypecoa_iscr = ${iskredit}',
	};

	try {

		// hilangkan criteria '' atau null
		for (var cname in criteria) {
			if (criteria[cname] === '' || criteria[cname] === null) {
				delete criteria[cname]
			}
		}

		var max_rows = limit == 0 ? 10 : limit
		const { whereClause, queryParams } = sqlUtil.createWhereClause(criteria, searchMap)
		const sql = sqlUtil.createSqlSelect({ tablename, columns, whereClause, sort, limit: max_rows + 1, offset, queryParams })
		const rows = await db.any(sql, queryParams);


		var i = 0
		const data = []
		for (var row of rows) {
			i++
			if (i > max_rows) { break }
			data.push(row)
		}

		var nextoffset = null
		if (rows.length > max_rows) {
			nextoffset = offset + max_rows
		}

		return {
			criteria: criteria,
			limit: max_rows,
			nextoffset: nextoffset,
			data: data
		}

	} catch (err) {
		throw err
	}
}