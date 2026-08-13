import Context from './item-context.mjs'
import * as ExtHeader from './item-ext-header.mjs'

export const extenderHeader = ExtHeader



const VIEW_VARIANCE = 'view'

export async function init(self, args) {
	console.log('initializing itemExtender ...')
	ExtHeader.init_header(self, args)

}


export function setupActionButtonEvent(self, frm, CurrentState, buttons) {
	const onView = Context.variance == VIEW_VARIANCE
	CurrentState.Actions.newdata.suspend(onView)
	CurrentState.Actions.edit.suspend(onView)
}