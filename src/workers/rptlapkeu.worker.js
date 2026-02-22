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
		let isytd

		// const sqlParam = {
		// 	date: param.date,
		// 	// typelap: param.typelap,
		// 	// isytd: param.isytd,
		// 	cache_id: cache_id
		// }

		switch (param.typelap) {
			case 'nr_mtd':
				procedureName = 'public.nr_idr';
				isytd = false;
				// console.log('Case nr_mtd → procedure:', procedureName, ', isytd:', isytd);
				break;

			case 'nr_ytd':
				procedureName = 'public.nr_idr';
				isytd = true;
				// console.log('Case nr_ytd → procedure:', procedureName, ', isytd:', isytd);
				break;

			case 'lr_mtd':
				procedureName = 'public.lr_idr';
				isytd = false;
				// console.log('Case lr_mtd → procedure:', procedureName, ', isytd:', isytd);
				break;

			case 'lr_ytd':
				procedureName = 'public.lr_idr';
				isytd = true;
				// console.log('Case lr_ytd → procedure:', procedureName, ', isytd:', isytd);
				break;

			default:
				procedureName = 'public.nr_idr';
				isytd = false;
			// console.log('Case default nr_idr → procedure:', procedureName, ', isytd:', isytd);
		}

		// panggil stored procedure dengan cache_id
		const sqlParam = {
			date: param.date,
			// typelap: param.typelap,
			isytd: isytd,
			cache_id: cache_id
		}


		const sqlDataRequest = `call ${procedureName} (${'${date}'},${'${isytd}'},${'${cache_id}::uuid'})`;
		await db.none(sqlDataRequest, sqlParam)


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