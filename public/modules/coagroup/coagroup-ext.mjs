import Context from './coagroup-context.mjs'

export async function init(self, args) {
	console.log('initializing coagroupExtender ...')
}



export function obj_coagroup_parent_selecting_criteria(self, obj_coagroup_parent, frm, criteria, sort, evt) {
	criteria.exclude_self = frm.Inputs['coagroupHeaderEdit-obj_coagroup_id'].value
}


export function headerList_addTableEvents(self, tbl) {
	tbl.addEventListener('rowrender', async evt => { tbl_headerListRowRender(self, evt) })
}

function tbl_headerListRowRender(self, evt) {
	const tr = evt.detail.tr
	const td_level = tr.querySelector('td[data-name="coagroup_level"]')
	const td_name = tr.querySelector('td[data-name="coagroup_name"]')

	const level = Number(td_level.getAttribute('data-value'))
	if (level > 1) {
		const paddingLeft = (level - 1) * 30
		td_name.style.paddingLeft = `${paddingLeft}px`
	}

}

