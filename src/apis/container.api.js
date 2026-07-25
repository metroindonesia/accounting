import pgp from 'pg-promise';

import db from '@agung_dhewe/webapps/src/db.js'
import Api from '@agung_dhewe/webapps/src/api.js'
import sqlUtil from '@agung_dhewe/pgsqlc'
import { createSequencerLine } from '@agung_dhewe/webapps/src/sequencerline.js'

const moduleName = 'container'

// api: account
export default class extends Api {
	constructor(req, res, next) {
		super(req, res, next);
		Api.cekLogin(req)
	}

	// dipanggil dengan model snake syntax
	// contoh: header-list
	//         header-open-data
	async init(body) { return await container_init(this, body) }
	async addToFavourite(body) { return await container_addToFavourite(this, body) }
	async removeFromFavourite(body) { return await container_removeFromFavourite(this, body) }
}


async function container_init(self, body) {
	const req = self.req
	req.session.sid = req.sessionID

	let baseOrigin = `${req.protocol}://${req.get('host')}`;
	const b = new URL(baseOrigin);
	if (b.hostname != 'localhost') {
		baseOrigin = null   // baseOrigin=null, berarti tidak ada penggantian origin
	}



	try {
		return {
			title: req.app.locals.appConfig.appTitle,
			userId: req.session.user.userId,
			userName: req.session.user.userName,
			userFullname: req.session.user.userFullname,
			sid: req.session.sid,
			notifierId: Api.generateNotifierId(moduleName, req.sessionID),
			notifierSocket: req.app.locals.appConfig.notifierSocket,
			programs: await getAllProgram(self, req.session.user.userId, baseOrigin),
			favourites: await getUserFavourites(self, req.session.user.userId),
			iconMenuUrl: req.app.locals.appConfig.iconMenuUrl,
		}
	} catch (err) {
		throw err
	}
}


async function getUserFavourites(self, user_id) {

	const data = []
	try {
		const sql = 'select program_id from core.userfavouriteprogram where user_id=${user_id}'
		const param = { user_id }
		const rows = await db.any(sql, param)
		for (var row of rows) {
			data.push(row.program_id)
		}
		return data
	} catch (err) {
		throw err
	}
}

async function getAllProgram(self, user_id, baseOrigin) {
	try {
		const sql = 'select * from core.get_user_programs (${user_id})'
		const rows = await db.any(sql, { user_id })
		const programs = composeMenuProgram(baseOrigin, rows)
		return programs
	} catch (err) {
		throw err
	}
}


function changeOrigin(stringUrl, newOrigin) {
	// tidak perlu ada penggantian origin jika newOrigin berisi null
	if (newOrigin == null) {
		return stringUrl
	}

	const u = new URL(stringUrl);
	const newU = new URL(newOrigin);

	if (u.origin !== newU.origin) {
		u.protocol = newU.protocol;
		u.hostname = newU.hostname;
		u.port = newU.port;
	}

	return u.toString();
}


function composeMenuProgram(baseOrigin, rows, parent = null) {
	const programs = []
	const rowLevel = rows.filter(row => row.parent == parent)
	for (let row of rowLevel) {

		let iconUrl = row.icon == '' ? null : row.icon
		if (iconUrl != null) {
			iconUrl = changeOrigin(iconUrl, baseOrigin)
		}

		if (row.type === 'program') {
			// program
			const programUrl = changeOrigin(row.url, baseOrigin)
			programs.push({
				type: 'program',
				name: row.id,
				title: row.title,
				icon: iconUrl,
				url: programUrl
			})
		} else {
			// directory
			programs.push({
				title: row.title,
				icon: iconUrl,
				border: (row.icon == '' || row.icon == null) ? false : true,
				items: composeMenuProgram(baseOrigin, rows, row.id)
			})
		}
	}
	return programs
}


async function container_addToFavourite(self, body) {
	const { program_id } = body
	const req = self.req
	const user_id = req.session.user.userId

	try {

		const result = await db.tx(async tx => {
			sqlUtil.connect(tx)

			// cek apakah user sudah ada program favourite ini
			const sql = 'select program_id from core.userfavouriteprogram where user_id=${user_id} and program_id=${program_id}'
			const param = { user_id, program_id }
			const row = await tx.oneOrNone(sql, param)

			if (row == null) {
				// belum ada, tambahkan ke user favourite
				const sequencer = createSequencerLine(tx, {})
				const seqdata = await sequencer.increment('USR')
				const userfavouriteprogram_id = seqdata.id
				const data = {
					userfavouriteprogram_id,
					program_id,
					user_id,
					_createby: user_id,
					_createdate: (new Date()).toISOString()
				}

				const cmd = sqlUtil.createInsertCommand('core.userfavouriteprogram', data)
				const ret = await cmd.execute(data)
			}
		})

	} catch (err) {
		throw err
	}
}

async function container_removeFromFavourite(self, body) {
	const { program_id } = body
	const req = self.req
	const user_id = req.session.user.userId

	try {
		// hapus dari favourite
		const sql = 'delete from core.userfavouriteprogram where user_id=${user_id} and program_id=${program_id}'
		const param = { user_id, program_id }
		await db.none(sql, param)

	} catch (err) {
		throw err
	}
}
