import * as pageHelper from '/public/libs/webmodule/pagehelper.mjs'




export function init_header(self, args)  {
}


export async function obj_paymreqtype_id_selected(self, obj_paymreqtype_id, frm, evt) {
	const paymreq = evt.detail.data

	paymreqtype_changed(paymreq, frm)
}

export async function obj_paymtype_id_selected(self, obj_paymtype_id, frm, evt) {
	const paymtype = evt.detail.data

	paymtype_changed(paymtype, frm)
}



function paymreqtype_changed(paymreq, frm) {
	const paymreq_invoice = 'paymreqHeaderEdit-obj_paymreq_invoice'

	pageHelper.setVisibility(`${paymreq_invoice}-container`, paymreq.hasinvoice)

	frm.Inputs[paymreq_invoice].markAsRequired(paymreq.hasinvoice)
}

function paymtype_changed(paymtype, frm) {
	const _payment_bgno = 'paymreqHeaderEdit-obj_payment_bgno'
	const _partnerbank_id = 'paymreqHeaderEdit-obj_partnerbank_id'
	const _partnercontact_id = 'paymreqHeaderEdit-obj_partnercontact_id'
	const _partnerbank_account = 'paymreqHeaderEdit-obj_partnerbank_account'
	const _partnerbank_accountname = 'paymreqHeaderEdit-obj_partnerbank_accountname'
	const _partnerbank_bankname = 'paymreqHeaderEdit-obj_partnerbank_bankname'

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