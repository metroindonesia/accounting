import Context from './jurnal-context.mjs'

const elPostby = document.getElementById('fRecord-section-postby')
const elPostdate = document.getElementById('fRecord-section-postdate')



const obj = {}

export function init_header(self, args)  {
	obj.btnPayable = args.btnPayable
	obj.btnReceivable = args.btnReceivable
	obj.ICON_UNBALANCE = args.ICON_UNBALANCE
}


export function headerList_initSearchParams(self, SearchParams) {
	
	// periode
	SearchParams['periode_id'].addEventListener('selecting', async (evt)=>{
		const cbo = evt.detail.sender
		const dialog = evt.detail.dialog
		const url = 'periode/header-list'
		const sort = { periode_id: 'desc' }
		const criteria = {}

		cbo.wait()
		try {
			const result = await Module.apiCall(url, {
				sort,
				criteria,
				offset: evt.detail.offset,
				limit: evt.detail.limit,
			}) 

			for (var row of result.data) {
				evt.detail.addRow(row.periode_id, row.periode_name, row)
			}

			dialog.setNext(result.nextoffset, result.limit)
		} catch (err) {
			$fgta5.MessageBox.error(err.message)
		} finally {
			cbo.wait(false)
		}

	})


	// jurnaltype
	SearchParams['jurnaltype_id'].addEventListener('selecting', async (evt)=>{
		const cbo = evt.detail.sender
		const dialog = evt.detail.dialog
		const url = 'jurnaltype/header-list'
		const sort = { jurnaltype_name: 'asc' }
		const criteria = {}

		cbo.wait()
		try {
			const result = await Module.apiCall(url, {
				sort,
				criteria,
				offset: evt.detail.offset,
				limit: evt.detail.limit,
			}) 

			for (var row of result.data) {
				evt.detail.addRow(row.jurnaltype_id, row.jurnaltype_name, row)
			}

			dialog.setNext(result.nextoffset, result.limit)
		} catch (err) {
			$fgta5.MessageBox.error(err.message)
		} finally {
			cbo.wait(false)
		}

	})


	// post status
	SearchParams['postedstatus_id'].addEventListener('selecting', async (evt)=>{
		const cbo = evt.detail.sender
		const dialog = evt.detail.dialog

		cbo.wait()
		try {
			const rows = [
				{postedstatus_id: 'POSTED', postedstatus_name:'Posted'},
				{postedstatus_id: 'UNPOSTED', postedstatus_name:'Unposted'},
			]	
			for (var row of rows) {
				evt.detail.addRow(row.postedstatus_id, row.postedstatus_name, row)
			}
		} catch (err) {
			$fgta5.MessageBox.error(err.message)
		} finally {
			cbo.wait(false)
		}

	})	
}

export function setupActionButtonEvent(self, frm, CurrentState, buttons) {
	buttons.btn_actionPost.hide()
	buttons.btn_actionUnpost.hide()

	buttons.btn_actionPost.addEventListener('click', (evt)=>{ btn_actionPost_click(self, frm, buttons, evt) })
	buttons.btn_actionUnpost.addEventListener('click', (evt)=>{ btn_actionUnpost_click(self, frm, buttons, evt) })
	buttons.btn_actionPrint.addEventListener('click', (evt)=>{ btn_actionPrint_click(self, frm, buttons, evt) })
}

function formatNumber(num) {
  return new Intl.NumberFormat("en-EN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
}

async function btn_actionPost_click(self, frm, buttons, evt) {
	const { jurnal_id, jurnal_doc } = frm.getData();

	jurnalPost(self, frm, buttons, true, jurnal_id, jurnal_doc)
}

async function btn_actionUnpost_click(self, frm, buttons, evt) {
	const { jurnal_id, jurnal_doc } = frm.getData();
	const resp = await $fgta5.MessageBox.confirm(`Apakah anda yakin akan UNPOST jurnal '${jurnal_doc}'`)
	if (resp!='ok') {
		return
	}
	jurnalPost(self, frm, buttons, false, jurnal_id, jurnal_doc)
}

async function btn_actionPrint_click(self, frm, buttons, evt) {
	console.log('print')
}

async function jurnalPost(self, frm, buttons, isposting, jurnal_id, jurnal_doc) {
	let mask = $fgta5.Modal.createMask()

	try {

		const url = 'jurnal-action/posting'
		const param = {
			jurnal_id,
			isposting
		}

		const { success, postby, postdate, message } = await Module.apiCall(url, param)
		if (!success) {
			throw new Error(message)
		}

		// set postby dan postdate
		elPostby.innerHTML = postby
		elPostdate.innerHTML = postdate

		// update checkbox post
		frm.Inputs['jurnalHeaderEdit-obj_ispost'].value = isposting
		frm.acceptChanges()


		if (isposting) {
			// matikan tombol posting, nyalakan tombol unposting
			buttons.btn_actionPost.disabled = true
			buttons.btn_actionUnpost.disabled = false
			$fgta5.MessageBox.info(`Jurnal ${jurnal_doc} berhasil di posting`)
		} else {
			// kealikannya
			buttons.btn_actionPost.disabled = false
			buttons.btn_actionUnpost.disabled = true
			$fgta5.MessageBox.info(`Jurnal ${jurnal_doc} berhasil di un-posting`)
		}


		// update header
		self.Modules.jurnalHeaderList.updateCurrentRow(self, { ispost: isposting })

	} catch (err) {
		console.error(err)
		$fgta5.MessageBox.error(err.message)
	} finally {
		mask.close()
		mask = null
	}
}


function recalculateCurrency(self, frm) {
	const rate = frm.Inputs['jurnalHeaderEdit-obj_curr_rate'].value
	const value = frm.Inputs['jurnalHeaderEdit-obj_jurnal_value'].value
	const idr = value * rate
	
	frm.Inputs['jurnalHeaderEdit-obj_jurnal_idr'].value = idr
}


export function headerList_dataLoad(self, criteria, sort, evt) {
	sort.jurnal_date = 'desc'
}


export function obj_jurnaltype_id_selecting_criteria(self, obj_jurnaltype_id, frm, criteria, sort, evt) {
	evt.detail.url = 'jurnaltype-filtered/list-by-user'

	sort.jurnaltype_name = 'asc' 
	criteria.jurnaltype_isallowselect = true
}

export function obj_periode_id_selecting_criteria(self, obj_periode_id, frm, criteria, sort, evt) {
	criteria.periode_isclosed = false
	criteria.periode_isactive = true
	sort.periode_id = 'desc' 
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
	const curr_id = frm.Inputs['jurnalHeaderEdit-obj_coacurr'].value
	const bookdate = frm.Inputs['jurnalHeaderEdit-obj_jurnal_date'].value
	criteria.curr_date = bookdate

	if (curr_id!='') {
		criteria.curr_id =  curr_id
	}

	sort.curr_code = 'asc' 
}

export async function obj_curr_id_selected(self, obj_curr_id, frm, evt) {
	const { data } = evt.detail

	frm.Inputs['jurnalHeaderEdit-obj_curr_rate'].value = data.curr_rate

	recalculateCurrency(self, frm)
}

export async function obj_jurnal_value_changed(self, obj_jurnal_value, frm, evt) {
	console.log('value changed')
	recalculateCurrency(self, frm)
}

export async function obj_curr_rate_changed(self, obj_curr_rate, frm, evt) {
	console.log('rate changed')
	recalculateCurrency(self, frm)
}

export function obj_coa_id_selecting_criteria(self, obj_coa_id, frm, criteria, sort, evt) {
	evt.detail.url = 'coa-filtered/list-by-jurnaltype'

	const jurnaltype_id = frm.Inputs['jurnalHeaderEdit-obj_jurnaltype_id'].value
	const copyto = frm.Inputs['jurnalHeaderEdit-obj_copyto'].value

	criteria.jurnaltype_id = jurnaltype_id
	criteria.coa_isdisabled = false
	criteria.isdebet = copyto=='D' 
	criteria.iskredit = copyto=='K'

}

export async function obj_coa_id_selected(self, obj_coa_id, frm, evt) {
	const { curr_id } = evt.detail.data
	frm.Inputs['jurnalHeaderEdit-obj_coacurr'].value = curr_id

	frm.Inputs['jurnalHeaderEdit-obj_curr_id'].clear()
	if (curr_id!=null) {
		if (frm.Inputs['jurnalHeaderEdit-obj_curr_id'].value != curr_id) {
			frm.Inputs['jurnalHeaderEdit-obj_curr_id'].setSelected(null, '')
		}
	}
}


export function obj_unit_id_selecting_criteria(self, obj_unit_id, frm, criteria, sort, evt) {
	criteria.unit_isdisabled = false
	sort.unit_name = 'asc'
}

export function obj_site_id_selecting_criteria(self, obj_site_id, frm, criteria, sort, evt) {
	criteria.site_isdisabled = false
	sort.site_name = 'asc'
}

export function obj_dept_id_selecting_criteria(self, obj_dept_id, frm, criteria, sort, evt) {
	criteria.dept_isdisabled = false
	sort.dept_name = 'asc'
}

export function obj_partner_id_selecting_criteria(self, obj_partner_id, frm, criteria, sort, evt) {
	criteria.partner_isdisabled = false
	sort.partner_name
}

export function obj_project_id_selecting_criteria(self, obj_project_id, frm, criteria, sort, evt) {
	sort.project_name = 'asc'
}



function setVisibility(el_name, visible) {
	const el = document.getElementById(el_name)
	if (el==null) {
		return
	}

	if (visible==true) {
		el.classList.remove('hidden')
	} else {
		el.classList.add('hidden')
	}

}






function jurnaltype_changed(jurnaltype, frm) {
	if (jurnaltype==null) {
		jurnaltype = {}
	} 

	setVisibility('jurnalHeaderEdit-obj_paymtype_id-container', jurnaltype.isheadhaspaymtype)
	setVisibility('jurnalHeaderEdit-obj_paymreqterm_id-container', jurnaltype.isheadhaspaymreq)
	setVisibility('jurnalHeaderEdit-obj_coa_id-container', jurnaltype.isheadhascoa)
	setVisibility('jurnalHeaderEdit-obj_dept_id-container', jurnaltype.isheadhasdept)
	setVisibility('jurnalHeaderEdit-obj_partner_id-container', jurnaltype.isheadhaspartner)
	setVisibility('jurnalHeaderEdit-obj_project_id-container', jurnaltype.isheadhasproject)
	setVisibility('jurnalHeaderEdit-obj_site_id-container', jurnaltype.isheadhassite)
	setVisibility('jurnalHeaderEdit-obj_unit_id-container', jurnaltype.isheadhasunit)
	setVisibility('jurnalHeaderEdit-obj_jurnal_idr-container', jurnaltype.isheadhasvalue)
	setVisibility('jurnalHeaderEdit-obj_curr_rate-container', jurnaltype.isheadhasvalue)
	setVisibility('jurnalHeaderEdit-obj_jurnal_value-container', jurnaltype.isheadhasvalue)
	setVisibility('jurnalHeaderEdit-obj_curr_id-container', jurnaltype.isheadhasvalue)
	setVisibility('jurnalHeaderEdit-obj_jurnal_datedue-container', jurnaltype.isheadhasduedate)

	const blockDivValue = document.getElementById('jurnalHeaderEdit-div_value')
	if (jurnaltype.isheadhasvalue) {
		blockDivValue.classList.remove('hidden')
	} else {
		blockDivValue.classList.add('hidden')
	}

	
	// set mandatofy field
	frm.Inputs['jurnalHeaderEdit-obj_partner_id'].markAsRequired(jurnaltype.isheadhaspartner)
	frm.Inputs['jurnalHeaderEdit-obj_coa_id'].markAsRequired(jurnaltype.isheadhascoa)
	frm.Inputs['jurnalHeaderEdit-obj_paymtype_id'].markAsRequired(jurnaltype.isheadhaspaymtype)
	frm.Inputs['jurnalHeaderEdit-obj_curr_id'].markAsRequired(jurnaltype.isheadhasvalue)

	obj.btnPayable.hide(!jurnaltype.isdetilallowgetap)
	obj.btnReceivable.hide(!jurnaltype.isdetilallowgetar)
}



function paymtype_changed(paymtype, frm) {
	if (paymtype==null) {
		paymtype = {}
	}

	setVisibility('jurnalHeaderEdit-obj_partnercontact_id-container', paymtype.ishaspartnercontact)
	setVisibility('jurnalHeaderEdit-obj_partnerbank_id-container', paymtype.ishaspartnerbankselector)
	setVisibility('jurnalHeaderEdit-obj_payment_bgno-container', paymtype.ishasgiro)
	setVisibility('jurnalHeaderEdit-obj_partnerbank_account-container', paymtype.ishasbankaccount)
	setVisibility('jurnalHeaderEdit-obj_partnerbank_accountname-container', paymtype.ishasbankaccountname)
	setVisibility('jurnalHeaderEdit-obj_partnerbank_bankname-container', paymtype.ishasbankname)

	// setmandatory field
	frm.Inputs['jurnalHeaderEdit-obj_partnerbank_id'].markAsRequired(paymtype.ishaspartnerbankselector)	
	frm.Inputs['jurnalHeaderEdit-obj_payment_bgno'].markAsRequired(paymtype.ishasgiro)	
	frm.Inputs['jurnalHeaderEdit-obj_partnerbank_account'].markAsRequired(paymtype.ishasbankaccount)	
	frm.Inputs['jurnalHeaderEdit-obj_partnerbank_accountname'].markAsRequired(paymtype.ishasbankaccountname)	
	frm.Inputs['jurnalHeaderEdit-obj_partnerbank_bankname'].markAsRequired(paymtype.ishasbankname)	

}


export async function obj_jurnaltype_id_selected(self, obj_jurnaltype_id, frm, evt) {
	if (!obj_jurnaltype_id.isSelectedChanged()) {
		return
	}

	const jurnaltype = evt.detail.data
	jurnaltype_changed(jurnaltype, frm)
	paymtype_changed(null, frm)
	
	frm.Inputs['jurnalHeaderEdit-obj_paymtype_id'].clear()
	frm.Inputs['jurnalHeaderEdit-obj_paymtype_id'].setSelected(null, '')
	frm.Inputs['jurnalHeaderEdit-obj_copyto'].value = jurnaltype.jurnaltype_headcopyto

	frm.Inputs['jurnalHeaderEdit-obj_coa_id'].clear()
	frm.Inputs['jurnalHeaderEdit-obj_coa_id'].setSelected(null, '')

	frm.Inputs['jurnalHeaderEdit-obj_curr_id'].clear()
	frm.Inputs['jurnalHeaderEdit-obj_curr_id'].setSelected(null, '')




	const CurrentState = evt.detail.CurrentState
	const {isallowposting=false, isallowunposting=false} = jurnaltype

	CurrentState.Actions.post.hide(!isallowposting)
	CurrentState.Actions.unpost.hide(!isallowunposting)

}

export async function obj_paymtype_id_selected(self, obj_paymtype_id, frm, evt) {
	if (!obj_paymtype_id.isSelectedChanged()) {
		return
	}

	const paymtype = evt.detail.data
	paymtype_changed(paymtype, frm)
}





export function obj_partnercontact_id_selecting_criteria(self, obj_partnercontact_id, frm, criteria, sort, evt) {
	const partner_id = frm.Inputs['jurnalHeaderEdit-obj_partner_id'].value
	criteria.partnercontact_isdisabled = false
	criteria.partner_id = partner_id ?? 0
	sort.partnercontact_name = 'asc'

}

export function obj_partnerbank_id_selecting_criteria(self, obj_partnerbank_id, frm, criteria, sort, evt) {
	const partner_id = frm.Inputs['jurnalHeaderEdit-obj_partner_id'].value
	criteria.partnerbank_isdisabled = false
	criteria.partner_id = partner_id ?? 0
	sort.partnerbank_name = 'asc'
}

export async function obj_partnerbank_id_selected(self, obj_partnerbank_id, frm, evt) {
	if (!obj_partnerbank_id.isSelectedChanged()) {
		return
	}

	const {partnerbank_account, partnerbank_accountname, partnerbank_bankname} = evt.detail.data
	frm.Inputs['jurnalHeaderEdit-obj_partnerbank_account'].value = partnerbank_account
	frm.Inputs['jurnalHeaderEdit-obj_partnerbank_accountname'].value = partnerbank_accountname
	frm.Inputs['jurnalHeaderEdit-obj_partnerbank_bankname'].value = partnerbank_bankname

}

export async function obj_partner_id_selected(self, obj_partner_id, frm, evt) {
	if (!obj_partner_id.isSelectedChanged()) {
		return
	}

	frm.Inputs['jurnalHeaderEdit-obj_partnerbank_id'].clear()
	frm.Inputs['jurnalHeaderEdit-obj_partnerbank_id'].setSelected(null)
	frm.Inputs['jurnalHeaderEdit-obj_partnerbank_account'].value = ""
	frm.Inputs['jurnalHeaderEdit-obj_partnerbank_accountname'].value = ""
	frm.Inputs['jurnalHeaderEdit-obj_partnerbank_bankname'].value = ""	

	frm.Inputs['jurnalHeaderEdit-obj_partnercontact_id'].clear()
	frm.Inputs['jurnalHeaderEdit-obj_partnercontact_id'].setSelected(null)
}


export async function jurnalHeaderEdit_formOpened(self, frm, CurrentState) {
	frm.Inputs['jurnalHeaderEdit-obj_jurnaltype_id'].disabled = true
	
	const {
		jurnaltype, paymtype, periode_isclosed, ispost, jurnal_source, 
		_postby, _postdate, 
		isallowposting, isallowunposting, 
		total_value, total_idr
	} = frm.getOriginalData()


	jurnaltype_changed(jurnaltype, frm)
	paymtype_changed(paymtype, frm)


	let locked = periode_isclosed || ispost || jurnal_source!=Context.sourceName 
	if (locked) {
		// matikan button edit
		CurrentState.Actions.edit.disabled = true
	} else {
		// nyalakan button edit
		CurrentState.Actions.edit.disabled = false
	}	
	

	// set tombol posting, unposting
	if (periode_isclosed) {
		CurrentState.Actions.post.disabled = true 
		CurrentState.Actions.unpost.disabled = true
	} else if (ispost) {
		CurrentState.Actions.post.disabled = true 
		CurrentState.Actions.unpost.disabled = false
	} else {
		CurrentState.Actions.post.disabled = false 
		CurrentState.Actions.unpost.disabled = true
	}

	// pakah user boleh melakukan posting/unposting
	CurrentState.Actions.post.hide(!isallowposting)
	CurrentState.Actions.unpost.hide(!isallowunposting)


	// total value dan idr
	updateTotalIdr(total_idr)


	// set record info
	elPostby.innerHTML = _postby
	elPostdate.innerHTML = _postdate

}

export async function jurnalHeaderEdit_dataSaved(self, data, frm) {
	frm.Inputs['jurnalHeaderEdit-obj_jurnaltype_id'].disabled = true

	// total value dan idr
	updateTotalIdr(data.total_idr)
}

export async function jurnalHeaderEdit_newData(self, datainit, frm) {
	datainit.jurnal_source = Context.sourceName
	
	frm.Inputs['jurnalHeaderEdit-obj_jurnaltype_id'].disabled = false
	jurnaltype_changed(null, frm)
	paymtype_changed(null, frm)

		// total value dan idr
	updateTotalIdr(0)

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

