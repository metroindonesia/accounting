import { workerData, parentPort } from 'worker_threads';
import path from 'path';
import pgp from 'pg-promise'
import db from '@agung_dhewe/webapps/src/db.js'

const { user_id, user_name, ipaddress, param } = workerData;

main(param)

async function main(param) {
	try {
		// siapkan data cache
		const sqlCache = 'select gen_random_uuid() as cache_id;'
		const row = await db.one(sqlCache)
		const cache_id = row.cache_id;

		// report parameter
		const { isytd, report, scope, unit_id, struct_id, site_id, project_id, coalevel, date } = param
		const sqlParam = {
			date: date,
			isytd: isytd,
			datascope: scope,
			unit_id: unit_id,
			struct_id: struct_id,
			site_id: site_id,
			project_id: project_id,
			coalevel: coalevel,
			cache_id: cache_id
		}

		console.log(sqlParam)

		if (report == 'nr') {
			const sqlDataRequest = 'call public.nr_idr_scope (${date}, ${isytd}, ${datascope}, ${unit_id}::int4, ${struct_id}::int4, ${site_id}::int4, ${project_id}::int8, ${coalevel}::int2, ${cache_id}::uuid)'
			await db.none(sqlDataRequest, sqlParam)
		} else if (report == 'lr') {
			const sqlDataRequest = 'call public.lr_idr_scope (${date}, ${isytd}, ${datascope}, ${unit_id}::int4, ${struct_id}::int4, ${site_id}::int4, ${project_id}::int8, ${coalevel}::int2, ${cache_id}::uuid)'
			await db.none(sqlDataRequest, sqlParam)
		} else {
			throw new Error(`report '${report}' is not supported`)
		}


		// hitung jumlah baris
		const sqlCountRows = 'select count(rowid) as n from temp.ledger where cache_id=${cache_id}'
		const rowInfo = await db.one(sqlCountRows, { cache_id })
		const rowCount = rowInfo.n


		parentPort.postMessage({ done: true, cache_id: cache_id, rowCount: rowCount })
	} catch (err) {
		err.message = `Generator Worker: ${err.message}`
		throw err
	}
}

async function sleep(s) {
	if (s == 0) {
		return
	}
	return new Promise(lanjut => {
		setTimeout(() => {
			lanjut()
		}, s * 1000)
	})
}