import Context from './permission-context.mjs'

const _permission_name = 'permissionHeaderEdit-obj_permission_name'


export const extenderHeader = null;


export async function init(self, args) {
	console.log('initializing permissionExtender ...')

}




export function permissionHeaderEdit_formOpened(self, frm, CurrentState) {
	const obj = frm.Inputs[_permission_name]
	obj.disabled = true
}

export async function permissionHeaderEdit_newData(self, datainit, frm) {
	const obj = frm.Inputs[_permission_name]
	obj.disabled = false
}

export async function permissionHeaderEdit_dataSaved(self, data, frm) {
	const obj = frm.Inputs[_permission_name]
	obj.disabled = true
}