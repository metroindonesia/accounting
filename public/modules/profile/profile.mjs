const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/role'
const form = new $fgta5.Form('user-profile-form')

export default class extends Module {
	constructor() {
		super()
	}

	async main(args = {}) {
		console.log('initializing profile program')
		app.setTitle('Profile')

		app.finalize()
	}
}