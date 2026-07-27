import pgp from 'pg-promise'

import db from '@agung_dhewe/webapps/src/db.js'
import Api from '@agung_dhewe/webapps/src/api.js'
import sqlUtil from '@agung_dhewe/pgsqlc'
import context from '@agung_dhewe/webapps/src/context.js'
import { Worker } from 'worker_threads';
import * as path from 'path'



const MINUTES = 60 * 1000

const moduleName = 'generator'
const generateTimeoutMs = 5 * MINUTES

// api: account
export default class extends Api {
	constructor(req, res, next) {
		super(req, res, next);
		Api.cekLogin(req)

	}

	async init(body) { return await reportviewer_init(this, body) }
	async generate(body) { return await reportviewer_generate(this, body) }
	async fetch(body) { return await reportviewer_fetch(this, body) }

	async getUnitList(body) { return await reportviewer_getUnitList(this, body) }
	async getStructList(body) { return await reportviewer_getStructList(this, body) }
	async getSiteList(body) { return await reportviewer_getSiteList(this, body) }
	async searchProject(body) { return await reportviewer_searchProject(this, body) }

}


// init module
async function reportviewer_init(self, body) {
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
			sid: req.session.sid,
			notifierId: Api.generateNotifierId(moduleName, req.sessionID),
			notifierSocket: req.app.locals.appConfig.notifierSocket,
			appsUrls: appsUrls,
			setting: {}
		}

		// set data setting	
		initialData.setting.COMPANY_PRINTLOGO = req.app.locals.appConfig.COMPANY_PRINTLOGO

		return initialData
	} catch (err) {
		throw err
	}
}


async function reportviewer_generate(self, body) {
	const req = self.req;
	const { param, clientId } = body
	const user_id = req.session.user.userId
	const user_name = req.session.user.userFullname
	const ipaddress = req.ip

	try {
		const notifierServer = req.app.locals.appConfig.notifierServer
		runDetachedWorker(notifierServer, clientId, {
			user_id: user_id,
			user_name: user_name,
			ipaddress: ipaddress,
			param: param
		})

	} catch (err) {
		throw err
	}
}

async function reportviewer_fetch(self, body) {
	const req = self.req;
	const { cache_id, rowOffset, rowLimit } = body

	try {
		const sql = `
			select
				rowid,
				coa_id, coa_name, 
				saldoawal_idr,
				debet_idr,
				kredit_idr,
				saldoakhir_idr,
				istotal,
				isgroup,
				iscoa,
				coa_level
			from temp.ledger 
			where cache_id=\${cache_id}
			order by rowid
			limit \${rowLimit} 
			OFFSET \${rowOffset}
		`

		console.log(`query for ${cache_id} by offset ${rowOffset}`)
		const rows = await db.any(sql, { cache_id, rowOffset, rowLimit })

		for (var row of rows) {
			if (row.isgroup == true) {
				row.coa_id = '';
			}
		}

		return rows;
	} catch (err) {
		throw err
	}
}


async function notifyClient(notifierServer, clientId, status, info) {
	try {

		const data = { clientId, status, info }
		const url = `${notifierServer}/notify`
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			const httpErrorStatus = response.status
			const httpErrorStatustext = response.statusText
			const err = new Error(`${httpErrorStatus} ${httpErrorStatustext}: ${options.method} ${url}`)
			err.code = httpErrorStatus
			throw err
		}

		return response
	} catch (err) {
		throw err
	}

}

export const runDetachedWorker = (notifierServer, clientId, options) => {
	const timeout = 2 * 60 * 1000  // timeout setelah n detik ekskusi

	// cek dulu apakah valid
	try {
		if (clientId == null || notifierServer == null) {
			throw new Error('clientId / notifierServer belum didefinisikan di parameter runDetachedWorker')
		}
	} catch (err) {
		throw err
	}

	// siapkan worker untuk memproses report
	const workerPath = path.join(context.getRootDirectory(), 'src', 'workers', 'rptledger.worker.js')
	const worker = new Worker(workerPath, {
		workerData: options
	});


	// handle timeout, sesuai dengan waktu yang di set
	const timeoutId = setTimeout(() => {
		console.warn('Worker timeout, terminating...');
		notifyClient(notifierServer, clientId, 'timeout')     // nofify ke clent, kalau timeout
		worker.terminate();
	}, timeout);



	worker.on('message', (info) => {
		clearTimeout(timeoutId);
		console.log('Worker message:', 'message', info);
		if (info.done === true) {
			notifyClient(notifierServer, clientId, 'done', info)     // nofify message ke clent
		} else {
			notifyClient(notifierServer, clientId, 'message', info)     // nofify message ke clent
		}
	});


	// handle error yang terjadi di worker
	worker.on('error', (err) => {
		clearTimeout(timeoutId);
		console.error('Worker error:', err);
		notifyClient(notifierServer, clientId, 'error', { message: err.message })     // nofify error ke clent
		worker.terminate();
	});

	// worker selesi	
	worker.on('exit', (code) => {
		clearTimeout(timeoutId);
		notifyClient(notifierServer, clientId, 'done', {})
		console.log(`Worker exited with code ${code}`);
	});


}


async function reportviewer_getUnitList() {
	try {
		const sql = `select unit_id, unit_name from public.unit order by unit_name`
		const rows = await db.any(sql)
		return rows
	} catch (err) {
		throw err
	}
}

async function reportviewer_getStructList() {
	try {
		const sql = `select struct_id, struct_name from public.struct order by struct_name`
		const rows = await db.any(sql)
		return rows
	} catch (err) {
		throw err
	}
}

async function reportviewer_getSiteList() {
	try {
		const sql = `select site_id, site_name from public.site order by site_name`
		const rows = await db.any(sql)
		return rows
	} catch (err) {
		throw err
	}
}


async function reportviewer_searchProject(self, body) {
	const req = self.req;
	const { searchText } = body

	try {
		const sql = `
			SELECT project_id, project_name 
			FROM public.project 
			WHERE project_name ILIKE \${searchPattern} 
			ORDER BY project_name 
			LIMIT 20
		`;

		const rows = await db.any(sql, { searchPattern: `${searchText}%` })
		return rows
	} catch (err) {
		throw err
	}
}