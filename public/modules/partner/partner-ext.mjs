import Context from './partner-context.mjs'
import * as pageHelper from '/public/libs/webmodule/pagehelper.mjs'


export async function init(self, args) {
	console.log('initializing partnerExtender ...')
}

export async function obj_partnertype_id_selected(self, obj_partnertype_id, frm, evt) {
	if (!evt.detail.changed) {
		return 
	}

	const isEmployee = evt.detail.data.partnertype_isemployee
	const obj_partner_isemployee = frm.Inputs['partnerHeaderEdit-obj_partner_isemployee']
	obj_partner_isemployee.value = isEmployee
	
	partnertypeChanged(frm, {
		isEmployee
	})
}

export async function partnerHeaderEdit_formOpened(self, frm, CurrentState) {
	const obj_partner_isemployee = frm.Inputs['partnerHeaderEdit-obj_partner_isemployee']
	const isEmployee = obj_partner_isemployee.value

	partnertypeChanged(frm, {
		isEmployee
	})

	isnonpkpChanged(frm, {
		isNonPkp: frm.Inputs['partnerHeaderEdit-obj_partner_isnonpkp'].value	
	})
}

export async function partnerHeaderEdit_newData(self, datainit, frm) {
	partnertypeChanged(frm, {
		isEmployee: false
	})

	isnonpkpChanged(frm, {
		isNonPkp: frm.Inputs['partnerHeaderEdit-obj_partner_isnonpkp'].value	
	})
}

export async function obj_partner_isnonpkp_changed(self, obj_partner_isnonpkp, frm, evt) {
	isnonpkpChanged(frm, {
		isNonPkp: evt.detail.checked 
	})
}




function partnertypeChanged(frm, partnertype) {
	const {isEmployee} = partnertype
	const obj_employee_nip = frm.Inputs['partnerHeaderEdit-obj_employee_nip']

	// jika tipe partner adalah karyawan,
	// wajib mengisi kode NIP (nomor induk pekerja)
	if (isEmployee) {
		console.log('harus isi employee')
		obj_employee_nip.markAsRequired(true)
		pageHelper.setVisibility('partnerHeaderEdit-obj_employee_nip-container', true)
	} else {
		console.log('form employee tidak perlu muncul')
		obj_employee_nip.markAsRequired(false)
		pageHelper.setVisibility('partnerHeaderEdit-obj_employee_nip-container', false)
	}
}


function isnonpkpChanged(frm, data) {
	const obj_partner_npwp = frm.Inputs['partnerHeaderEdit-obj_partner_npwp']
	if (data.isNonPkp) {
		obj_partner_npwp.markAsRequired(false)
	} else {
		obj_partner_npwp.markAsRequired(true)
	}
}