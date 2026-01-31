const Context = {}
const btn_login = document.getElementById('btn_login')
const obj_username = document.getElementById('obj_username')
const obj_password = document.getElementById('obj_password')

// need test direct open
// https://core-dev.transfashion.id/?nexturl=https://ent-dev.transfashion.id/sitetype&id=STO
// skenario: buka link di atas dalam kondisi belum login, setelah login, diredirect lagi ke halaman di atas


export default class extends Module {
	constructor() {
		super()
	}

	async main(args={}) {
		
		console.log('initializing module...')

		sessionStorage.removeItem('nextmodule');
		btn_login.addEventListener('click', (evt)=>{
			btn_login_click(self, evt)
		})
		
		obj_username.addEventListener('keypress', evt=>{
			const key = evt.key.toLowerCase()
			if (key=='enter' && obj_username.value.trim()!='') {
				obj_password.focus()
			}
		})

		obj_password.addEventListener('keypress', evt=>{
			const key = evt.key.toLowerCase()
			if (key=='enter' && obj_password.value.trim()!='') {
				btn_login.click()
			}
		})



		try {
			// inisiasi sisi server
			try {
				const result = await Module.apiCall(`/login/init`, { })
				if (result.isLogin) {
					location.href = '/'
				}
			} catch (err) {
				throw err
			} 

		} catch (err) {
			throw err
		}

	}

}



async function btn_login_click(self, evt) {
	console.log('login')
	const username = obj_username.value
	const password = obj_password.value
	
	const queryString = window.location.search
	const params = new URLSearchParams(queryString)
	const nexturl = params.get('nexturl')
	const nextmodule = params.get('nextmodule')

	console.log(nexturl, nextmodule)

	let mask = $fgta5.Modal.createMask()
	try {
		// login, tidak pakai self.apiCall, karena akan bypass session
		const apiLogin = new $fgta5.ApiEndpoint('login/do-login')
		const result = await apiLogin.execute({username, password})
		if (result!=null) {
			// login berhasil
			
			// simpan flag login
			sessionStorage.setItem('login', true);

			if (nextmodule!=null) {
				sessionStorage.setItem('nextmodule', nextmodule);
			}

			if (nexturl!=null) {
				// redirect ke next url
				sessionStorage.setItem('login_nexturl', nexturl);
				location.href = nexturl
			} else {
				location.href = '/'
			}
		} else {
			// login gagal
			$fgta5.MessageBox.error('Login salah!')
		}

	} catch (err) {
		console.log(err)
		$fgta5.MessageBox.error(err.message)
	} finally {
		mask.close()
		mask = null
	}
}