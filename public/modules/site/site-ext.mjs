import Context from './site-context.mjs'

export const extenderHeader = null


const _site_code = 'siteHeaderEdit-obj_site_code'
const VIEW_VARIANCE = 'view'

export async function init(self, args) {
	console.log('initializing siteExtender ...')


}


export function setupActionButtonEvent(self, frm, CurrentState, buttons) {
	const onView = Context.variance == VIEW_VARIANCE

	CurrentState.Actions.newdata.suspend(onView)
	CurrentState.Actions.edit.suspend(onView)

}

export function siteHeaderEdit_formOpened(self, frm, CurrentState) {
	const obj = frm.Inputs[_site_code]
	obj.disabled = true
}

export async function siteHeaderEdit_newData(self, datainit, frm) {
	const obj = frm.Inputs[_site_code]
	obj.disabled = false
}

export async function siteHeaderEdit_dataSaved(self, data, frm) {
	const obj = frm.Inputs[_site_code]
	obj.disabled = true
}
