// import Context from './jurnal-context.mjs'

const obj = {}

export function init_detil(self, args)  {
	obj.btnPayable = args.btnPayable
	obj.btnReceivable = args.btnReceivable


	// footer pada table detil
	{
		const target = document.getElementById('jurnalDetilList-tbl')
		const tpl = document.getElementById('tpl-detil-tfoot')
		if (tpl!=null) {
			const clone = tpl.content.cloneNode(true); // salin isi template
			const tfoot = clone.querySelector('tfoot')
			target.appendChild(tfoot)
		}
	}


	// footer pada detil form
	{
		const target = document.getElementById('jurnalDetilEdit-footer')
		const tpl = document.getElementById('tpl-detil-balance')
		if (tpl!=null) {
			const clone = tpl.content.cloneNode(true); // salin isi template
			const tfoot = clone.querySelector('div')
			target.appendChild(tfoot)
		}
	}

	
}


function formatNumber(num) {
  return new Intl.NumberFormat("en-EN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
}

function recalculateCurrency(self, frm) {
	const rate = frm.Inputs['jurnalDetilEdit-obj_curr_rate'].value
	const value = frm.Inputs['jurnalDetilEdit-obj_jurnaldetil_value'].value
	const idr = value * rate
	
	frm.Inputs['jurnalDetilEdit-obj_jurnaldetil_idr'].value = idr
}


function agingtype_changed(frm, agingtype_id) {
	if (agingtype_id==1 || agingtype_id==2) {
		frm.Inputs['jurnalDetilEdit-obj_partner_id'].markAsRequired(true)
	} else {
		frm.Inputs['jurnalDetilEdit-obj_partner_id'].markAsRequired(false)
	}

}

export function jurnalDetilList_openList(self, headerForm) {
	const data = headerForm.getData()


	// set judul section menjadi nomor dokumen dan deskription
	const detilTitleElements = document.getElementsByClassName('section-detil-title')
	const detilDescrElements = document.getElementsByClassName('section-detil-descr')
	for (let el of detilTitleElements) {
		el.innerHTML = data.jurnal_doc
	}
	for (let el of detilDescrElements) {
		el.innerHTML = data.jurnal_descr
	}
}


export function jurnalDetilEdit_formOpened(self, frm, CurrentState) {
	const agingtype_id = frm.Inputs['jurnalDetilEdit-obj_agingtype_id'].value

	agingtype_changed(frm, agingtype_id)

	const obj_jurnaldetil_ishead = frm.Inputs['jurnalDetilEdit-obj_jurnaldetil_ishead']

	CurrentState.Actions.edit.suspend(obj_jurnaldetil_ishead.value===true)

	obj.btnPayable.suspend(true)
	obj.btnReceivable.suspend(true)
}

export async function jurnalDetilEdit_newData(self, datainit, frm, CurrentState) {
	const headerForm = CurrentState.getHeaderForm()
	const headerData = headerForm.getData()
	
	// nantinya bisa dimunculkan dialog, jika account is aging

	// set data init
	datainit.jurnaltype_id = headerData.jurnaltype_id

	CurrentState.Actions.edit.suspend(false)

	agingtype_changed(frm, null)

	obj.btnPayable.suspend(false)
	obj.btnReceivable.suspend(false)
	
}


export async function jurnalDetilEdit_dataSaved(self, data, frm) {
	obj.btnPayable.suspend(true)
	obj.btnReceivable.suspend(true)


	console.log(data)
	updateTotalIdr(data.total_idr)
}


export function obj_coa_id_selecting_criteria(self, obj_coa_id, frm, criteria, sort, evt) {
	evt.detail.url = 'coa-filtered/list-by-jurnaltype'

	const jurnaltype_id = frm.Inputs['jurnalDetilEdit-obj_jurnaltype_id'].value

	criteria.jurnaltype_id = jurnaltype_id
	criteria.coa_isdisabled = false
}


export async function obj_coa_id_selected(self, obj_coa_id, frm, evt) {
	console.log(evt.detail.data)

	const { curr_id, agingtype_id, coa_iscurradj, isdebet, iskredit} = evt.detail.data
	frm.Inputs['jurnalDetilEdit-obj_coacurr'].value = curr_id
	frm.Inputs['jurnalDetilEdit-obj_agingtype_id'].value = agingtype_id
	frm.Inputs['jurnalDetilEdit-obj_isdebet'].value = isdebet
	frm.Inputs['jurnalDetilEdit-obj_iskredit'].value = iskredit
	frm.Inputs['jurnalDetilEdit-obj_iscurradj'].value = coa_iscurradj

	frm.Inputs['jurnalDetilEdit-obj_curr_id'].clear()
	if (curr_id!=null) {
		if (frm.Inputs['jurnalDetilEdit-obj_curr_id'].value != curr_id) {
			frm.Inputs['jurnalDetilEdit-obj_curr_id'].setSelected(null, '')
		}
	}


	agingtype_changed(frm, agingtype_id)
}


export async function obj_curr_id_populating(self, obj_curr_id, frm, evt) {
	const { tr, data, text } = evt.detail

	const td = tr.querySelector('td')
	td.style.display = 'flex'
	td.style.justifyContent = 'space-between';
	td.style.paddingRight = '10px'

	const divCode = document.createElement('div')
	divCode.innerHTML = text

	const divRate = document.createElement('div')
	divRate.innerHTML = formatNumber(data.curr_rate)

	td.innerHTML = ''
	td.appendChild(divCode)
	td.appendChild(divRate)
}

export function obj_curr_id_selecting_criteria(self, obj_curr_id, frm, criteria, sort, evt) {
	console.log('set criteria')
	const headerForm = evt.detail.CurrentState.getHeaderForm()
	const headerData = headerForm.getData() 

	const curr_id = frm.Inputs['jurnalDetilEdit-obj_coacurr'].value
	const bookdate = headerData.jurnal_date
	criteria.curr_date = bookdate


	console.log('CURR',  curr_id)


	if (curr_id!='') {
		criteria.curr_id =  curr_id
		const coa_iscurradj = frm.Inputs['jurnalDetilEdit-obj_iscurradj'].value
		if (coa_iscurradj) {
			criteria.coa_iscurradj = true
		}
	}

	sort.curr_code = 'asc' 
}


export async function obj_curr_id_selected(self, obj_curr_id, frm, evt) {
	const { data } = evt.detail

	frm.Inputs['jurnalDetilEdit-obj_curr_rate'].value = data.curr_rate
	recalculateCurrency(self, frm)
}

export async function obj_jurnaldetil_value_changed(self, obj_jurnaldetil_value, frm, evt) {
	recalculateCurrency(self, frm)
}


export async function obj_curr_rate_changed(self, obj_curr_rate, frm, evt) {
	recalculateCurrency(self, frm)
}




export function jurnalDetilEdit_formLocked(self, frm, CurrentState) {
	if (obj.btnPayable!=null) {
		obj.btnPayable.disabled = true
	}

	if (obj.btnReceivable) {
		obj.btnReceivable.disabled = true
	}
}


export function jurnalDetilEdit_formUnlocked(self, frm, CurrentState) {
	if (obj.btnPayable!=null) {
		obj.btnPayable.disabled = false
	}

	if (obj.btnReceivable) {
		obj.btnReceivable.disabled = false
	}
}


export async function outstandingSelected(self, data, evt) {
	console.log(data)





	const frm = self.Modules.jurnalDetilEdit.getForm()

	const obj_jurnaldetil_descr = frm.Inputs['jurnalDetilEdit-obj_jurnaldetil_descr']
	const obj_coa_id = frm.Inputs['jurnalDetilEdit-obj_coa_id']
	const obj_partner_id = frm.Inputs['jurnalDetilEdit-obj_partner_id']
	const obj_dept_id = frm.Inputs['jurnalDetilEdit-obj_dept_id']
	const obj_site_id = frm.Inputs['jurnalDetilEdit-obj_site_id']
	const obj_unit_id = frm.Inputs['jurnalDetilEdit-obj_unit_id']
	const obj_project_id = frm.Inputs['jurnalDetilEdit-obj_project_id']
	const obj_curr_id = frm.Inputs['jurnalDetilEdit-obj_curr_id']
	const obj_jurnaldetil_value = frm.Inputs['jurnalDetilEdit-obj_jurnaldetil_value']
	const obj_curr_rate = frm.Inputs['jurnalDetilEdit-obj_curr_rate']
	const obj_jurnaldetil_idr = frm.Inputs['jurnalDetilEdit-obj_jurnaldetil_idr']
	const obj_jurnaldetil_id_ref = frm.Inputs['jurnalDetilEdit-obj_jurnaldetil_id_ref']
	const obj_agingtype_id = frm.Inputs['jurnalDetilEdit-obj_agingtype_id']

	const idrChanged = obj_jurnaldetil_idr.value != -Number(data.jurnaldetil_idr)
	const valueChanged = obj_jurnaldetil_value.value != -Number(data.jurnaldetil_value)
	const refChanged = obj_jurnaldetil_id_ref.value != data.jurnaldetil_id


	// kalau masih kosong langsing terima aja, kalau sudah ada isinya, tanya dulu kalau berubah
	if (obj_jurnaldetil_id_ref.value!='') {
		if (idrChanged || valueChanged || refChanged ) {
			// user pilih data lagi, sedangkan pilihan sebelumnya sudah dilakukan / diubah
			const ret = await $fgta5.MessageBox.confirm('anda sudah membuat perubahan data sebelumnya, apakah akan ditimpa?')
			if (ret=='cancel') {
				evt.detail.cancelSelect = true 
				return
			}
		}
	}


	obj_coa_id.setSelected(data.coa_id, data.coa_name)
	obj_coa_id.suspend(true)
	
	obj_partner_id.setSelected(data.partner_id, data.partner_name)
	obj_partner_id.suspend(true)

	obj_dept_id.setSelected(data.dept_id, data.dept_name)
	obj_dept_id.suspend(true)

	obj_site_id.setSelected(data.site_id, data.site_name)
	obj_site_id.suspend(true)

	obj_unit_id.setSelected(data.unit_id, data.unit_name)
	obj_unit_id.suspend(true)

	obj_project_id.setSelected(data.project_id, data.project_name)
	obj_project_id.suspend(true)

	obj_curr_id.setSelected(data.curr_id, data.curr_code)
	obj_curr_id.suspend(true)

	obj_curr_rate.value = data.curr_rate
	obj_curr_rate.suspend(true)

	obj_jurnaldetil_descr.value = data.jurnaldetil_descr
	obj_jurnaldetil_descr.suspend(true)

	obj_jurnaldetil_value.value = -data.jurnaldetil_value
	obj_jurnaldetil_idr.value = -data.jurnaldetil_idr

	obj_jurnaldetil_id_ref.value = data.jurnaldetil_id
	obj_agingtype_id.value = data.agingtype_id

}


function updateTotalIdr(value) {
	const total = formatNumber(value)

	const infoDetilRow = document.getElementById('jurnalHeaderEdit-info-detil-row')
	const totalIdrDiv = infoDetilRow.querySelector('[data-info]')
	totalIdrDiv.innerHTML = total

	const tblDetil = document.getElementById('jurnalDetilList-tbl')
	const totalIdrCell = tblDetil.querySelector('tfoot [data-name="jurnaldetil_idr"]')
	totalIdrCell.innerHTML = total

	const txtBalance =  document.getElementById('jurnalDetilEdit-balance_idr')
	txtBalance.innerHTML = total
}


export async function jurnalDetilEdit_dataSaving(self, dataToSave, frm, args) {
	// cek apabila account aging
	const obj_agingtype_id = frm.Inputs['jurnalDetilEdit-obj_agingtype_id']
	const obj_jurnaldetil_id_ref = frm.Inputs['jurnalDetilEdit-obj_jurnaldetil_id_ref']
	const obj_jurnaldetil_idr = frm.Inputs['jurnalDetilEdit-obj_jurnaldetil_idr']


	if (obj_jurnaldetil_idr.value==0) {
		await $fgta5.MessageBox.warning('value tidak boleh diisi 0')
		args.cancelSave = true
	}


	let agingIncorect = false
	let message
	if (obj_agingtype_id.value=='1') {
		// aging AR, jika nilai idr < 0, harus ada reference
		agingIncorect = obj_jurnaldetil_idr.value<0 &&  obj_jurnaldetil_id_ref.value==''
		message = 'account AR pada posisi kredit harus mempunyai reference'
	} else if (obj_agingtype_id.value=='2'){
		// aging AP, jika nilai idr > 0, harus ada reference
		agingIncorect = obj_jurnaldetil_idr.value>0 &&  obj_jurnaldetil_id_ref.value==''
		message = 'account AP pada posisi debet harus mempunyai reference'
	}


	if (agingIncorect) {
		await $fgta5.MessageBox.warning(message)
		args.cancelSave = true
	}

}