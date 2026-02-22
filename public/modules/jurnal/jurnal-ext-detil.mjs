import * as jurnalHelper from './jurnal-helper.mjs'
import * as pageHelper from '/public/libs/webmodule/pagehelper.mjs'


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
const _jurnal_id = 'jurnalDetilEdit-obj_jurnal_id'


export function init_detil(self, args) {
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
		}
	}
}


export function headerJurnaltype_changed(self, jurnaltype, headerFrm) {
	self.currentJurnaltype = jurnaltype

}


export async function jurnalDetilEdit_newData(self, datainit, frm, CurrentState) {
	const jurnaltype_id = self.currentJurnaltype.jurnaltype_id

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


	// set default data saat new
	datainit.jurnaltype_id = jurnaltype_id
	datainit.curr_id = { value: header_curr_id, text: header_curr_name }
	datainit.partner_id = { value: header_partner_id, text: header_partner_name }
	datainit.site_id = { value: header_site_id, text: header_site_name }
	datainit.unit_id = { value: header_unit_id, text: header_unit_name }
	datainit.struct_id = { value: header_struct_id, text: header_struct_name }
	datainit.project_id = { value: header_project_id, text: header_project_name }

}

export async function jurnalDetilEdit_dataSaving(self, dataToSave, frm, args) {
	// cek posisi debet/kredit
	const isdebet = frm.Inputs[_isdebet].value
	const iskredit = frm.Inputs[_iskredit].value
	const idr = frm.Inputs[_jurnaldetil_idr].value
	const value = frm.Inputs[_jurnaldetil_value].value


	try {
		if (isdebet || iskredit) {
			// perlu cek debet kredit
			if (isdebet) {
				if (value < 0 || idr < 0) {
					throw new Error('akun ditandai dengan debet, posisi value ada di kredit')
				}
			} else if (iskredit) {
				if (value > 0 || idr > 0) {
					throw new Error('akun ditandai dengan kredit, posisi value ada di debet')
				}
			}
		}

	} catch (err) {
		$fgta5.MessageBox.warning(err.message)
		args.cancelSave = true
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


	const { curr_id, agingtype_id, isdebet, iskredit } = evt.detail.data
	frm.Inputs[_agingtype_id].value = agingtype_id
	frm.Inputs[_coacurr].value = curr_id

	const obj_curr_id = frm.Inputs[_curr_id]
	if (curr_id != null) {
		if (obj_curr_id.value != curr_id) {
			frm.Inputs[_curr_id].clear()
			frm.Inputs[_curr_id].setSelected(null, '')
			frm.Inputs[_curr_rate].value = 1
		}
	}

	frm.Inputs[_isdebet].value = isdebet
	frm.Inputs[_iskredit].value = iskredit

}


export function obj_curr_id_selecting_criteria(self, obj_curr_id, frm, criteria, sort, evt) {
	// const jurnalHeaderEdit = self.Modules.jurnalHeaderEdit
	// const frmHeader = jurnalHeaderEdit.getForm()

	// const curr_id = frm.Inputs[_coacurr].value
	// const bookdate = frmHeader.Inputs['jurnalHeaderEdit-obj_jurnal_date'].value
	// criteria.curr_date = bookdate

	// if (curr_id != '') {
	// 	criteria.curr_id = curr_id
	// }

	// sort.curr_code = 'asc'
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
	const rate = frm.Inputs[_curr_rate].value
	const value = frm.Inputs[_jurnaldetil_value].value
	const idr = value * rate

	frm.Inputs[_jurnaldetil_idr].value = idr
}