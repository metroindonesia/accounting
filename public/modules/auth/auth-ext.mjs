import Context from './auth-context.mjs'

export const extenderHeader = null

export async function init(self, args) {
	console.log('initializing authExtender ...')

	// tambahkan extender inisiasi module auth

}



export function authHeaderEdit_formOpened(self, frm, CurrentState) {
	const obj = frm.Inputs['authHeaderEdit-obj_auth_name']
	obj.disabled = true
}

export async function authHeaderEdit_newData(self, datainit, frm) {
	const obj = frm.Inputs['authHeaderEdit-obj_auth_name']
	obj.disabled = false
}

export async function authHeaderEdit_dataSaved(self, data, frm) {
	const obj = frm.Inputs['authHeaderEdit-obj_auth_name']
	obj.disabled = true
}