import Context from './paymreq-context.mjs'
import { printDocument } from './paymreq-print.mjs'
import * as pageHelper from '/public/libs/webmodule/pagehelper.mjs'


const VAR_APPROVAL = 'approval'
const VAR_REJECTION = 'reject'
const VAR_VIEW = 'view'


/* untuk keperluan debug & testing */
const ALWAYS_SHOW_ACTIONBUTTON = false   // false: tampilkan sesuai kondisi data
const ALWAYS_ENABLE_ACTIONBUTTON = false  // false: enable/disabled sesuai kondisi data
const DISABLE_FILTER_LIST = false  // false: filter sesuai kewenangan user

const _paymreq_id = 'paymreqHeaderEdit-obj_paymreq_id'
const _paymreq_version = 'paymreqHeaderEdit-obj_paymreq_version'
const _paymreq_doc = 'paymreqHeaderEdit-obj_paymreq_doc'
const _paymreq_descr = 'paymreqHeaderEdit-obj_paymreq_descr'
const _iscommit = 'paymreqHeaderEdit-obj_iscommit'
const _isapproved = 'paymreqHeaderEdit-obj_isapproved'
const _paymreqtype_id = 'paymreqHeaderEdit-obj_paymreqtype_id'
const _paymreq_invoice = 'paymreqHeaderEdit-obj_paymreq_invoice'
const _ffl_id = 'paymreqHeaderEdit-obj_ffl_id'
const _po_id = 'paymreqHeaderEdit-obj_po_id'
const _bc_id = 'paymreqHeaderEdit-obj_bc_id'
const _partner_id = 'paymreqHeaderEdit-obj_partner_id'
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
const _ppn_id = 'paymreqHeaderEdit-obj_ppn_id'
const _pph_id = 'paymreqHeaderEdit-obj_pph_id'

export function init_header(self, args) {
	// untuk keperluan cetak halaman

	const printContainer = document.getElementById('print-media-container')
	const origintalTitle = document.title

	pageHelper.setVisibility(`${_ppn_id}-container`, false)
	pageHelper.setVisibility(`${_pph_id}-container`, false)
	pageHelper.setVisibility(`${_paymreq_ppn}-container`, false)
	pageHelper.setVisibility(`${_paymreq_pph}-container`, false)


	window.addEventListener('beforeprint', (event) => {
		printContainer.classList.remove('hidden')
	});

	window.addEventListener('afterprint', (event) => {
		document.title = origintalTitle
		printContainer.classList.add('hidden')
	})
}


export function headerList_initSearchParams(self, SearchParams) {

	const onApproval = Context.variance == VAR_APPROVAL
	const onRejection = Context.variance == VAR_REJECTION
	const onView = Context.variance == VAR_VIEW
	const onEntry = Context.variance == ''

	// Structure
	SearchParams['struct_id'].addEventListener('selecting', async (evt) => {
		const cbo = evt.detail.sender
		const dialog = evt.detail.dialog
		const url = 'struct/header-list'
		const sort = { struct_name: 'desc' }
		const criteria = {}

		if (onApproval || onEntry) {
			criteria.user_id = Context.userId
		}

		cbo.wait()
		try {
			const result = await Module.apiCall(url, {
				sort,
				criteria,
				offset: evt.detail.offset,
				limit: evt.detail.limit,
			})

			for (var row of result.data) {
				evt.detail.addRow(row.struct_id, row.struct_name, row)
			}

			dialog.setNext(result.nextoffset, result.limit)
		} catch (err) {
			$fgta5.MessageBox.error(err.message)
		} finally {
			cbo.wait(false)
		}

	})
}

export function headerList_dataLoad(self, criteria, sort, evt) {
	if (DISABLE_FILTER_LIST) {
		return
	}


	if (Context.variance == VAR_APPROVAL) {
		criteria.iscommit = true
		criteria.isapproved = false
		criteria.user_id = Context.userId

		sort.isapproved = 'ASC'
		sort.paymreq_date = 'DESC'

	} else if (Context.variance == VAR_REJECTION) {
		criteria.iscommit = true
		criteria.isapproved = true

		sort.isapproved = 'DESC'
		sort.paymreq_date = 'DESC'

	} else if (Context.variance == VAR_VIEW) {
		sort.paymreq_date = 'DESC'

	} else {
		criteria.user_id = Context.userId
		sort.paymreq_date = 'DESC'

	}

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

	if (!paymreqtype.hasppn) {
		// reset data ppn
		frm.Inputs[_ppn_id].clear()
		frm.Inputs[_ppn_id].setSelected(null)
		frm.Inputs[_paymreq_ppn].value = 0
	}

	if (!paymreqtype.haspph) {
		// rest data pph
		frm.Inputs[_pph_id].clear()
		frm.Inputs[_pph_id].setSelected(null)
		frm.Inputs[_paymreq_pph].value = 0
	}

}

export async function obj_paymtype_id_selected(self, obj_paymtype_id, frm, evt) {
	if (!obj_paymtype_id.isSelectedChanged()) {
		return
	}

	const paymtype = evt.detail.data
	paymtype_changed(paymtype, frm)
}

export function obj_partner_id_selecting_criteria(self, obj_partner_id, frm, criteria, sort, evt) {
	criteria.partner_isdisabled = false
}


export async function obj_partner_id_selected(self, obj_partner_id, frm, evt) {
	if (!obj_partner_id.isSelectedChanged()) {
		return
	}

	const partner = evt.detail.data
	partner_changed(partner, frm)
}


export function obj_partnerbank_id_selecting_criteria(self, obj_partnerbank_id, frm, criteria, sort, evt) {
	const partner_id = frm.Inputs[_partner_id].value
	criteria.partner_id = partner_id ?? 1
	criteria.partnerbank_isdisabled = false
}

export async function obj_partnerbank_id_selected(self, obj_partnerbank_id, frm, evt) {
	if (!obj_partnerbank_id.isSelectedChanged()) {
		return
	}

	const partnerbank = evt.detail.data
	partnerbank_changed(partnerbank, frm)
}

export function obj_partnercontact_id_selecting_criteria(self, obj_partnercontact_id, frm, criteria, sort, evt) {
	console.log('SELECTING PARTNERCONTACT')
	const partner_id = frm.Inputs[_partner_id].value
	criteria.partner_id = partner_id ?? 1
	criteria.partnercontact_isdisabled = false
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

	const ppn = evt.detail.data
	ppn_changed(ppn, frm)
}


export async function obj_pph_id_selected(self, obj_pph_id, frm, evt) {
	if (!obj_pph_id.isSelectedChanged()) {
		return
	}

	const pph = evt.detail.data
	pph_changed(pph, frm)
}



export async function paymreqHeaderEdit_formOpened(self, frm, CurrentState) {
	const obj_paymreqtype_id = frm.Inputs[_paymreqtype_id]
	obj_paymreqtype_id.disabled = true

	const { paymtype, paymreqtype } = frm.getOriginalData()
	paymreqtype_changed(paymreqtype, frm)
	paymtype_changed(paymtype, frm)




	if (ALWAYS_ENABLE_ACTIONBUTTON === true) {
		CurrentState.Actions.newdata.suspend(false)
		CurrentState.Actions.edit.suspend(false)
		CurrentState.Actions.approve.suspend(false)
		CurrentState.Actions.reject.suspend(false)
		CurrentState.Actions.commit.suspend(false)
		CurrentState.Actions.uncommit.suspend(false)
		CurrentState.Actions.print.suspend(false)
		return
	}

	const iscommit = frm.Inputs[_iscommit].value
	const isapproved = frm.Inputs[_isapproved].value

	const onApproval = Context.variance == VAR_APPROVAL
	const onRejection = Context.variance == VAR_REJECTION
	const onView = Context.variance == VAR_VIEW
	const onEntry = Context.variance == ''



	CurrentState.Actions.newdata.suspend(onView || onApproval || onRejection)
	CurrentState.Actions.edit.suspend(onView || onApproval || onRejection || iscommit || isapproved)
	CurrentState.Actions.approve.suspend(onView || onEntry || onRejection || !iscommit || isapproved)
	CurrentState.Actions.reject.suspend(onView || onEntry || onApproval || !iscommit || !isapproved)
	CurrentState.Actions.commit.suspend(onView || onApproval || onRejection || iscommit || isapproved)
	CurrentState.Actions.uncommit.suspend(onView || onApproval || onRejection || !iscommit || isapproved)
	CurrentState.Actions.print.suspend(!iscommit)

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



export async function updateValues(self, data) {
	const moduleHeader = self.Modules.paymreqHeaderEdit
	const frm = moduleHeader.getForm()

	frm.Inputs[_paymreq_value].value = data.paymreq_value
	frm.Inputs[_paymreq_bill].value = data.paymreq_bill
	frm.Inputs[_paymreq_pph].value = data.paymreq_pph
	frm.Inputs[_paymreq_ppn].value = data.paymreq_ppn
	frm.Inputs[_paymreq_total].value = data.paymreq_total

	frm.acceptChanges()
	self.Modules.paymreqHeaderList.updateCurrentRow(self, { paymreq_bill: data.paymreq_bill })

}

export function setupActionButtonEvent(self, frm, CurrentState, buttons) {
	CurrentState.Actions.commit.addEventListener('click', (evt) => { btn_actionCommit_click(self, frm, CurrentState, evt) })
	CurrentState.Actions.uncommit.addEventListener('click', (evt) => { btn_actionUncommit_click(self, frm, CurrentState, evt) })
	CurrentState.Actions.approve.addEventListener('click', (evt) => { btn_actionApprove_click(self, frm, CurrentState, evt) })
	CurrentState.Actions.reject.addEventListener('click', (evt) => { btn_actionReject_click(self, frm, CurrentState, evt) })
	CurrentState.Actions.print.addEventListener('click', (evt) => { btn_actionPrint_click(self, frm, CurrentState, evt) })


	const onApproval = Context.variance == VAR_APPROVAL
	const onRejection = Context.variance == VAR_REJECTION
	const onView = Context.variance == VAR_VIEW
	const onEntry = Context.variance == ''

	CurrentState.Actions.newdata.suspend(onApproval || onRejection | onView)

	if (ALWAYS_SHOW_ACTIONBUTTON === true) {
		return
	}

	CurrentState.Actions.newdata.hide(onApproval || onRejection || onView)
	CurrentState.Actions.commit.hide(onApproval || onRejection || onView)
	CurrentState.Actions.uncommit.hide(onApproval || onRejection || onView)
	CurrentState.Actions.approve.hide(onRejection || onView || onEntry)
	CurrentState.Actions.reject.hide(onApproval || onView || onEntry)
}


async function btn_actionCommit_click(self, frm, CurrentState, evt) {
	const paymreq_id = frm.Inputs[_paymreq_id].value
	const paymreq_doc = frm.Inputs[_paymreq_doc].value

	// konfirmasi kommit
	const ret = await $fgta5.MessageBox.confirm(`anda mau <b>Commit</b> request '${paymreq_doc}'.<br>Lanjutkan?`)
	if (ret !== 'ok') {
		return;
	}


	const obj_iscommit = frm.Inputs[_iscommit]
	try {
		const url = 'paymreq/execute'
		const result = await Module.apiCall(url, {
			fnName: 'commit',
			paymreq_id: paymreq_id
		})

		if (result.iscommit == false) {
			throw new Error('<b>Gagal</b> saat proses commit')
		}

		// check unchanged status
		if (result.unchanged) {
			console.warn('already commited. Data unchanged')
			return
		}

		// check commit status
		obj_iscommit.value = result.iscommit
		frm.acceptChanges()

		self.Modules.paymreqHeaderList.updateCurrentRow(self, { iscommit: result.iscommit })

		CurrentState.Actions.edit.suspend(true)
		CurrentState.Actions.commit.suspend(true)
		CurrentState.Actions.uncommit.suspend(false)
		CurrentState.Actions.print.suspend(false)

		$fgta5.MessageBox.info(`request '${paymreq_doc}' berhasil di commit`)
	} catch (err) {
		$fgta5.MessageBox.error(err.message)
		throw err
	}
}

async function btn_actionUncommit_click(self, frm, CurrentState, evt) {
	const paymreq_id = frm.Inputs[_paymreq_id].value
	const paymreq_doc = frm.Inputs[_paymreq_doc].value

	// konfirmasi kommit
	const ret = await $fgta5.MessageBox.confirm(`anda mau <span style="font-weight:bold; color:red">un-Commit</span> request '${paymreq_doc}'.<br>Lanjutkan?`)
	if (ret !== 'ok') {
		return;
	}


	const obj_paymreq_version = frm.Inputs[_paymreq_version]
	const obj_iscommit = frm.Inputs[_iscommit]
	try {
		const url = 'paymreq/execute'
		const result = await Module.apiCall(url, {
			fnName: 'uncommit',
			paymreq_id: paymreq_id
		})

		if (result.iscommit == true) {
			throw new Error('<b>Gagal</b> saat proses un-commit')
		}

		// check unchanged status
		if (result.unchanged) {
			console.warn('still draft. Data unchanged')
			return
		}

		// uncheck commit status
		obj_iscommit.value = result.iscommit

		// update version
		obj_paymreq_version.value = result.version


		frm.acceptChanges()
		self.Modules.paymreqHeaderList.updateCurrentRow(self, { iscommit: result.iscommit })


		CurrentState.Actions.edit.suspend(false)
		CurrentState.Actions.commit.suspend(false)
		CurrentState.Actions.uncommit.suspend(true)
		CurrentState.Actions.print.suspend(true)

		$fgta5.MessageBox.info(`request '${paymreq_doc}' berhasil di un-commit`)
	} catch (err) {
		$fgta5.MessageBox.error(err.message)
		throw err
	}

}

async function btn_actionApprove_click(self, frm, CurrentState, evt) {
	const paymreq_id = frm.Inputs[_paymreq_id].value
	const paymreq_doc = frm.Inputs[_paymreq_doc].value

	// konfirmasi kommit
	const ret = await $fgta5.MessageBox.confirm(`anda mau <b>Approve</b> request '${paymreq_doc}'. lanjutkan?`)
	if (ret !== 'ok') {
		return;
	}

	const obj_isapproved = frm.Inputs[_isapproved]
	try {
		const url = 'paymreq/execute'
		const result = await Module.apiCall(url, {
			fnName: 'approve',
			paymreq_id: paymreq_id
		})

		if (result.isapproved == false) {
			throw new Error('<b>Gagal</b> saat proses approved')
		}

		// check unchanged status
		if (result.unchanged) {
			console.warn('already approved. Data unchanged')
			return
		}

		obj_isapproved.value = result.isapproved
		frm.acceptChanges()

		self.Modules.paymreqHeaderList.updateCurrentRow(self, { isapproved: result.isapproved })


		CurrentState.Actions.approve.suspend(true)
		CurrentState.Actions.reject.suspend(false)

		$fgta5.MessageBox.info(`request '${paymreq_doc}' berhasil di approved`)
	} catch (err) {
		$fgta5.MessageBox.error(err.message)
		throw err
	}
}

async function btn_actionReject_click(self, frm, CurrentState, evt) {
	const paymreq_id = frm.Inputs[_paymreq_id].value
	const paymreq_doc = frm.Inputs[_paymreq_doc].value

	// konfirmasi kommit
	const rejectMessage = await $fgta5.MessageBox.ask(`<div class="fgta5-messagebox-questdiv">anda mau <span style="font-weight:bold; color:red">Reject</span> request '${paymreq_doc}'</div>Alasan reject?`)
	if (rejectMessage == null) {
		return;
	}


	const obj_isapproved = frm.Inputs[_isapproved]
	try {
		const url = 'paymreq/execute'
		const result = await Module.apiCall(url, {
			fnName: 'reject',
			paymreq_id: paymreq_id,
			rejectMessage: rejectMessage
		})

		if (result.isapproved == true) {
			throw new Error('<b>Gagal</b> saat proses reject')
		}

		// check unchanged status
		if (result.unchanged) {
			console.warn('already in un-approved status. Data unchanged')
			return
		}

		obj_isapproved.value = result.isapproved
		frm.acceptChanges()

		self.Modules.paymreqHeaderList.updateCurrentRow(self, { isapproved: result.isapproved })

		CurrentState.Actions.approve.suspend(false)
		CurrentState.Actions.reject.suspend(true)

		$fgta5.MessageBox.info(`request '${paymreq_doc}' berhasil di reject`)
	} catch (err) {
		$fgta5.MessageBox.error(err.message)
		throw err
	}
}


async function btn_actionPrint_click(self, frm, CurrentState, evt) {
	evt.preventDefault();
	evt.stopPropagation();

	const printArea = document.getElementById('print-area')
	const paymreq_id = frm.Inputs[_paymreq_id].value
	const paymreq_doc = frm.Inputs[_paymreq_doc].value
	const iscommit = frm.Inputs[_iscommit].value

	if (iscommit) {
		await printDocument(self, printArea, paymreq_id)
		window.print();
	} else {
		printArea.innerHTML = `document ${paymreq_doc} belum di-commit`
	}
}

function paymreqtype_changed(paymreqtype, frm) {
	pageHelper.setVisibility(`${_paymreq_invoice}-container`, paymreqtype.hasinvoice)
	pageHelper.setVisibility(`${_ffl_id}-container`, paymreqtype.hasffl)
	pageHelper.setVisibility(`${_po_id}-container`, paymreqtype.haspo)
	pageHelper.setVisibility(`${_bc_id}-container`, paymreqtype.hasbc)
	pageHelper.setVisibility(`${_bc_id}-container`, paymreqtype.hasbc)
	pageHelper.setVisibility(`${_ppn_id}-container`, paymreqtype.hasppn)
	pageHelper.setVisibility(`${_pph_id}-container`, paymreqtype.haspph)
	pageHelper.setVisibility(`${_paymreq_ppn}-container`, paymreqtype.hasppn)
	pageHelper.setVisibility(`${_paymreq_pph}-container`, paymreqtype.haspph)



	frm.Inputs[_paymreq_invoice].markAsRequired(paymreqtype.hasinvoice)
	frm.Inputs[_ffl_id].markAsRequired(paymreqtype.fflismandatory)
	frm.Inputs[_po_id].markAsRequired(paymreqtype.poismandatory)
	frm.Inputs[_bc_id].markAsRequired(paymreqtype.bcismandatory)
}

function paymtype_changed(paymtype, frm) {
	pageHelper.setVisibility(`${_partnerbank_id}-container`, paymtype.ishaspartnerbankselector)
	pageHelper.setVisibility(`${_partnercontact_id}-container`, paymtype.ishaspartnercontact)
	pageHelper.setVisibility(`${_partnerbank_account}-container`, paymtype.ishasbankaccount)
	pageHelper.setVisibility(`${_partnerbank_accountname}-container`, paymtype.ishasbankaccountname)
	pageHelper.setVisibility(`${_partnerbank_bankname}-container`, paymtype.ishasbankname)

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


function ppn_changed(ppn, frm) {
	const taxtype_value = ppn.taxtype_value ?? 0
	const obj_paymreq_value = frm.Inputs[_paymreq_value]
	const obj_paymreq_ppn = frm.Inputs[_paymreq_ppn]

	const value = Number(obj_paymreq_value.value)
	const ppnPercent = Number(taxtype_value)
	const ppnValue = (ppnPercent / 100) * value

	obj_paymreq_ppn.value = ppnValue

	tax_changed(frm)
}


function pph_changed(pph, frm) {
	const taxtype_value = pph.taxtype_value ?? 0
	const obj_paymreq_value = frm.Inputs[_paymreq_value]
	const obj_paymreq_pph = frm.Inputs[_paymreq_pph]

	const value = Number(obj_paymreq_value.value)
	const pphPercent = Number(taxtype_value)
	const pphValue = (pphPercent / 100) * value

	obj_paymreq_pph.value = pphValue

	tax_changed(frm)

}

function tax_changed(frm) {
	const obj_paymreq_value = frm.Inputs[_paymreq_value]
	const obj_paymreq_ppn = frm.Inputs[_paymreq_ppn]
	const obj_paymreq_pph = frm.Inputs[_paymreq_pph]
	const obj_paymreq_bill = frm.Inputs[_paymreq_bill]
	const obj_paymreq_total = frm.Inputs[_paymreq_total]

	const value = Number(obj_paymreq_value.value)
	const ppn = Number(obj_paymreq_ppn.value)
	const pph = Number(obj_paymreq_pph.value)

	const bill = value + ppn
	const total = bill - pph

	obj_paymreq_bill.value = bill
	obj_paymreq_total.value = total

}