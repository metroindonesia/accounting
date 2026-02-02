import Context from './user-context.mjs'


const _user_name = 'userHeaderEdit-obj_user_name'


export async function init(self, args) {
	console.log('initializing userExtender ...')

	// tambahkan extender inisiasi module user
	const editModule = self.Modules.userHeaderEdit
	const frm = editModule.getHeaderForm()
	frm.addEventListener('locked', (evt) => { frm_locked(self, evt) });
	frm.addEventListener('unlocked', (evt) => { frm_unlocked(self, evt) });

	const passwordInput = frm.Inputs['userHeaderEdit-obj_user_password']	

	// tambahkan content dari template extender
	{
		// const target = secRec.querySelector('#fRecord-section div[name="column"][exteder]')
		const target = document.body
		const tpl = document.querySelector('template[name="dialog-change-password"]')
		if (tpl!=null) {
			const clone = tpl.content.cloneNode(true); // salin isi template
			// tambahkan di paling bawah
			target.prepend(clone)
		}
	}
	


	// tambahkan tombol di user password
	setTimeout(()=>{
		const dialog = document.getElementById('myDialog')
		const btnChangePassword = document.getElementById('btnChangePassword')
		const btnCancel = document.getElementById('btnCancel')
		const newPassword = document.getElementById('newPassword')

		const cntPass = document.getElementById('userHeaderEdit-obj_user_password-container')

		const btn = document.createElement('a')
		btn.setAttribute('id', 'btn_resetpassword')
		btn.setAttribute('href', 'javascript:void(0)')
		btn.innerHTML = 'reset password'
		btn.classList.add('hidden')
		btn.addEventListener('click', (evt)=>{
			// console.log('reset password')
			// tampilkan dialog untuk reset password
			newPassword.value = ''
			dialog.showModal();
		})

		btnChangePassword.addEventListener('click', evt=>{
			const newpass = newPassword.value.trim()
			if (newpass=='') {
				$fgta5.MessageBox.warning('password tidak boleh kosong')
				return
			}
			btnChangePasswordClick(self, passwordInput, newpass)
			dialog.close();
		})

		btnCancel.addEventListener('click', evt=>{
			dialog.close();
		})

		cntPass.appendChild(btn)
	}, 1000)
	
}


async function btnChangePasswordClick(self, passwordInput, password) {
	try {
		const param = { password }
		const result = await Module.apiCall(`/profile/encrypt-password`, param)
		console.log(result)
		passwordInput.value = result
	} catch (err) {
		console.log(err)
		$fgta5.MessageBox.error(err.message)
	}
}


function frm_locked(self, evt) {
	const btn = document.getElementById('btn_resetpassword')
	btn.classList.add('hidden')
}


function frm_unlocked(self, evt) {
	const btn = document.getElementById('btn_resetpassword')
	btn.classList.remove('hidden')
}





export function userHeaderEdit_formOpened(self, frm, CurrentState) {
	const obj = frm.Inputs['userHeaderEdit-obj_user_name']
	obj.disabled = true
}

export async function userHeaderEdit_newData(self, datainit, frm) {
	const obj = frm.Inputs['userHeaderEdit-obj_user_name']
	obj.disabled = false
}

export async function userHeaderEdit_dataSaved(self, data, frm) {
	const obj = frm.Inputs['userHeaderEdit-obj_user_name']
	obj.disabled = true
}