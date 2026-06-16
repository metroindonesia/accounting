import Context from './curr-context.mjs'

export const extenderHeader = null
export const extenderRate = null

const VIEW_VARIANCE = 'view'


export async function init(self, args) {
	console.log('initializing currExtender ...')



}


export function setupActionButtonEvent(self, frm, CurrentState, buttons) {
	const onView = Context.variance == VIEW_VARIANCE

	CurrentState.Actions.newdata.suspend(onView)
	CurrentState.Actions.edit.suspend(onView)

}
