const RESET_CONFIRM = 'Sudah ada perubahan data, apakah akan direset?'
const NEWDATA_CONFIRM  = 'Sudah ada perubahan data, apakah akan membuat baru?'
const BACK_CONFIRM = 'Sudah ada perubahan data, apakah akan kembali ke list?'
const DELETE_CONFIRM = 'Apakah akan hapus data '
const EDIT_WARNING = 'Silakan data di save atau di reset dahulu'

class Module {
	static get RESET_CONFIRM() { return RESET_CONFIRM }
	static get NEWDATA_CONFIRM() { return NEWDATA_CONFIRM }
	static get BACK_CONFIRM() { return BACK_CONFIRM }
	static get DELETE_CONFIRM() { return DELETE_CONFIRM }
	static get EDIT_WARNING() { return EDIT_WARNING }
	
	constructor() {
	}

	static isMobileDevice() {
		return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent);
	}

	static renderFooterButtons(footerButtonsContainer) { 
		const footer = document.querySelector('footer.fgta5-app-footer')
		footer.innerHTML = ''

		// masukkan semua footerButtonsContainer ke footer
		for (var bc of Array.from(footerButtonsContainer)) {
			var section = bc.closest('section')
			bc.setAttribute('data-section', section.id)

			footer.appendChild(bc)
		}
	}


	static async sleep(ms) {
		return new Promise(lanjut=>{
			setTimeout(()=>{
				lanjut()
			}, ms)
		})
	}


	static async download(url, args) {
		const method = 'POST'
		const body = JSON.stringify(args)
		const headers = {
			'Content-Type': 'application/json'
		}

		// tambahkan informasi header
		headers['appid'] = 'fgta'
		headers['timestamp'] = 'timestamp'
		headers['verifier'] = 'verifier'

		try {
			const response = await fetch(url, {method, headers, body})
			if (!response.ok) {
				const status = response.status
				
				let errorMessage
				if (status==401) {
					// belum login, hapus session login
					sessionStorage.removeItem('login');
					sessionStorage.removeItem('login_nexturl');
					errorMessage = 'need authorization to download asset'
				} else {
					errorMessage = 'download fail'
				}

				const err = new Error(errorMessage)
				err.status = status
				err.code = response.code || 1
				throw err
			}

			let filename = 'download'; // fallback
			const disposition = response.headers.get('Content-Disposition');
	
			if (disposition && disposition.includes('filename=')) {
				const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
				if (match != null && match[1]) {
					filename = match[1].replace(/['"]/g, ''); // hapus tanda kutip
				}
			}

			// Ambil file sebagai blob
			const blob = await response.blob();


			// Buat link download
			const downloadUrl = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.setAttribute('target', '_blank')
			a.href = downloadUrl
			a.download = filename // atau nama file yang sesuai
			document.body.appendChild(a)
			a.click()
			a.remove()
			URL.revokeObjectURL(downloadUrl); // bersihkan URL blob

		} catch (err) {
			await this.processError(err)
			// throw err	
		}
	}


	static async apiCall(url, args, formData) {
		const inFrane = window.self !== window.top;
		const api = new $fgta5.ApiEndpoint(url)

		api.setHeader('appid', 'fgta')
		api.setHeader('timestamp', 'timestamp')
		api.setHeader('verifier', 'verifier')
		
		try {
			const result = await api.execute(args, formData)
			return result 
		} catch (err) {
			await this.processError(err)
			throw err
		}
	}


	static async processError(err) {
		const inFrane = window.self !== window.top;
		const currentUrl = window.location.href;
		if (err.status==401) {
			console.error(err)
			window.onbeforeunload = null

			if (inFrane) {
				await $fgta5.MessageBox.error(`${err.message}!`)  // perlu tambah tanda seru !, agar gak diproses reload di messagebox
				window.parent.postMessage({
					action:'REDIRECT_TO_LOGIN',
					href: '/login',
					nexturl: currentUrl

				}, '*')
			} else {
				
				document.body.innerHTML = `<div style="font-size: 18px; padding: 30px;">Your session was expired.<br>You need to <a href="/login?nexturl=${currentUrl}">relogin</a></div>`
				setTimeout(()=>{
					location.href = `/login?nexturl=${currentUrl}`
				}, 100000)
			}
			// await this.sleep(10000)
			throw err				
		} else {
			throw err
		}

	}


	static async loadTemplate(name) {
		const tpl = document.querySelector(`template[name="${name}"]`)
		if (tpl==null) {
			throw new Error(`template "${name}" is not found!`)
		}

		const clone = tpl.content.cloneNode(true); // salin isi template
		document.body.appendChild(clone);
	}	



	static insertAtCursor(input, char) {
		const start = input.selectionStart;
		const end = input.selectionEnd;
		const value = input.value;
		input.value = value.slice(0, start) + char + value.slice(end);
		input.setSelectionRange(start + 1, start + 1);
	}

	static deleteAtCursor(input, mode) {
		const start = input.selectionStart;
		const end = input.selectionEnd;
		const value = input.value;

		if (start === end) {
			if (mode === 'backspace' && start > 0) {
			input.value = value.slice(0, start - 1) + value.slice(end);
			input.setSelectionRange(start - 1, start - 1);
			} else if (mode === 'delete' && start < value.length) {
			input.value = value.slice(0, start) + value.slice(end + 1);
			input.setSelectionRange(start, start);
			}
		} else {
			input.value = value.slice(0, start) + value.slice(end);
			input.setSelectionRange(start, start);
		}
	}


	

}





