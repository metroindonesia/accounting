import Context from './program-context.mjs'

export const extenderHeader = null


export async function init(self, args) {
	console.log('initializing programExtender ...')




}

export function headerList_addTableEvents(self, tbl) {
	tbl.addEventListener('rowrender', (evt) => {
		const tr = evt.detail.tr
		const data = evt.detail.args.data
		const { program_isdisabled } = data


		if (program_isdisabled) {
			tr.setAttribute('data-isdisabled', true)
		} else {
			tr.removeAttribute('data-isdisabled', true)
		}
	})
}

