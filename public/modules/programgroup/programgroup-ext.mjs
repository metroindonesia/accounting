import Context from './programgroup-context.mjs'

export async function init(self, args) {
	console.log('initializing programgroupExtender ...')
}




export function obj_programgroup_parent_selecting_criteria(self, obj_programgroup_parent, frm, criteria, sort, evt) {
	// hanya yang parent akan dimunculkan

	criteria.programgroup_isparent = true
	criteria.exclude_self = frm.Inputs['programgroupHeaderEdit-obj_programgroup_id'].value

	console.log('criteria', criteria)
}


export function headerList_addTableEvents(self, tbl) {
	tbl.addEventListener('rowrender', async evt => { tbl_headerListRowRender(self, evt) })
}

function tbl_headerListRowRender(self, evt) {
	const tr = evt.detail.tr
	const td_level = tr.querySelector('td[data-name="programgroup_level"]')
	const td_name = tr.querySelector('td[data-name="programgroup_name"]')

	const level = Number(td_level.getAttribute('data-value'))
	console.log(`${td_name.innerHTML} ${level}`)
	if (level > 1) {
		const paddingLeft = (level - 1) * 30
		td_name.style.paddingLeft = `${paddingLeft}px`
	}

}


