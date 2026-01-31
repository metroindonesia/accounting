import pgp from 'pg-promise';
import bcrypt from 'bcrypt';

import sqlUtil from '@agung_dhewe/pgsqlc'
import db from '@agung_dhewe/webapps/src/db.js'
import Api from '@agung_dhewe/webapps/src/api.js'

const ModuleDbContract = {
	user: {
		table: 'core."user"'
	}
}

export default class extends Api {
	constructor(req, res, next) {
		super(req, res, next);

		this.currentState = {}
		try {
			Api.cekLogin(req)
			this.currentState.isLogin = true
		} catch (err) {
			// tidak perlu throw error, karna hanya untuk cek sudah login apa belum
			this.currentState.isLogin = false
		}

	}

	// dipanggil dengan model snake syntax
	// contoh: header-list
	//         header-open-data
	async init(body) { return await login_init(this, body) }
	async doLogin(body) { return await login_doLogin(this, body) }
	async doLogout(body) { return await login_doLogout(this, body) }
}


async function login_init(self, body) {
	const req = self.req
	if (self.currentState.isLogin) {
		req.session.sid = req.sessionID
	}

	return {
		isLogin: self.currentState.isLogin
	}
}

async function login_doLogin(self, body) {
	const req = self.req
	try {
		const { username, password } = body


		let currentUser = {}
		if (username == 'localdev') {
			// login localdev untuk kerperluan testing
			// TODO: perlu ada setting di .env untuk disable login ini
			if (password != 'fgta5master') {
				return null
			}

			currentUser.Id = 1
			currentUser.name = 'localdev'
			currentUser.fullName = 'Local Developer'
			currentUser.developerAccess = true

		} else {

			// ambil informasi login di database user
			const sql = `select * from ${ModuleDbContract.user.table} where user_name = \${username}`
			const param = { username }
			const row = await db.oneOrNone(sql, param)
			if (row == null) {
				return null
			}

			currentUser.Id = row.user_id
			currentUser.name = row.user_name
			currentUser.fullName = row.user_fullname
			currentUser.developerAccess = row.user_isdev

			const match = await bcrypt.compare(password, row.user_password);
			if (!match) {
				return null
			}
		}


		// simpan di session
		self.req.session.user = {
			userId: currentUser.Id,
			userName: currentUser.name,
			userFullname: currentUser.fullName,
			developerAccess: currentUser.developerAccess,
			isLogin: true
		}

		return self.req.session.user

	} catch (err) {
		throw err
	}
}

async function login_doLogout(self, body) {
	try {
		self.req.session.user = null
		return true
	} catch (err) {
		throw err
	}
}