import Context from './user-context.mjs'

export const extenderHeader = null
export const extenderFavourite = null
export const extenderLogin = null
export const extenderGroup = null
export const extenderProp = null
export const extenderRole = null


const VIEW_VARIANCE = 'view'
const DETILONLY_VARIANCE = 'detilonly'


const _user_name = 'userHeaderEdit-obj_user_name'
const _user_password = 'userHeaderEdit-obj_user_password'


export async function init(self, args) {
	console.log('initializing userExtender ...')

	// tambahkan extender inisiasi module user
	const editModule = self.Modules.userHeaderEdit
	const frm = editModule.getHeaderForm()
	frm.addEventListener('locked', (evt) => { frm_locked(self, evt) });
	frm.addEventListener('unlocked', (evt) => { frm_unlocked(self, evt) });

	const passwordInput = frm.Inputs[_user_password]

	// tambahkan content dari template extender
	{
		// const target = secRec.querySelector('#fRecord-section div[name="column"][exteder]')
		const target = document.body
		const tpl = document.querySelector('template[name="dialog-change-password"]')
		if (tpl != null) {
			const clone = tpl.content.cloneNode(true); // salin isi template
			// tambahkan di paling bawah
			target.prepend(clone)
		}
	}



	// tambahkan tombol di user password
	setTimeout(() => {
		const dialog = document.getElementById('myDialog')
		const btnChangePassword = document.getElementById('btnChangePassword')
		const btnCancel = document.getElementById('btnCancel')
		const newPassword = document.getElementById('newPassword')

		const cntPass = document.getElementById('userHeaderEdit-obj_user_password-container')

		const btn = document.createElement('button')
		btn.setAttribute('id', 'btn_resetpassword')
		btn.setAttribute('href', 'javascript:void(0)')
		btn.innerHTML = `
			<span class="action-button-icon">
				<img src="public/icons/button-reset.svg">
			</span>
			<span class="action-button-text" id="btn_resetpassword-text">Set/Reset</span>
		`
		btn.classList.add('hidden')
		btn.classList.add('action-button')
		btn.classList.add('btn-setpassword')
		btn.addEventListener('click', (evt) => {
			// console.log('reset password')
			// tampilkan dialog untuk reset password
			newPassword.value = ''
			dialog.showModal();
		})

		btnChangePassword.addEventListener('click', evt => {
			const newpass = newPassword.value.trim()
			if (newpass == '') {
				$fgta5.MessageBox.warning('password tidak boleh kosong')
				return
			}
			btnChangePasswordClick(self, passwordInput, newpass)
			dialog.close();
		})

		btnCancel.addEventListener('click', evt => {
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

		setButtonText(self)

	} catch (err) {
		console.log(err)
		$fgta5.MessageBox.error(err.message)
	}
}


function frm_locked(self, evt) {
	showPasswordButton(false)
}


function frm_unlocked(self, evt) {
	const onDetilOnly = Context.variance == DETILONLY_VARIANCE
	if (onDetilOnly) {
		return
	}

	showPasswordButton(true)
	setButtonText(self)


}


function showPasswordButton(visible) {
	const btn = document.getElementById('btn_resetpassword')
	if (visible) {
		btn.classList.remove('hidden')
	} else {
		btn.classList.add('hidden')
	}
}

function setButtonText(self) {
	const editModule = self.Modules.userHeaderEdit
	const frm = editModule.getHeaderForm()




	const btntext = document.getElementById('btn_resetpassword-text')
	const passwordInput = frm.Inputs[_user_password]
	if (passwordInput.value != '') {
		btntext.innerHTML = 'RESET'
	} else {
		btntext.innerHTML = 'SET'
	}
}


export function setupActionButtonEvent(self, frm, CurrentState, buttons) {
	const onView = Context.variance == VIEW_VARIANCE
	const onDetilOnly = Context.variance == DETILONLY_VARIANCE

	console.log('setup action button')
	CurrentState.Actions.newdata.suspend(onView || onDetilOnly)
	CurrentState.Actions.edit.suspend(onView)

}

export function userHeaderEdit_formOpened(self, frm, CurrentState) {
	const onDetilOnly = Context.variance == DETILONLY_VARIANCE
	const obj = frm.Inputs[_user_name]
	obj.disabled = true


	if (onDetilOnly) {
		CurrentState.Actions.delete.suspend(true)

		// disable semua input
		for (var name in frm.Inputs) {
			frm.Inputs[name].disabled = true
		}

	}
	// CurrentState.Actions.newdata.suspend(onView)
	// CurrentState.Actions.edit.suspend(onView)
}

export async function userHeaderEdit_newData(self, datainit, frm) {
	const obj = frm.Inputs[_user_name]
	obj.disabled = false
}

export async function userHeaderEdit_dataSaved(self, data, frm) {
	const obj = frm.Inputs[_user_name]
	obj.disabled = true
}


