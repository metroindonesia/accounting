import * as pageHelper from '/public/lib/fgta5app/pagehelper.mjs'


export function coa_id_populating(self, obj_coa_id, frm, evt, sectionSource) {
	const { tr, data, text } = evt.detail

	const td = tr.querySelector('td')
	td.style.display = 'flex'
	td.style.paddingRight = '10px'

	const divCoaId = document.createElement('div')
	divCoaId.innerHTML = data.coa_id
	divCoaId.classList.add('coa-row-coa_id')

	const divCoaName = document.createElement('div')
	divCoaName.innerHTML = text
	divCoaName.classList.add('coa-row-coa_name')

	const divAgingtype = document.createElement('div')
	divAgingtype.innerHTML = data.agingtype_name ?? ''
	divAgingtype.classList.add('coa-row-agingtype')

	const divCurr = document.createElement('div')
	divCurr.innerHTML = data.curr_name ?? ''
	divCurr.classList.add('coa-row-curr')


	td.innerHTML = ''
	td.appendChild(divCoaId)
	td.appendChild(divCoaName)
	td.appendChild(divAgingtype)
	td.appendChild(divCurr)
}


export function curr_id_populating(self, obj_curr_id, frm, evt, sectionSource) {
	const { tr, data, text } = evt.detail

	const td = tr.querySelector('td')
	td.style.display = 'flex'
	td.style.justifyContent = 'space-between';
	td.style.paddingRight = '10px'

	const divCode = document.createElement('div')
	divCode.innerHTML = text
	divCode.classList.add('curr-row-code')

	const divDate = document.createElement('div')
	divDate.innerHTML = data.curr_date
	divDate.classList.add('curr-row-date')

	const divRate = document.createElement('div')
	divRate.innerHTML = pageHelper.formatNumber(data.curr_rate)
	divRate.classList.add('curr-row-value')

	td.innerHTML = ''
	td.appendChild(divCode)
	td.appendChild(divDate)
	td.appendChild(divRate)
}