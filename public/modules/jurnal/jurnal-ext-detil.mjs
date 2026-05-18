import Context from './jurnal-context.mjs'
import * as jurnalHelper from './jurnal-helper.mjs'
import * as pageHelper from '/public/lib/webmodule/pagehelper.mjs'
import outstandingDialog from './jurnal-outstandingdialog.mjs'


const _coa_id = 'jurnalDetilEdit-obj_coa_id'
const _jurnaldetil_id = 'jurnalDetilEdit-obj_jurnaldetil_id'
const _jurnaldetil_descr = 'jurnalDetilEdit-obj_jurnaldetil_descr'
const _partner_id = 'jurnalDetilEdit-obj_partner_id'
const _struct_id = 'jurnalDetilEdit-obj_struct_id'
const _site_id = 'jurnalDetilEdit-obj_site_id'
const _unit_id = 'jurnalDetilEdit-obj_unit_id'
const _project_id = 'jurnalDetilEdit-obj_project_id'
const _curr_id = 'jurnalDetilEdit-obj_curr_id'
const _jurnaldetil_value = 'jurnalDetilEdit-obj_jurnaldetil_value'
const _curr_rate = 'jurnalDetilEdit-obj_curr_rate'
const _jurnaldetil_idr = 'jurnalDetilEdit-obj_jurnaldetil_idr'
const _jurnaltype_id = 'jurnalDetilEdit-obj_jurnaltype_id'
const _jurnaldetil_id_ref = 'jurnalDetilEdit-obj_jurnaldetil_id_ref'
const _coacurr = 'jurnalDetilEdit-obj_coacurr'
const _jurnaldetil_ishead = 'jurnalDetilEdit-obj_jurnaldetil_ishead'
const _agingtype_id = 'jurnalDetilEdit-obj_agingtype_id'
const _paymreq_id = 'jurnalDetilEdit-obj_paymreq_id'
const _isdebet = 'jurnalDetilEdit-obj_isdebet'
const _iskredit = 'jurnalDetilEdit-obj_iskredit'
const _iscurradj = 'jurnalDetilEdit-obj_iscurradj'
const _ismanuallink = 'jurnalDetilEdit-obj_ismanuallink'
const _jurnal_id = 'jurnalDetilEdit-obj_jurnal_id'


const refButtons = {}

export async function init_detil(self, args) {
	const formEl = document.getElementById('jurnalDetilEdit-frm')

	// tambahkan box information
	const divInfo = document.createElement('div')
	divInfo.classList.add('detil-info')
	formEl.prepend(divInfo)



	// tombol get outstanding pada form detil
	{
		const target = document.getElementById('jurnalDetilEdit-head')
		const tpl = document.getElementById('tpl-get-outstd-buttons')
		if (tpl != null) {

			const clone = tpl.content.cloneNode(true); // salin isi template
			const divButton = clone.querySelector('div')
			target.insertAdjacentElement('afterend', divButton);

			const dlg = new outstandingDialog()
			dlg.addEventListener('selected', async evt => {
				await outstandingSelected(self, evt.detail.data, evt)
				if (evt.detail.cancelSelect) {
					return
				}
				dlg.close()
			})

			refButtons.payable = new $fgta5.ActionButton('btn_getPayable')
			refButtons.receivable = new $fgta5.ActionButton('btn_getReceivable')

			refButtons.payable.addEventListener('click', (evt) => { btn_getPayable_click(self, dlg, evt) })
			refButtons.receivable.addEventListener('click', (evt) => { btn_getReceivable_click(self, dlg, evt) })
		}
	}

	// tambahkan total di list detil table
	{
		const tpl = document.getElementById('tpl-detil-tfoot')
		const target = document.getElementById('jurnalDetilList-tbl')
		if (tpl != null) {
			const clone = tpl.content.cloneNode(true); // salin isi template
			const tfoot = clone.querySelector('tfoot')
			target.appendChild(tfoot)
		}
	}


	// tambahkan current balance di form
	{
		const target = document.getElementById('jurnalDetilEdit-frm')
		const tpl = document.getElementById('tpl-detil-balance')
		if (tpl != null) {
			const clone = tpl.content.cloneNode(true); // salin isi template
			const divBalance = clone.querySelector('div')
			const balInfo = clone.querySelector('.formdetil-current-balance');
			balInfo.id = 'formdetil-current-balance' // beri nama container balance info
			target.appendChild(divBalance)
		}
	}

	// divBalance.id = 'balance-info-container'
	// divBalance.
}


export function headerJurnaltype_changed(self, jurnaltype, headerFrm) {
	self.currentJurnaltype = jurnaltype

	refButtons.payable.hide(!jurnaltype.isdetilallowgetap)
	refButtons.receivable.hide(!jurnaltype.isdetilallowgetar)


	// setup sub account
	const jurnalDetilEdit = self.Modules.jurnalDetilEdit
	const frm = jurnalDetilEdit.getForm()


	jurnaltype_changed(self, jurnaltype, frm)


}

export async function jurnalDetilList_tableDataLoaded(self, tbl, result) {
	updateBalance(self, result.balance_value, result.balance_idr)
}

export function jurnalDetilList_addTableEvents(self, tbl) {
	tbl.addEventListener('rowrender', (evt) => {
		const tr = evt.detail.tr
		const data = evt.detail.args.data


		if (data.jurnaldetil_idr !== undefined) {
			const jurnaldetil_idr = data.jurnaldetil_idr
			const tdCoa = tr.querySelector('[data-name="coa_name"]')
			if (jurnaldetil_idr >= 0) {
				tdCoa.classList.remove('jurnaldetillist-kredit')
			} else {
				tdCoa.classList.add('jurnaldetillist-kredit')
			}
		}


	})
}


export async function jurnalDetilEdit_newData(self, datainit, frm, CurrentState) {
	const jurnaltype = self.currentJurnaltype
	jurnaltype_changed(self, jurnaltype, frm)
	suspendReferencedEditor(self, frm, false)


	const jurnalHeaderEdit = self.Modules.jurnalHeaderEdit
	const frmHeader = jurnalHeaderEdit.getForm()

	const header_obj_curr_id = frmHeader.Inputs['jurnalHeaderEdit-obj_curr_id']
	const header_curr_id = header_obj_curr_id.value
	const header_curr_name = header_obj_curr_id.text

	const header_obj_partner_id = frmHeader.Inputs['jurnalHeaderEdit-obj_partner_id']
	const header_partner_id = header_obj_partner_id.value
	const header_partner_name = header_obj_partner_id.text

	const header_obj_site_id = frmHeader.Inputs['jurnalHeaderEdit-obj_site_id']
	const header_site_id = header_obj_site_id.value
	const header_site_name = header_obj_site_id.text

	const header_obj_unit_id = frmHeader.Inputs['jurnalHeaderEdit-obj_unit_id']
	const header_unit_id = header_obj_unit_id.value
	const header_unit_name = header_obj_unit_id.text

	const header_obj_struct_id = frmHeader.Inputs['jurnalHeaderEdit-obj_struct_id']
	const header_struct_id = header_obj_struct_id.value
	const header_struct_name = header_obj_struct_id.text

	const header_obj_project_id = frmHeader.Inputs['jurnalHeaderEdit-obj_project_id']
	const header_project_id = header_obj_project_id.value
	const header_project_name = header_obj_project_id.text

	const header_obj_jurnal_descr = frmHeader.Inputs['jurnalHeaderEdit-obj_jurnal_descr']
	const header_jurnal_descr = header_obj_jurnal_descr.value


	// set default data saat new
	datainit.jurnaltype_id = jurnaltype.jurnaltype_id
	datainit.curr_id = { value: header_curr_id, text: header_curr_name }
	datainit.partner_id = { value: header_partner_id, text: header_partner_name }
	datainit.site_id = { value: header_site_id, text: header_site_name }
	datainit.unit_id = { value: header_unit_id, text: header_unit_name }
	datainit.struct_id = { value: header_struct_id, text: header_struct_name }
	datainit.project_id = { value: header_project_id, text: header_project_name }
	datainit.jurnaldetil_descr = header_jurnal_descr

}

export async function jurnalDetilEdit_formOpened(self, frm, CurrentState) {
	const jurnaltype = self.currentJurnaltype
	const { coa } = frm.getOriginalData()

	jurnaltype_changed(self, jurnaltype, frm)
	coa_changed(self, coa, frm)

	const obj_jurnaldetil_id_ref = frm.Inputs[_jurnaldetil_id_ref]
	if (obj_jurnaldetil_id_ref.value != '') {
		suspendReferencedEditor(self, frm)
	} else {
		suspendReferencedEditor(self, frm, false)
	}

	const obj_iscurradj = frm.Inputs[_iscurradj]
	iscurradj_changed(self, obj_iscurradj.value, frm)


	const ishead = frm.Inputs[_jurnaldetil_ishead].value
	CurrentState.Actions.edit.suspend(ishead)

}

export async function jurnalDetilEdit_dataSaving(self, dataToSave, frm, args) {
	// cek posisi debet/kredit
	const isdebet = frm.Inputs[_isdebet].value
	const iskredit = frm.Inputs[_iskredit].value
	const jurnaldetil_idr = frm.Inputs[_jurnaldetil_idr].value
	const jurnaldetil_value = frm.Inputs[_jurnaldetil_value].value


	try {
		// cek mata uang
		const curr_id = frm.Inputs[_curr_id].value
		const coacur = frm.Inputs[_coacurr].value
		if (coacur != '') {
			if (curr_id != coacur) {
				throw new Error('currency tidak sesuai dengan account yang dipilih')
			}
		}


		// cek posisi debet - kredit
		if (isdebet != iskredit) {
			// perlu cek debet kredit
			if (isdebet) {
				if (jurnaldetil_value < 0 || jurnaldetil_idr < 0) {
					throw new Error('akun ditandai dengan debet, posisi value ada di kredit')
				}
			} else if (iskredit) {
				if (jurnaldetil_value > 0 || jurnaldetil_idr > 0) {
					throw new Error('akun ditandai dengan kredit, posisi value ada di debet')
				}
			}
		}

		// cek coa aging

		const jurnaldetil_id_ref = frm.Inputs[_jurnaldetil_id_ref].value
		const agingtype_id = frm.Inputs[_agingtype_id].value
		if (agingtype_id == 1) {
			// aging AR
			// jika nilainya minus, harus punya referensi
			if ((jurnaldetil_value < 0 || jurnaldetil_idr < 0) && jurnaldetil_id_ref == '') {
				throw new Error('entri jurnal AR di kolom kredit harus berdasar referensi')
			}

		} else if (agingtype_id == 2) {
			// aging AP
			// jika nilainya plus, harus punya referensi
			if ((jurnaldetil_value > 0 || jurnaldetil_idr > 0) && jurnaldetil_id_ref == '') {
				throw new Error('entri jurnal AP di kolom debet harus berdasar referensi')
			}
		}

	} catch (err) {
		$fgta5.MessageBox.warning(err.message)
		args.cancelSave = true
	}



}

export async function jurnalDetilEdit_dataSaved(self, data, frm) {
	updateBalance(self, data.balance_value, data.balance_idr)
	if (data.updateTotal === true) {
		updateTotal(self, data.total_idr, data.total_value)
	}
}

export async function jurnalDetilEdit_dataDeleted(self, data) {
	updateBalance(self, data.balance_value, data.balance_idr)
	if (data.updateTotal === true) {
		updateTotal(self, data.total_idr, data.total_value)
	}
}

export function jurnalDetilEdit_formLocked(self, frm, CurrentState) {
	if (refButtons.payable) {
		refButtons.payable.disabled = true;
	}
	if (refButtons.receivable) {
		refButtons.receivable.disabled = true;
	}
}

export function jurnalDetilEdit_formUnlocked(self, frm) {
	if (refButtons.payable) {
		refButtons.payable.disabled = false;
	}
	if (refButtons.receivable) {
		refButtons.receivable.disabled = false;
	}
}


export async function jurnalDetilList_rowsDeleted(self, data) {
	updateBalance(self, data.balance_value, data.balance_idr)
	if (data.updateTotal === true) {
		updateTotal(self, data.total_idr, data.total_value)
	}
}

export function obj_coa_id_selecting_criteria(self, obj_coa_id, frm, criteria, sort, evt) {
	const jurnaltype_id = frm.Inputs[_jurnaltype_id].value

	evt.detail.url = 'coa-filtered/list-by-jurnaltype'

	criteria.jurnaltype_id = jurnaltype_id
	criteria.coa_isdisabled = false
}

export async function obj_coa_id_populating(self, obj_coa_id, frm, evt) {
	jurnalHelper.coa_id_populating(self, obj_coa_id, frm, evt, 'detil')
}

export async function obj_coa_id_selected(self, obj_coa_id, frm, evt) {
	if (!obj_coa_id.isSelectedChanged()) {
		return
	}


	const { curr_id, agingtype_id, isdebet, iskredit, iscurradj } = evt.detail.data
	frm.Inputs[_agingtype_id].value = agingtype_id
	frm.Inputs[_coacurr].value = curr_id
	frm.Inputs[_iscurradj].value = iscurradj

	const obj_curr_id = frm.Inputs[_curr_id]
	frm.Inputs[_curr_id].clear()
	if (iscurradj) {
		frm.Inputs[_curr_id].setSelected(Context.setting.defaultCurr.id, Context.setting.defaultCurr.name)
		frm.Inputs[_curr_rate].value = 1
		frm.Inputs[_jurnaldetil_descr].value = 'selisih kurs'
	} else if (curr_id != null) {
		if (obj_curr_id.value != curr_id) {
			frm.Inputs[_curr_id].setSelected(null, '')
			frm.Inputs[_curr_rate].value = 1
		}
	}

	frm.Inputs[_isdebet].value = isdebet
	frm.Inputs[_iskredit].value = iskredit

	iscurradj_changed(self, iscurradj, frm)

	const coa = evt.detail.data
	coa_changed(self, coa, frm)

}


export function obj_curr_id_selecting_criteria(self, obj_curr_id, frm, criteria, sort, evt) {
	const coacur = frm.Inputs[_coacurr].value
	if (coacur != '') {
		criteria.curr_id = coacur
	} else {
		criteria.curr_id = null
	}

}

export async function obj_curr_id_populating(self, obj_curr_id, frm, evt) {
	jurnalHelper.curr_id_populating(self, obj_curr_id, frm, evt, 'detil')
}

export async function obj_curr_id_selected(self, obj_curr_id, frm, evt) {
	const { data } = evt.detail
	frm.Inputs[_curr_rate].value = data.curr_rate
	recalculateCurrency(self, frm)
}

export async function obj_curr_rate_changed(self, obj_curr_rate, frm, evt) {
	recalculateCurrency(self, frm)
}

export async function obj_jurnaldetil_value_changed(self, obj_jurnal_value, frm, evt) {
	recalculateCurrency(self, frm)
}




function recalculateCurrency(self, frm) {
	const obj_iscurradj = frm.Inputs[_iscurradj]
	const iscurradj = obj_iscurradj.value

	if (iscurradj) {
		// jika coa untuk adjust currency tidak perlu di kalukasi idr dan rate
		return
	}


	const rate = frm.Inputs[_curr_rate].value
	const value = frm.Inputs[_jurnaldetil_value].value
	const idr = value * rate

	frm.Inputs[_jurnaldetil_idr].value = idr
}


async function btn_getReceivable_click(self, dlg, evt) {
	console.log('receivable clicked')
	dlg.show('AR')
}


async function btn_getPayable_click(self, dlg, evt) {
	console.log('payable clicked')
	dlg.show('AP')
}


async function jurnaltype_changed(self, jurnaltype, frm) {
	// partner
	const obj_partner_id = frm.Inputs[_partner_id]
	obj_partner_id.disabled = !jurnaltype.isdetilallowselectpartner
	obj_partner_id.markAsRequired(jurnaltype.isdetilpartnermandatory)
	pageHelper.setVisibility(`${_partner_id}-container`, jurnaltype.isdetilhaspartner)

	// struct
	const obj_struct_id = frm.Inputs[_struct_id]
	obj_struct_id.disabled = !jurnaltype.isdetilallowselectstruct
	obj_struct_id.markAsRequired(jurnaltype.isdetilstructmandatory)
	pageHelper.setVisibility(`${_struct_id}-container`, jurnaltype.isdetilhasstruct)

	// site
	const obj_site_id = frm.Inputs[_site_id]
	obj_site_id.disabled = !jurnaltype.isdetilallowselectsite
	obj_site_id.markAsRequired(jurnaltype.isdetilsitemandatory)
	pageHelper.setVisibility(`${_site_id}-container`, jurnaltype.isdetilhassite)

	// unit
	const obj_unit_id = frm.Inputs[_unit_id]
	obj_unit_id.disabled = !jurnaltype.isdetilallowselectunit
	obj_unit_id.markAsRequired(jurnaltype.isdetilunitmandatory)
	pageHelper.setVisibility(`${_unit_id}-container`, jurnaltype.isdetilhasunit)

	// project
	const obj_project_id = frm.Inputs[_project_id]
	obj_project_id.disabled = !jurnaltype.isdetilallowselectproject
	obj_project_id.markAsRequired(jurnaltype.isdetilprojectmandatory)
	pageHelper.setVisibility(`${_project_id}-container`, jurnaltype.isdetilhasproject)

}

async function coa_changed(self, coa, frm) {
	if (coa == null) {
		coa = {}
	}

	const agingtype_id = coa.agingtype_id
	const obj_partner_id = frm.Inputs[_partner_id]
	if (agingtype_id == 1 || agingtype_id == 2) {
		// partner harus diisi
		obj_partner_id.disabled = false
		obj_partner_id.markAsRequired(true)
		pageHelper.setVisibility(`${_partner_id}-container`, true)
	} else {
		// sesuaikan dengan jurnaltype
		const jurnaltype = self.currentJurnaltype
		obj_partner_id.disabled = !jurnaltype.isdetilallowselectpartner
		obj_partner_id.markAsRequired(jurnaltype.isdetilpartnermandatory)
		pageHelper.setVisibility(`${_partner_id}-container`, jurnaltype.isdetilhaspartner)
	}
}

async function outstandingSelected(self, data, evt) {
	console.log(data)

	const jurnalDetilEdit = self.Modules.jurnalDetilEdit
	const frm = jurnalDetilEdit.getForm()

	const obj_jurnaldetil_descr = frm.Inputs[_jurnaldetil_descr]
	const obj_coa_id = frm.Inputs[_coa_id]
	const obj_partner_id = frm.Inputs[_partner_id]
	const obj_struct_id = frm.Inputs[_struct_id]
	const obj_site_id = frm.Inputs[_site_id]
	const obj_unit_id = frm.Inputs[_unit_id]
	const obj_project_id = frm.Inputs[_project_id]
	const obj_curr_id = frm.Inputs[_curr_id]
	const obj_jurnaldetil_value = frm.Inputs[_jurnaldetil_value]
	const obj_curr_rate = frm.Inputs[_curr_rate]
	const obj_jurnaldetil_idr = frm.Inputs[_jurnaldetil_idr]
	const obj_jurnaldetil_id_ref = frm.Inputs[_jurnaldetil_id_ref]
	const obj_agingtype_id = frm.Inputs[_agingtype_id]
	const obj_ismanuallink = frm.Inputs[_ismanuallink]

	// nilai data hasil tarikan adalah negasi dari value data referensinya
	const idrChanged = obj_jurnaldetil_idr.value != -Number(data.outstanding_idr)
	const valueChanged = obj_jurnaldetil_value.value != -Number(data.outstanding_value)
	const refChanged = obj_jurnaldetil_id_ref.value != data.jurnaldetil_id


	// kalau masih kosong langsing terima aja, kalau sudah ada isinya, tanya dulu kalau berubah
	if (obj_jurnaldetil_id_ref.value != '') {
		if (idrChanged || valueChanged || refChanged) {
			// user pilih data lagi, sedangkan pilihan sebelumnya sudah dilakukan / diubah
			const ret = await $fgta5.MessageBox.confirm('anda sudah membuat perubahan data sebelumnya, apakah akan ditimpa?')
			if (ret == 'cancel') {
				evt.detail.cancelSelect = true
				return
			}
		}
	}


	obj_coa_id.setSelected(data.coa_id, data.coa_name)
	obj_partner_id.setSelected(data.partner_id, data.partner_name)
	obj_struct_id.setSelected(data.struct_id, data.struct_name)
	obj_site_id.setSelected(data.site_id, data.site_name)
	obj_unit_id.setSelected(data.unit_id, data.unit_name)
	obj_project_id.setSelected(data.project_id, data.project_name)
	obj_curr_id.setSelected(data.curr_id, data.curr_name)
	obj_curr_rate.value = data.curr_rate
	obj_jurnaldetil_descr.value = data.jurnaldetil_descr
	obj_jurnaldetil_value.value = -data.outstanding_value
	obj_jurnaldetil_idr.value = -data.outstanding_idr
	obj_jurnaldetil_id_ref.value = data.jurnaldetil_id
	obj_agingtype_id.value = data.agingtype_id
	obj_ismanuallink.value = true

	suspendReferencedEditor(self, frm)
}


function suspendReferencedEditor(self, frm, suspended = true) {
	const obj_jurnaldetil_descr = frm.Inputs[_jurnaldetil_descr]
	const obj_coa_id = frm.Inputs[_coa_id]
	const obj_partner_id = frm.Inputs[_partner_id]
	const obj_struct_id = frm.Inputs[_struct_id]
	const obj_site_id = frm.Inputs[_site_id]
	const obj_unit_id = frm.Inputs[_unit_id]
	const obj_project_id = frm.Inputs[_project_id]
	const obj_curr_id = frm.Inputs[_curr_id]
	const obj_curr_rate = frm.Inputs[_curr_rate]

	obj_coa_id.suspend(suspended)
	obj_partner_id.suspend(suspended)
	obj_struct_id.suspend(suspended)
	obj_site_id.suspend(suspended)
	obj_unit_id.suspend(suspended)
	obj_project_id.suspend(suspended)
	obj_curr_id.suspend(suspended)
	obj_curr_rate.suspend(suspended)
	obj_jurnaldetil_descr.suspend(suspended)

}

function updateBalance(self, balance_value, balance_idr) {
	// update di list
	const el_list_balance_value = document.getElementById('jurnalDetilList-balance_value')
	const el_list_balance_idr = document.getElementById('jurnalDetilList-balance_idr')
	el_list_balance_value.innerHTML = pageHelper.formatDecimal(balance_value)
	el_list_balance_idr.innerHTML = pageHelper.formatDecimal(balance_idr)

	// update di form header
	const extenderHeader = self.Modules.extenderHeader
	extenderHeader.updateDetilInfo_balance(self, balance_value, balance_idr)
	extenderHeader.updateList_balance(self, balance_value, balance_idr)

	// update di current form detil
	const balContainer = document.getElementById('formdetil-current-balance')
	const elBalValue = document.getElementById('jurnalDetilEdit-balance_value')
	const elBalIdr = document.getElementById('jurnalDetilEdit-balance_idr')
	elBalValue.innerHTML = pageHelper.formatDecimal(balance_value)
	elBalIdr.innerHTML = pageHelper.formatDecimal(balance_idr)


	if (balance_idr == 0 && balance_value == 0) {
		balContainer.removeAttribute('unbalance')
		el_list_balance_idr.classList.remove('unbalance-text')
	} else {
		balContainer.setAttribute('unbalance', true)
		el_list_balance_idr.classList.add('unbalance-text')
	}


}

function updateTotal(self, total_idr, total_value) {
	self.Modules.jurnalHeaderList.updateCurrentRow(self, { jurnal_idr: total_idr })
}

function iscurradj_changed(self, iscurradj, frm) {
	const obj_jurnaldetil_idr = frm.Inputs[_jurnaldetil_idr]

	if (iscurradj) {
		obj_jurnaldetil_idr.disabled = false
	} else {
		obj_jurnaldetil_idr.disabled = true
	}
}