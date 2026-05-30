import Context from './role-context.mjs'


export const extenderHeader = null
export const extenderPermission = null

const _role_name = 'roleHeaderEdit-obj_role_name'


export async function init(self, args) {
	console.log('initializing roleExtender ...')

}


export function roleHeaderEdit_formOpened(self, frm, CurrentState) {
	const obj = frm.Inputs[_role_name]
	obj.disabled = true
}

export async function roleHeaderEdit_newData(self, datainit, frm) {
	const obj = frm.Inputs[_role_name]
	obj.disabled = false
}

export async function roleHeaderEdit_dataSaved(self, data, frm) {
	const obj = frm.Inputs[_role_name]
	obj.disabled = true
}
