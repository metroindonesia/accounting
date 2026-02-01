import pgp from 'pg-promise';

import { dblog } from '@agung_dhewe/webapps/src/db.js'
import Api from '@agung_dhewe/webapps/src/api.js'
import sqlUtil from '@agung_dhewe/pgsqlc'
import context from '@agung_dhewe/webapps/src/context.js'

const tablename = 'datalog'


// api: account
export default class extends Api {
	constructor(req, res, next) {
		super(req, res, next);
	}

	async list(body) { return await logs_list(this, body) }
}


async function logs_list(self, body) {
	const { criteria = {}, limit = 0, offset = 0, sort = {} } = body
	const searchMap = {
		module: `log_module=\${module}`,
		table: `log_table=\${table}`,
		id: `log_doc_id=\${id}`
	};

	try {
		// hilangkan criteria '' atau null
		for (var cname in criteria) {
			if (criteria[cname] === '' || criteria[cname] === null) {
				delete criteria[cname]
			}
		}


		const columns = ['log_time', 'log_user_name', 'log_action', 'log_ipaddress', 'log_remark']


		var max_rows = limit == 0 ? 60 : limit
		const { whereClause, queryParams } = sqlUtil.createWhereClause(criteria, searchMap)
		const sql = sqlUtil.createSqlSelect({ tablename, columns, whereClause, sort, limit: max_rows + 1, offset, queryParams })
		const rows = await dblog.any(sql, queryParams);


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