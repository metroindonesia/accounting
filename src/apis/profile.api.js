import Api from '@agung_dhewe/webapps/src/api.js'
import bcrypt from 'bcrypt';
import db from '@agung_dhewe/webapps/src/db.js'


export default class extends Api {

	async init(body) { return await profile_init(this, body) }
	async encryptPassword(body) { return await profile_encryptPassword(this, body) }
	async changePassword(body) { return await profile_changePassword(this, body) }
}

async function profile_init(self, body) {
	const req = self.req
	const user_id = req.session.user.userId

	try {
		const sql = 'select * from core."user" where user_id=${user_id}'
		const result = await db.one(sql, {
			user_id: user_id
		})

		return {
			user_name: result.user_name
		}
	} catch (err) {
		throw err
	}
}


async function profile_encryptPassword(self, body) {
	const { password } = body
	const saltRounds = 10;
	const hash = await bcrypt.hash(password, saltRounds);
	return hash
}

async function profile_changePassword(self, body) {
	const req = self.req
	const user_id = req.session.user.userId

	const { newPassword } = body
	const saltRounds = 10;
	const hash = await bcrypt.hash(newPassword, saltRounds);

	// ganti password di db
	const sql = 'update core."user" set user_password=${newPassword} where user_id=${user_id}'
	await db.none(sql, {
		newPassword: hash,
		user_id: user_id
	})

	return true
}