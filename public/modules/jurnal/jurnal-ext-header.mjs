import Context from './jurnal-context.mjs'
import * as pageHelper from '/public/libs/webmodule/pagehelper.mjs'


const _jurnal_id = 'jurnalHeaderEdit-obj_jurnal_id'
const _jurnal_doc = 'jurnalHeaderEdit-obj_jurnal_doc'
const _ispost = 'jurnalHeaderEdit-obj_ispost'
const _jurnal_source = 'jurnalHeaderEdit-obj_jurnal_source'
const _jurnaltype_id = 'jurnalHeaderEdit-obj_jurnaltype_id'
const _paymreq_id = 'jurnalHeaderEdit-obj_paymreq_id'
const _periode_id = 'jurnalHeaderEdit-obj_periode_id'
const _jurnal_date = 'jurnalHeaderEdit-obj_jurnal_date'
const _jurnal_datedue = 'jurnalHeaderEdit-obj_jurnal_datedue'
const _jurnal_descr = 'jurnalHeaderEdit-obj_jurnal_descr'
const _partner_id = 'jurnalHeaderEdit-obj_partner_id'
const _paymtype_id = 'jurnalHeaderEdit-obj_paymtype_id'
const _partnerbank_id = 'jurnalHeaderEdit-obj_partnerbank_id'
const _payment_bgno = 'jurnalHeaderEdit-obj_payment_bgno'
const _partnerbank_account = 'jurnalHeaderEdit-obj_partnerbank_account'
const _partnerbank_bankname = 'jurnalHeaderEdit-obj_partnerbank_bankname'
const _partnerbank_accountname = 'jurnalHeaderEdit-obj_partnerbank_accountname'
const _partnercontact_id = 'jurnalHeaderEdit-obj_partnercontact_id'
const _coa_id = 'jurnalHeaderEdit-obj_coa_id'
const _struct_id = 'jurnalHeaderEdit-obj_struct_id'
const _site_id = 'jurnalHeaderEdit-obj_site_id'
const _unit_id = 'jurnalHeaderEdit-obj_unit_id'
const _project_id = 'jurnalHeaderEdit-obj_project_id'
const _curr_id = 'jurnalHeaderEdit-obj_curr_id'
const _jurnal_value = 'jurnalHeaderEdit-obj_jurnal_value'
const _curr_rate = 'jurnalHeaderEdit-obj_curr_rate'
const _jurnal_idr = 'jurnalHeaderEdit-obj_jurnal_idr'
const _copyto = 'jurnalHeaderEdit-obj_copyto'
const _coacurr = 'jurnalHeaderEdit-obj_coacurr'



export function init_header(self, args) {
	const moduleHeader = self.Modules.jurnalHeaderEdit;
	const frm = moduleHeader.getForm();



	frm.Inputs[_paymreq_id].markAsRequired(false)
	frm.Inputs[_paymtype_id].markAsRequired(false)
	frm.Inputs[_partner_id].markAsRequired(false)
	frm.Inputs[_partnerbank_id].markAsRequired(false)
	frm.Inputs[_payment_bgno].markAsRequired(false)
	frm.Inputs[_partnerbank_account].markAsRequired(false)
	frm.Inputs[_partnerbank_bankname].markAsRequired(false)
	frm.Inputs[_partnerbank_accountname].markAsRequired(false)
	frm.Inputs[_coa_id].markAsRequired(false)



}


export async function jurnalHeaderEdit_formOpened(self, frm, CurrentState) {
	disableJurnaltype(frm, true) // user tidak bisa memilih jurnaltype untuk data yang sudah disimpan


	const {
		jurnaltype, paymtype, periode_isclosed, ispost, jurnal_source,
		_postby, _postdate,
		isallowposting, isallowunposting,
		total_value, total_idr
	} = frm.getOriginalData()

	jurnaltype_changed(jurnaltype, frm)
	paymtype_changed(paymtype, frm)


	CurrentState.Actions.edit.suspend(periode_isclosed || ispost)
	CurrentState.Actions.post.suspend(periode_isclosed || ispost || !isallowposting)
	CurrentState.Actions.unpost.suspend(periode_isclosed || !ispost || !isallowunposting)

	// CurrentState.Actions.post.hide(!isallowposting)
	// CurrentState.Actions.unpost.hide(!isallowunposting)


}

export async function jurnalHeaderEdit_newData(self, datainit, frm) {
	disableJurnaltype(frm, false)  // aktifkan kembali jurnaltype saat membuat data baru

	// set default currency
	datainit.curr_id = { value: Context.setting.defaultCurr.id, text: Context.setting.defaultCurr.name }

	jurnaltype_changed({}, frm)
	paymtype_changed({}, frm)
}

export async function jurnalHeaderEdit_dataSaved(self, data, frm) {
	disableJurnaltype(frm, true)  // user tidak bisa memilih jurnaltype untuk data yang sudah disimpan
}

export async function obj_paymtype_id_selected(self, obj_paymtype_id, frm, evt) {
	if (!obj_paymtype_id.isSelectedChanged()) {
		return
	}
	const paymtype = evt.detail.data
	paymtype_changed(paymtype, frm)
}

export function obj_jurnaltype_id_selecting_criteria(self, obj_jurnaltype_id, frm, criteria, sort, evt) {
	evt.detail.url = 'jurnaltype-filtered/list-by-user'
	sort.jurnaltype_name = 'asc'
	criteria.jurnaltype_isallowselect = true
}

export async function obj_jurnaltype_id_selected(self, obj_jurnaltype_id, frm, evt) {
	if (!obj_jurnaltype_id.isSelectedChanged()) {
		return
	}
	const jurnaltype = evt.detail.data
	jurnaltype_changed(jurnaltype, frm)
	paymtype_changed({}, frm)
}

export function obj_periode_id_selecting_criteria(self, obj_periode_id, frm, criteria, sort, evt) {
	criteria.periode_isclosed = false
	criteria.periode_isactive = true
}


export async function obj_partner_id_selected(self, obj_partner_id, frm, evt) {
	if (!obj_partner_id.isSelectedChanged()) {
		return
	}
	const partner = evt.detail.data
	partner_changed(partner, frm)
}

export async function obj_partnerbank_id_selected(self, obj_partnerbank_id, frm, evt) {
	if (!obj_partnerbank_id.isSelectedChanged()) {
		return
	}
	const partnerbank = evt.detail.data
	partnerbank_changed(partnerbank, frm)
}

export function obj_partnerbank_id_selecting_criteria(self, obj_partnerbank_id, frm, criteria, sort, evt) {
	const partner_id = frm.Inputs[_partner_id].value
	criteria.partner_id = partner_id
	criteria.partnerbank_isdisabled = false
}

export function obj_partnercontact_id_selecting_criteria(self, obj_partnercontact_id, frm, criteria, sort, evt) {
	const partner_id = frm.Inputs[_partner_id].value
	criteria.partner_id = partner_id
	criteria.partnercontact_isdisabled = false
}

export function obj_coa_id_selecting_criteria(self, obj_coa_id, frm, criteria, sort, evt) {
	criteria.coa_isdisabled = false
}

export function obj_struct_id_selecting_criteria(self, obj_struct_id, frm, criteria, sort, evt) {
	criteria.struct_isdisabled = false
}

export function obj_site_id_selecting_criteria(self, obj_site_id, frm, criteria, sort, evt) {
	criteria.site_isdisabled = false
}

export function obj_unit_id_selecting_criteria(self, obj_unit_id, frm, criteria, sort, evt) {
	criteria.unit_isdisabled = false
}










function disableJurnaltype(frm, disabled) {
	const obj_jurnaltype_id = frm.Inputs[_jurnaltype_id]
	obj_jurnaltype_id.disabled = disabled
}


function jurnaltype_changed(jurnaltype, frm) {
	if (jurnaltype == null) {
		jurnaltype = {}
	}

	// due date
	pageHelper.setVisibility(`${_jurnal_datedue}-container`, jurnaltype.isheadhasduedate)

	// copyto
	const obj_copyto = frm.Inputs[_copyto]
	obj_copyto.value = jurnaltype.jurnaltype_headcopyto
	const jurnaltype_headcopyto = jurnaltype.jurnaltype_headcopyto ?? ''
	pageHelper.setVisibility(`${_copyto}-container`, jurnaltype_headcopyto.trim()!='')


	// payment req
	const obj_paymreq_id = frm.Inputs[_paymreq_id]
	obj_paymreq_id.disabled = !jurnaltype.isheadhaspaymreq
	obj_paymreq_id.markAsRequired(jurnaltype.isheadhaspaymreq)
	pageHelper.setVisibility(`${_paymreq_id}-container`, jurnaltype.isheadhaspaymreq)


	// paymtype
	const obj_paymtype_id = frm.Inputs[_paymtype_id]
	obj_paymtype_id.disabled = !jurnaltype.isheadhaspaymtype
	obj_paymtype_id.markAsRequired(jurnaltype.isheadhaspaymtype)
	pageHelper.setVisibility(`${_paymtype_id}-container`, jurnaltype.isheadhaspaymtype)

	// coa
	const obj_coa_id = frm.Inputs[_coa_id]
	obj_coa_id.disabled = !jurnaltype.isheadhascoa
	obj_coa_id.markAsRequired(jurnaltype.isheadhascoa)
	pageHelper.setVisibility(`${_coa_id}-container`, jurnaltype.isheadhascoa)


	// value
	pageHelper.setVisibility(`${_jurnal_idr}-container`, jurnaltype.isheadhasvalue)
	pageHelper.setVisibility(`${_jurnal_value}-container`, jurnaltype.isheadhasvalue)
	pageHelper.setVisibility(`${_curr_id}-container`, jurnaltype.isheadhasvalue)
	pageHelper.setVisibility(`${_curr_rate}-container`, jurnaltype.isheadhasvalue)




	// partner
	const obj_partner_id = frm.Inputs[_partner_id]
	obj_partner_id.disabled = !jurnaltype.isheadallowselectpartner
	obj_partner_id.markAsRequired(jurnaltype.isheadpartnermandatory)
	pageHelper.setVisibility(`${_partner_id}-container`, jurnaltype.isheadhaspartner)

	// struct
	const obj_struct_id = frm.Inputs[_struct_id]
	obj_struct_id.disabled = !jurnaltype.isheadallowselectstruct
	obj_struct_id.markAsRequired(jurnaltype.isheadstructmandatory)
	pageHelper.setVisibility(`${_struct_id}-container`, jurnaltype.isheadhasstruct)

	// site
	const obj_site_id = frm.Inputs[_site_id]
	obj_site_id.disabled = !jurnaltype.isheadallowselectsite
	obj_site_id.markAsRequired(jurnaltype.isheadsitemandatory)
	pageHelper.setVisibility(`${_site_id}-container`, jurnaltype.isheadhassite)

	// unit
	const obj_unit_id = frm.Inputs[_unit_id]
	obj_unit_id.disabled = !jurnaltype.isheadallowselectunit
	obj_unit_id.markAsRequired(jurnaltype.isheadunitmandatory)
	pageHelper.setVisibility(`${_unit_id}-container`, jurnaltype.isheadhasunit)

	// project
	const obj_project_id = frm.Inputs[_project_id]
	obj_project_id.disabled = !jurnaltype.isheadallowselectproject
	obj_project_id.markAsRequired(jurnaltype.isheadprojectmandatory)
	pageHelper.setVisibility(`${_project_id}-container`, jurnaltype.isheadhasproject)

}

function paymtype_changed(paymtype, frm) {
	if (paymtype == null) {
		paymtype = {}
	}

	// set visibilitas komponen yang terpengaruh saat perubahan tipe payment
	pageHelper.setVisibility(`${_partnercontact_id}-container`, paymtype.ishaspartnercontact)
	pageHelper.setVisibility(`${_partnerbank_id}-container`, paymtype.ishaspartnerbankselector)
	pageHelper.setVisibility(`${_payment_bgno}-container`, paymtype.ishasgiro)
	pageHelper.setVisibility(`${_partnerbank_account}-container`, paymtype.ishasbankaccount)
	pageHelper.setVisibility(`${_partnerbank_accountname}-container`, paymtype.ishasbankaccountname)
	pageHelper.setVisibility(`${_partnerbank_bankname}-container`, paymtype.ishasbankname)

	// set mandatory field yang terpengaruh saat perubahan tipe payment
	frm.Inputs[_partnerbank_id].markAsRequired(paymtype.ishaspartnerbankselector)
	frm.Inputs[_payment_bgno].markAsRequired(paymtype.ishasgiro)
	frm.Inputs[_partnerbank_account].markAsRequired(paymtype.ishasbankaccount)
	frm.Inputs[_partnerbank_accountname].markAsRequired(paymtype.ishasbankaccountname)
	frm.Inputs[_partnerbank_bankname].markAsRequired(paymtype.ishasbankname)

}

function partnerbank_changed(partnerbank, frm) {
	if (partnerbank == null) {
		partnerbank = {}
	}

	frm.Inputs[_partnerbank_account].value = partnerbank.partnerbank_account
	frm.Inputs[_partnerbank_accountname].value = partnerbank.partnerbank_accountname
	frm.Inputs[_partnerbank_bankname].value = partnerbank.partnerbank_bankname
}

function partner_changed(partner, frm) {
	if (partner == null) {
		partner = {}
	}
	// jika ada perubahan partner yang dipilih, agar data tetap konsisten:
	// kosongkan kembali partnerbank
	frm.Inputs[_partnerbank_id].clear()
	frm.Inputs[_partnerbank_id].setSelected(null)

	// kosongkan partner contact yang telah dipilih
	frm.Inputs[_partnercontact_id].clear()
	frm.Inputs[_partnercontact_id].setSelected(null)

	// reset/kosongkan data partnerbank
	frm.Inputs[_partnerbank_account].value = ""
	frm.Inputs[_partnerbank_accountname].value = ""
	frm.Inputs[_partnerbank_bankname].value = ""
}