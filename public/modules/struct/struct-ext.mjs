import Context from './struct-context.mjs'

export async function init(self, args) {
	console.log('initializing structExtender ...')
}


export function obj_struct_parent_selecting_criteria(self, obj_struct_parent, frm, criteria, sort, evt) {
	// hanya yang parent akan dimunculkan

	criteria.struct_isparent = true
	criteria.exclude_self = frm.Inputs['structHeaderEdit-obj_struct_id'].value

	console.log('criteria', criteria)
}


export function headerList_addTableEvents(self, tbl) {
	tbl.addEventListener('rowrender', async evt => { tbl_headerListRowRender(self, evt) })
}

function tbl_headerListRowRender(self, evt) {
	const tr = evt.detail.tr
	const td_level = tr.querySelector('td[data-name="struct_level"]')
	const td_name = tr.querySelector('td[data-name="struct_name"]')

	const level = Number(td_level.getAttribute('data-value'))
	console.log(`${td_name.innerHTML} ${level}`)
	if (level > 1) {
		const paddingLeft = (level - 1) * 30
		td_name.style.paddingLeft = `${paddingLeft}px`
	}

}