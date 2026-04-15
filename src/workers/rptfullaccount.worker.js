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

		let procedureName

		switch (param.typelap) {
			case 'fa_mtd':
				procedureName = 'public.fullaccount_mtd';
				break;

			case 'fa_ytd':
				procedureName = 'public.fullaccount_ytd';
				break;

			default:
				procedureName = 'public.fullaccount_mtd';
		}

		// panggil stored procedure dengan cache_id
		const sqlParam = {
			date: param.date,
			cache_id: cache_id
		}

		// const sqlDataRequest = 'call act.nr_idr (${date}, ${isytd}, ${cache_id}::uuid)'
		// const sqlDataRequest = `call ${procedureName} (${date}, ${isytd}, ${cache_id}::uuid)`
		const sqlDataRequest = `call ${procedureName} (${'${date}'},${'${cache_id}::uuid'})`;
		await db.none(sqlDataRequest, sqlParam)


		// hitung jumlah baris
		const sqlCountRows = 'select count(rowid) as n from temp.fullaccount where cache_id=${cache_id}'
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