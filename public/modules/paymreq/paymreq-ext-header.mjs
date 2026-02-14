import Context from './paymreq-context.mjs'
import * as pageHelper from '/public/libs/webmodule/pagehelper.mjs'


const _paymreqtype_id = 'paymreqHeaderEdit-obj_paymreqtype_id'
const _paymreq_invoice = 'paymreqHeaderEdit-obj_paymreq_invoice'
const _ffl_id = 'paymreqHeaderEdit-obj_ffl_id'
const _po_id = 'paymreqHeaderEdit-obj_po_id'
const _bc_id = 'paymreqHeaderEdit-obj_bc_id'
const _payment_bgno = 'paymreqHeaderEdit-obj_payment_bgno'
const _partnerbank_id = 'paymreqHeaderEdit-obj_partnerbank_id'
const _partnercontact_id = 'paymreqHeaderEdit-obj_partnercontact_id'
const _partnerbank_account = 'paymreqHeaderEdit-obj_partnerbank_account'
const _partnerbank_accountname = 'paymreqHeaderEdit-obj_partnerbank_accountname'
const _partnerbank_bankname = 'paymreqHeaderEdit-obj_partnerbank_bankname'
const _paymreq_value = 'paymreqHeaderEdit-obj_paymreq_value'
const _paymreq_total = 'paymreqHeaderEdit-obj_paymreq_total'
const _paymreq_ppn = 'paymreqHeaderEdit-obj_paymreq_ppn'
const _paymreq_pph = 'paymreqHeaderEdit-obj_paymreq_pph'
const _paymreq_bill = 'paymreqHeaderEdit-obj_paymreq_bill'


export function init_header(self, args) {
}


export function obj_paymreqtype_id_selecting_criteria(self, obj_paymreqtype_id, frm, criteria, sort, evt) {
	criteria.paymreqtype_isdisabled = false
}

export async function obj_paymreqtype_id_selected(self, obj_paymreqtype_id, frm, evt) {
	if (!obj_paymreqtype_id.isSelectedChanged()) {
		return
	}

	const paymreqtype = evt.detail.data
	paymreqtype_changed(paymreqtype, frm)
}

export async function obj_paymtype_id_selected(self, obj_paymtype_id, frm, evt) {
	if (!obj_paymtype_id.isSelectedChanged()) {
		return
	}

	const paymtype = evt.detail.data
	paymtype_changed(paymtype, frm)
}

export async function obj_partnerbank_id_selected(self, obj_partnerbank_id, frm, evt) {
	if (!obj_partnerbank_id.isSelectedChanged()) {
		return
	}

	const partnerbank = evt.detail.data
	partnerbank_changed(partnerbank, frm)
}

export async function obj_partner_id_selected(self, obj_partner_id, frm, evt) {
	if (!obj_partner_id.isSelectedChanged()) {
		return
	}

	const partner = evt.detail.data
	partner_changed(partner, frm)
}

export function paymreqHeaderEdit_formOpened(self, frm, CurrentState) {
	const obj = frm.Inputs[_paymreqtype_id]
	obj.disabled = true

	const { paymtype, paymreqtype } = frm.getOriginalData()
	paymreqtype_changed(paymreqtype, frm)
	paymtype_changed(paymtype, frm)
}

export async function paymreqHeaderEdit_newData(self, datainit, frm) {
	const obj = frm.Inputs[_paymreqtype_id]
	obj.disabled = false

	// console.log(Context.setting)
	datainit.curr_id = { value: Context.setting.defaultCurr.id, text: Context.setting.defaultCurr.name }


}

export async function paymreqHeaderEdit_dataSaved(self, data, frm) {
	const obj = frm.Inputs[_paymreqtype_id]
	obj.disabled = true
}


export function obj_ppn_id_selecting_criteria(self, obj_ppn_id, frm, criteria, sort, evt) {
	criteria.taxtype_model = 'PPN'
	criteria.taxtype_isdisabled = false
}

export function obj_pph_id_selecting_criteria(self, obj_pph_id, frm, criteria, sort, evt) {
	criteria.taxtype_model = 'PPH'
	criteria.taxtype_isdisabled = false
}

export async function obj_ppn_id_selected(self, obj_ppn_id, frm, evt) {
	if (!obj_ppn_id.isSelectedChanged()) {
		return
	}

	const taxtype = evt.detail.data
	ppn_changed(taxtype, frm)
}

export async function updateValues(self, data) {
	const moduleHeader = self.Modules.paymreqHeaderEdit
	const frm = moduleHeader.getForm()

	frm.Inputs[_paymreq_value].value = data.paymreq_value
	frm.Inputs[_paymreq_bill].value = data.paymreq_bill
	frm.Inputs[_paymreq_pph].value = data.paymreq_pph
	frm.Inputs[_paymreq_ppn].value = data.paymreq_ppn
	frm.Inputs[_paymreq_total].value = data.paymreq_total

	frm.acceptChanges()
}


function paymreqtype_changed(paymreqtype, frm) {
	pageHelper.setVisibility(`${_paymreq_invoice}-container`, paymreqtype.hasinvoice)
	pageHelper.setVisibility(`${_ffl_id}-container`, paymreqtype.hasffl)
	pageHelper.setVisibility(`${_po_id}-container`, paymreqtype.haspo)
	pageHelper.setVisibility(`${_bc_id}-container`, paymreqtype.hasbc)

	frm.Inputs[_paymreq_invoice].markAsRequired(paymreqtype.hasinvoice)
	frm.Inputs[_ffl_id].markAsRequired(paymreqtype.fflismandatory)
	frm.Inputs[_po_id].markAsRequired(paymreqtype.poismandatory)
	frm.Inputs[_bc_id].markAsRequired(paymreqtype.bcismandatory)
}

function paymtype_changed(paymtype, frm) {
	pageHelper.setVisibility(`${_payment_bgno}-container`, paymtype.ishasgiro)
	pageHelper.setVisibility(`${_partnerbank_id}-container`, paymtype.ishaspartnerbankselector)
	pageHelper.setVisibility(`${_partnercontact_id}-container`, paymtype.ishaspartnercontact)
	pageHelper.setVisibility(`${_partnerbank_account}-container`, paymtype.ishasbankaccount)
	pageHelper.setVisibility(`${_partnerbank_accountname}-container`, paymtype.ishasbankaccountname)
	pageHelper.setVisibility(`${_partnerbank_bankname}-container`, paymtype.ishasbankname)

	frm.Inputs[_payment_bgno].markAsRequired(paymtype.ishasgiro)
	frm.Inputs[_partnerbank_id].markAsRequired(paymtype.ishaspartnerbankselector)
	frm.Inputs[_partnerbank_account].markAsRequired(paymtype.ishasbankaccount)
	frm.Inputs[_partnerbank_accountname].markAsRequired(paymtype.ishasbankaccountname)
	frm.Inputs[_partnerbank_bankname].markAsRequired(paymtype.ishasbankname)
}

function partnerbank_changed(partnerbank, frm) {
	frm.Inputs[_partnerbank_account].value = partnerbank.partnerbank_account
	frm.Inputs[_partnerbank_accountname].value = partnerbank.partnerbank_accountname
	frm.Inputs[_partnerbank_bankname].value = partnerbank.partnerbank_bankname

}

function partner_changed(partner, frm) {
	frm.Inputs[_partnerbank_id].clear()
	frm.Inputs[_partnerbank_id].setSelected(null)
	frm.Inputs[_partnerbank_account].value = ""
	frm.Inputs[_partnerbank_accountname].value = ""
	frm.Inputs[_partnerbank_bankname].value = ""
	frm.Inputs[_partnercontact_id].clear()
	frm.Inputs[_partnercontact_id].setSelected(null)
}


function ppn_changed(taxtype, frm) {
	const taxtype_value = taxtype.taxtype_value ?? 0
	const obj_paymreq_value = frm.Inputs[_paymreq_value]
	const obj_paymreq_total = frm.Inputs[_paymreq_total]

	const tax = Number(taxtype_value)
	const value = Number(obj_paymreq_value.value)
	const total = ((tax + 100) / 100) * value
	obj_paymreq_total.value = total

	console.log(total)

}
