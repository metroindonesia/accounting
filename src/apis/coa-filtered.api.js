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
		searchtext: `A.coa_id=try_cast_int(\${searchtext}, 0) OR A.coa_name ILIKE '%' || \${searchtext} || '%'`,
		coa_isdisabled: 'A.coa_isdisabled = ${coa_isdisabled}',
		jurnaltype_id: 'B.jurnaltype_id = ${jurnaltype_id}',
		curr_id: '(A.curr_id is null or A.curr_id = ${curr_id})',
		isdebet: 'B.jurnaltypecoa_isdr = ${isdebet}',
		iskredit: 'B.jurnaltypecoa_iscr = ${iskredit}',
	};

	try {

		const jurnaltype_id = criteria.jurnaltype_id

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


			// lookup: curr_name dari field curr_name pada table public.curr dimana (public.curr.curr_id = public.coa.curr_id)
			{
				const { curr_name } = await sqlUtil.lookupdb(db, 'public.curr', 'curr_id', row.curr_id)
				row.curr_name = curr_name
			}
			// lookup: coagroup_name dari field coagroup_name pada table public.coagroup dimana (public.coagroup.coagroup_id = public.coa.coagroup_id)
			{
				const { coagroup_name } = await sqlUtil.lookupdb(db, 'public.coagroup', 'coagroup_id', row.coagroup_id)
				row.coagroup_name = coagroup_name
			}
			// lookup: coarpt_name dari field coarpt_name pada table public.coarpt dimana (public.coarpt.coarpt_id = public.coa.coarpt_id)
			{
				const { coarpt_name } = await sqlUtil.lookupdb(db, 'public.coarpt', 'coarpt_id', row.coarpt_id)
				row.coarpt_name = coarpt_name
			}
			// lookup: agingtype_name dari field agingtype_name pada table public.agingtype dimana (public.agingtype.agingtype_id = public.coa.agingtype_id)
			{
				const { agingtype_name } = await sqlUtil.lookupdb(db, 'public.agingtype', 'agingtype_id', row.agingtype_id)
				row.agingtype_name = agingtype_name
			}

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