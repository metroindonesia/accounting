const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/role'
const form = new $fgta5.Form('user-profile-form')
const obj_user_name = form.Inputs.obj_user_name
const btn_changepassword = document.getElementById('btn_changepassword')
const txt_pass1 = document.getElementById('txt_pass1')
const txt_pass2 = document.getElementById('txt_pass2')


export default class extends Module {
	constructor() {
		super()
	}

	async main(args = {}) {
		console.log('initializing profile program')
		app.setTitle('Profile')
		app.finalize()

		btn_changepassword.addEventListener('click', () => {
			btn_changepassword_click()
		})


		try {
			const result = await Module.apiCall(`/profile/init`, {})
			obj_user_name.value = result.user_name

			console.log(result)
		} catch (err) {
			console.error(err)
			$fgta5.MessageBox.error(err.message)
		}
	}
}


async function btn_changepassword_click() {
	try {
		// cek isi password
		const val_pass1 = txt_pass1.value
		const val_pass2 = txt_pass2.value
		if (val_pass1 != val_pass2) {
			$fgta5.MessageBox.warning('Password invalid, pastikan password diketik sama')
			return
		}

		if (val_pass1.trim() == '') {
			return
		}

		const newPassword = val_pass1
		const param = { newPassword }
		const result = await Module.apiCall(`/profile/change-password`, param)

		if (!result) {
			throw new Error('ada kesalahan saat penggantian password')
		}

		txt_pass1.value = ''
		txt_pass2.value = ''
		$fgta5.MessageBox.info('Password has changed')


	} catch (err) {
		console.error(err.message)
		$fgta5.MessageBox.error(err.message)
	}
}