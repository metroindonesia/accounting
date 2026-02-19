import pgp from 'pg-promise';

import db from '@agung_dhewe/webapps/src/db.js'
import Api from '@agung_dhewe/webapps/src/api.js'
import sqlUtil from '@agung_dhewe/pgsqlc'
import context from '@agung_dhewe/webapps/src/context.js'


// api: account
export default class extends Api {
	constructor(req, res, next) {
		super(req, res, next);
		Api.cekLogin(req)
	}

	async listByUser(body) { return await jurnaltype_listByUser(this, body) }
}

export async function jurnaltype_listByUser(self, body) {
	const req = self.req
	const user_id = req.session.user.userId

	const tablename = 'public.jurnaltype A inner join public.jurnaltypeuser B on B.jurnaltype_id = A.jurnaltype_id'
	const columns = ['A.*', 'B.isallowposting as isallowposting', 'B.isallowunposting as isallowunposting']
	const { criteria = {}, limit = 0, offset = 0, sort = {} } = body

	// set user id sesuai yang login
	criteria.user_id = user_id

	const searchMap = {
		searchtext: `A.jurnaltype_name ILIKE '%' || \${searchtext} || '%'`,
		jurnaltype_isallowselect: 'A.jurnaltype_isallowselect = ${jurnaltype_isallowselect}',
		user_id: 'B.user_id = ${user_id}',
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