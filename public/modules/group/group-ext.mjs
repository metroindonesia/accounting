import Context from './group-context.mjs'

export const extenderHeader = null
export const extenderProgram = null

export async function init(self, args) {
	console.log('initializing groupExtender ...')

}


export function headerList_addTableEvents(self, tbl) {
	tbl.addEventListener('rowrender', (evt) => {
		const tr = evt.detail.tr
		const data = evt.detail.args.data
		const { group_isdisabled } = data

		if (group_isdisabled) {
			tr.setAttribute('data-isdisabled', true)
		} else {
			tr.removeAttribute('data-isdisabled', true)
		}
	})
}