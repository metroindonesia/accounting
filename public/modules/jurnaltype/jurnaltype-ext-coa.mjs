const _jurnaltype_id = 'jurnaltypeCoaEdit-obj_jurnaltype_id'

export function init_coa(self, args) {
}

export function obj_coa_id_selecting_criteria(self, obj_coa_id, frm, criteria, sort, evt) {
	// cari yang belum dipilih + yang sudah dipilih saat ini
	const jurnaltype_id = frm.Inputs[_jurnaltype_id].value

	criteria.current_coa_id_selected = obj_coa_id.value
	criteria.exclude_jurnaltype_id = jurnaltype_id
}



export async function obj_coa_id_populating(self, obj_coa_id, frm, evt) {

	const { tr, data, text } = evt.detail

	const td = tr.querySelector('td')
	td.style.display = 'flex'
	td.style.paddingRight = '10px'

	const divCoaId = document.createElement('div')
	divCoaId.innerHTML = data.coa_id
	divCoaId.classList.add('jurnaltype-row-coa_id')

	const divCoaName = document.createElement('div')
	divCoaName.innerHTML = text
	divCoaName.classList.add('jurnaltype-row-coa_name')

	const divAgingtype = document.createElement('div')
	divAgingtype.innerHTML = data.agingtype_name ?? ''
	divAgingtype.classList.add('jurnaltype-row-agingtype')

	td.innerHTML = ''
	td.appendChild(divCoaId)
	td.appendChild(divCoaName)
	td.appendChild(divAgingtype)

}