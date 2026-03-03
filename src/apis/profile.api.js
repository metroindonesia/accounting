import Api from '@agung_dhewe/webapps/src/api.js'
import bcrypt from 'bcrypt';


export default class extends Api {

	async encryptPassword(body) { return await profile_encryptPassword(this, body) }
}


async function profile_encryptPassword(self, body) {
	const { password } = body
	const saltRounds = 10;
	const hash = await bcrypt.hash(password, saltRounds);
	return hash
}