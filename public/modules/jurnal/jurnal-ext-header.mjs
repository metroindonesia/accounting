import Context from './jurnal-context.mjs'
import * as jurnalHelper from './jurnal-helper.mjs'
import * as pageHelper from '/public/lib/webmodule/pagehelper.mjs'
import { printDocument } from './jurnal-print.mjs'
import { setupSearchPeriode, setupSearchJurnaltype } from './jurnal-ext-search.mjs'


const _jurnal_id = 'jurnalHeaderEdit-obj_jurnal_id'
const _jurnal_doc = 'jurnalHeaderEdit-obj_jurnal_doc'
const _iscommit = 'jurnalHeaderEdit-obj_iscommit'
const _ispost = 'jurnalHeaderEdit-obj_ispost'
const _jurnal_version = 'jurnalHeaderEdit-obj_jurnal_version'
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


let currentPeriode = { periode_id: null, periode_name: null, periode_start: null, periode_end: null }
let selectedPeriode = {}
let selectedJurnaltype = {
	jurnaltype_id: null,
	jurnaltype_name: ''
}


export async function init_header(self, args) {
	const jurnalHeaderEdit = self.Modules.jurnalHeaderEdit;
	const frm = jurnalHeaderEdit.getForm();



	frm.Inputs[_paymreq_id].markAsRequired(false)
	frm.Inputs[_paymtype_id].markAsRequired(false)
	frm.Inputs[_partner_id].markAsRequired(false)
	frm.Inputs[_partnerbank_id].markAsRequired(false)
	frm.Inputs[_payment_bgno].markAsRequired(false)
	frm.Inputs[_partnerbank_account].markAsRequired(false)
	frm.Inputs[_partnerbank_bankname].markAsRequired(false)
	frm.Inputs[_partnerbank_accountname].markAsRequired(false)
	frm.Inputs[_coa_id].markAsRequired(false)

	/*	
		const btnUnpost = document.getElementById('jurnalHeaderEdit-btn_actionUnpost')
		const btnPost = document.getElementById('jurnalHeaderEdit-btn_actionPost')
		const CurrentState = jurnalHeaderEdit.getCurrentState()
		const variance = Context.variance
		if (variance == 'posting') {
			CurrentState.Actions.commit.hide(true)
			CurrentState.Actions.uncommit.hide(true)
			CurrentState.Actions.post.hide(false)
			CurrentState.Actions.unpost.hide(true)
			btnPost.style.marginLeft = 'auto';
			btnPost.style.order = '5';
		} else if (variance == 'unposting') {
			CurrentState.Actions.commit.hide(true)
			CurrentState.Actions.uncommit.hide(true)
			CurrentState.Actions.post.hide(true)
			CurrentState.Actions.unpost.hide(false)
			btnUnpost.style.marginLeft = 'auto';
			btnUnpost.style.order = '5';
		} else {
			CurrentState.Actions.commit.hide(false)
			CurrentState.Actions.uncommit.hide(false)
			CurrentState.Actions.post.hide(true)
			CurrentState.Actions.unpost.hide(true)
		}
	*/


	if (Context.setting.currentPeriode != null) {
		currentPeriode.periode_id = Context.setting.currentPeriode.periode_id
		currentPeriode.periode_name = Context.setting.currentPeriode.periode_name
		currentPeriode.periode_start = Context.setting.currentPeriode.periode_start
		currentPeriode.periode_end = Context.setting.currentPeriode.periode_end
		Object.assign(selectedPeriode, currentPeriode)
	}


	// untuk keperluan printing
	{
		const origintalTitle = document.title
		const printContainer = document.getElementById('print-media-container')
		window.addEventListener('beforeprint', (event) => {
			printContainer.classList.remove('hidden')
		});

		window.addEventListener('afterprint', (event) => {
			document.title = origintalTitle
			printContainer.classList.add('hidden')
		})
	}


	const tblHeader = document.getElementById('jurnalHeaderList-tbl')
	const tdStatus = tblHeader.querySelector('th[data-name="ispost"]')
	tdStatus.innerHTML = "Status"

	// tambahkan legend di bawah table list header
	// {
	// 	const target = document.getElementById('jurnalHeaderList-foot')
	// 	const tpl = document.getElementById('tpl-jurnal-status-legend')
	// 	if (tpl != null) {
	// 		const clone = tpl.content.cloneNode(true); // salin isi template
	// 		const divLegend = clone.querySelector('div')
	// 		target.appendChild(divLegend);
	// 	}
	// }
}

export function headerList_initSearchParams(self, SearchParams) {
	setupSearchPeriode(self, SearchParams['periode_id'])
	setupSearchJurnaltype(self, SearchParams['jurnaltype_id'])
}

export function setupActionButtonEvent(self, frm, CurrentState, buttons) {
	CurrentState.Actions.commit.addEventListener('click', (evt) => { btn_actionCommit_click(self, frm, CurrentState, evt) })
	CurrentState.Actions.uncommit.addEventListener('click', (evt) => { btn_actionUncommit_click(self, frm, CurrentState, evt) })
	CurrentState.Actions.post.addEventListener('click', (evt) => { btn_actionPost_click(self, frm, CurrentState, evt) })
	CurrentState.Actions.unpost.addEventListener('click', (evt) => { btn_actionUnpost_click(self, frm, CurrentState, evt) })
	CurrentState.Actions.print.addEventListener('click', (evt) => { btn_actionPrint_click(self, frm, CurrentState, evt) })

}

export function headerList_dataLoad(self, criteria, sort, evt) {
	sort.jurnal_date = 'DESC'

	if (Context.variance == 'posting') {
		criteria.iscommit = true
		criteria.ispost = false
	} else if (Context.variance == 'unposting') {
		criteria.ispost = true
	} else if (Context.variance == 'view') {
	} else {
	}

}

export function headerList_addTableEvents(self, tbl) {
	tbl.addEventListener('rowrender', (evt) => {

		const tr = evt.detail.tr
		const data = evt.detail.args.data

		const tdStatus = tr.querySelector('[binding="ispost"]')
		tdStatus.innerHTML = `
			<div class="status-label" name="unbalance">unbalance</div>
			<div class="status-label" name="commit">committed</div>
			<div class="status-label" name="posted">posted</div>
		`


		let isDraft = true
		let unbalance = isUnbalance(data.balance_value, data.balance_idr)
		if (unbalance) {
			tr.setAttribute('data-isunbalance', true)
			tr.classList.add('row-unbalance')
		} else {
			tr.removeAttribute('data-isunbalance')
			tr.classList.remove('row-unbalance')
		}

		if (data.iscommit !== undefined) {
			if (data.iscommit === true) {
				tr.setAttribute('data-iscommit', true)
				tr.classList.add('row-commit')
				isDraft = false
			} else {
				tr.removeAttribute('data-iscommit')
				tr.classList.remove('row-commit')
			}
		}

		if (data.ispost !== undefined) {
			if (data.ispost === true) {
				tr.setAttribute('data-isposted', true)
				tr.classList.add('row-posted')
				isDraft = false
			} else {
				tr.removeAttribute('data-isposted')
				tr.classList.remove('row-posted')
			}
		}

		if (isDraft) {
			tr.setAttribute('data-isdraft', true)
			tr.classList.add('row-draft')
		} else {
			tr.removeAttribute('data-isdraft')
			tr.classList.remove('row-draft')
		}


	})
}

export async function jurnalHeaderEdit_formOpened(self, frm, CurrentState) {
	disableJurnaltype(frm, true) // user tidak bisa memilih jurnaltype untuk data yang sudah disimpan
	disablePaymreq(frm, true)


	const {
		jurnaltype, paymtype, periode, iscommit, ispost,
		_commitby, _commitdate, _postby, _postdate,
		isallowposting, isallowunposting,
		balance_value, balance_idr
	} = frm.getOriginalData()


	selectedJurnaltype = jurnaltype

	jurnaltype_changed(self, jurnaltype, frm)
	paymtype_changed(self, paymtype, frm)

	const periode_isclosed = periode.periode_isclosed
	selectedPeriode.periode_start = periode.periode_start
	selectedPeriode.periode_end = periode.periode_end


	CurrentState.Actions.print.suspend(!iscommit)
	CurrentState.Actions.edit.suspend(periode_isclosed || iscommit || ispost)
	CurrentState.Actions.commit.suspend(periode_isclosed || iscommit)
	CurrentState.Actions.uncommit.suspend(periode_isclosed || !iscommit || ispost)
	CurrentState.Actions.post.suspend(periode_isclosed || !iscommit || ispost || !isallowposting)
	CurrentState.Actions.unpost.suspend(periode_isclosed || !ispost || !isallowunposting)

	updateDetilInfo_balance(self, balance_value, balance_idr)

}

export async function jurnalHeaderEdit_newData(self, datainit, frm) {
	disableJurnaltype(frm, false)  // aktifkan kembali jurnaltype saat membuat data baru
	disablePaymreq(frm, false)

	// set default currency
	datainit.curr_id = { value: Context.setting.defaultCurr.id, text: Context.setting.defaultCurr.name }
	if (currentPeriode.periode_id != null) {
		datainit.periode_id = { value: currentPeriode.periode_id, text: currentPeriode.periode_name }
		Object.assign(selectedPeriode, currentPeriode)
	}

	// jurnaltype_changed(self, {}, frm)
	datainit.jurnaltype_id = { value: selectedJurnaltype.jurnaltype_id, text: selectedJurnaltype.jurnaltype_name }
	jurnaltype_changed(self, selectedJurnaltype, frm)

	paymtype_changed(self, {}, frm)
	updateDetilInfo_balance(self, 0, 0)

	const CurrentState = self.Modules.jurnalHeaderEdit.getCurrentState()
	CurrentState.Actions.print.suspend(true)
	CurrentState.Actions.commit.suspend(false)
	CurrentState.Actions.uncommit.suspend(true)
	CurrentState.Actions.post.suspend(true)
	CurrentState.Actions.unpost.suspend(true)

}

export async function jurnalHeaderEdit_dataSaving(self, dataToSave, frm, args) {
	// cek periode vs tanggal
	const jurnal_date = new Date(frm.Inputs[_jurnal_date].value)
	const jurnal_datedue = new Date(frm.Inputs[_jurnal_datedue].value)
	const periode_start = new Date(selectedPeriode.periode_start)
	const periode_end = new Date(selectedPeriode.periode_end)


	try {


		const obj_jurnal_datedue = frm.Inputs[_jurnal_datedue]
		const elDuedate = document.getElementById(`${_jurnal_datedue}-container`)
		const hasDuedate = !elDuedate.classList.contains('hidden')

		if (hasDuedate) {
			if (jurnal_datedue < jurnal_date) {
				// 'due date tidak boleh lebih lampau dari jurnal date'
				throw new Error('due date tidak boleh lebih lampau dari jurnal date')

				// const res = await $fgta5.MessageBox.confirm('Due date lebih lampau dari book date!<br>Lanjutkan?')
				// if (res != 'ok') {
				// 	args.cancelSave = true
				// 	return
				// }
			}
		} else {
			// jika tidak punya duedate, nilai duedate disamakan dengan bookdate
			obj_jurnal_datedue.value = jurnal_date
			dataToSave.jurnal_datedue = jurnal_date

		}


		if (jurnal_date < periode_start || jurnal_date > periode_end) {
			throw new Error('tanggal buku tidak sesuai dengan periode')
		}


	} catch (err) {
		args.cancelSave = true
		$fgta5.MessageBox.warning(err.message)
	}

	// console.log(jurnal_date, jurnal_datedue, selectedPeriode)
	console.log(selectedPeriode)

}

export async function jurnalHeaderEdit_dataSaved(self, data, frm) {
	disableJurnaltype(frm, true)  // user tidak bisa memilih jurnaltype untuk data yang sudah disimpan
	disablePaymreq(frm, true)
	updateDetilInfo_balance(self, data.balance_value, data.balance_idr)
}

export async function obj_paymtype_id_selected(self, obj_paymtype_id, frm, evt) {
	if (!obj_paymtype_id.isSelectedChanged()) {
		return
	}
	const paymtype = evt.detail.data
	paymtype_changed(self, paymtype, frm)
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
	selectedJurnaltype = jurnaltype
	jurnaltype_changed(self, jurnaltype, frm)
	paymtype_changed(self, {}, frm)

	// reset paymreq
	const obj_paymreq_id = frm.Inputs[_paymreq_id]
	obj_paymreq_id.clear()
	obj_paymreq_id.setSelected(null)

}


export function obj_paymreq_id_selecting_criteria(self, obj_paymreq_id, frm, criteria, sort, evt) {
	const jurnal_id = frm.Inputs[_jurnal_id].value
	const jurnaltype_id = frm.Inputs[_jurnaltype_id].value

	criteria.isapproved = true
	criteria.jurnaltype_id = jurnaltype_id
	criteria.current_jurnal_id = jurnal_id
}

export async function obj_paymreq_id_populating(self, obj_paymreq_id, frm, evt) {
	const { tr, data, text } = evt.detail

	const td = tr.querySelector('td')
	td.classList.add('paymreq-row')

	const divDoc = document.createElement('div')
	divDoc.innerHTML = data.outstanding_doc
	divDoc.classList.add('paymreq-row-doc')

	const divDescr = document.createElement('div')
	divDescr.innerHTML = data.outstanding_descr
	divDescr.classList.add('paymreq-row-descr')

	const divValue = document.createElement('div')
	divValue.innerHTML = pageHelper.formatNumber(data.outstanding_value)
	divValue.classList.add('paymreq-row-value')

	const divCurr = document.createElement('div')
	divCurr.innerHTML = data.curr_name
	divCurr.classList.add('paymreq-row-value')
	divCurr.setAttribute('name', 'curr_id')


	td.innerHTML = ''
	td.appendChild(divDoc)
	td.appendChild(divDescr)
	td.appendChild(divValue)
	td.appendChild(divCurr)
}

export async function obj_paymreq_id_selected(self, obj_paymreq_id, frm, evt) {
	if (!obj_paymreq_id.isSelectedChanged()) {
		return
	}

	const paymreq = evt.detail.data
	paymreq_changed(self, paymreq, frm)

}


export async function obj_periode_id_selected(self, obj_periode_id, frm, evt) {
	if (!obj_periode_id.isSelectedChanged()) {
		return
	}
	const periode = evt.detail.data
	selectedPeriode.periode_start = periode.periode_start
	selectedPeriode.periode_end = periode.periode_end

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



export function obj_struct_id_selecting_criteria(self, obj_struct_id, frm, criteria, sort, evt) {
	criteria.struct_isdisabled = false
}

export function obj_site_id_selecting_criteria(self, obj_site_id, frm, criteria, sort, evt) {
	criteria.site_isdisabled = false
}

export function obj_unit_id_selecting_criteria(self, obj_unit_id, frm, criteria, sort, evt) {
	criteria.unit_isdisabled = false
}


export function obj_coa_id_selecting_criteria(self, obj_coa_id, frm, criteria, sort, evt) {
	const jurnaltype_id = frm.Inputs[_jurnaltype_id].value
	const copyto = frm.Inputs[_copyto].value


	evt.detail.url = 'coa-filtered/list-by-jurnaltype'

	criteria.jurnaltype_id = jurnaltype_id
	criteria.coa_isdisabled = false

	if (copyto == 'D') {
		criteria.isdebet = true
	}

	if (copyto == 'K') {
		criteria.iskredit = true
	}

	const obj_curr_id = frm.Inputs[_curr_id]
	if (obj_curr_id.disabled) {
		// jika currencty disabled, maka cari coa yang currencynya sama atau null
		criteria.curr_id = obj_curr_id.value
	}

	// arahkan api ke endpoint coa-filtered/list-by-jurnaltype
}


export async function obj_coa_id_populating(self, obj_coa_id, frm, evt) {
	jurnalHelper.coa_id_populating(self, obj_coa_id, frm, evt, 'header')
}



export async function obj_coa_id_selected(self, obj_coa_id, frm, evt) {
	if (!obj_coa_id.isSelectedChanged()) {
		return
	}

	const { curr_id } = evt.detail.data
	frm.Inputs[_coacurr].value = curr_id


	if (curr_id != null) {
		if (frm.Inputs[_curr_id].value != curr_id) {
			frm.Inputs[_curr_id].clear()
			frm.Inputs[_curr_id].setSelected(null, '')
			frm.Inputs[_curr_rate].value = 1
		}
	}
}

export function obj_curr_id_selecting_criteria(self, obj_curr_id, frm, criteria, sort, evt) {
	const curr_id = frm.Inputs[_coacurr].value
	const bookdate = frm.Inputs[_jurnal_date].value
	criteria.curr_date = bookdate

	if (curr_id != '') {
		criteria.curr_id = curr_id
	}

	sort.curr_code = 'asc'
}

export async function obj_curr_id_populating(self, obj_curr_id, frm, evt) {
	jurnalHelper.curr_id_populating(self, obj_curr_id, frm, evt, 'detil')
}



export async function obj_curr_id_selected(self, obj_curr_id, frm, evt) {
	const { data } = evt.detail
	frm.Inputs[_curr_rate].value = data.curr_rate
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

export function updateDetilInfo_balance(self, balance_value, balance_idr) {
	const el_tabdetil = document.getElementById('jurnalHeaderEdit-info-detil-row')
	const el_datainfo = el_tabdetil.querySelector('div[data-info]')
	el_datainfo.innerHTML = pageHelper.formatDecimal(balance_idr)

	const balance = Number(balance_idr)
	if (balance != 0) {
		el_datainfo.classList.add('unbalance-text')
	} else {
		el_datainfo.classList.remove('unbalance-text')
	}
}

export function updateList_balance(self, balance_value, balance_idr) {
	self.Modules.jurnalHeaderList.updateCurrentRow(self, { balance_value, balance_idr })
}

export function setSelectedJurnaltype(jurnaltype, frm) {
	selectedJurnaltype = jurnaltype

	paymtype_changed(self, {}, frm)

	// reset paymreq
	const obj_paymreq_id = frm.Inputs[_paymreq_id]
	obj_paymreq_id.clear()
	obj_paymreq_id.setSelected(null)
}

async function btn_actionCommit_click(self, frm, CurrentState, evt) {
	const jurnal_id = frm.Inputs[_jurnal_id].value
	const jurnal_doc = frm.Inputs[_jurnal_doc].value

	// konfirmasi kommit
	const ret = await $fgta5.MessageBox.confirm(`anda mau <b>Commit</b> jurnal '${jurnal_doc}'.<br>Lanjutkan?`)
	if (ret !== 'ok') {
		return;
	}


	const obj_iscommit = frm.Inputs[_iscommit]
	try {
		const url = 'jurnal/execute'
		const result = await Module.apiCall(url, {
			fnName: 'commit',
			jurnal_id: jurnal_id
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

		self.Modules.jurnalHeaderList.updateCurrentRow(self, { iscommit: result.iscommit })

		CurrentState.Actions.edit.suspend(true)
		CurrentState.Actions.commit.suspend(true)
		CurrentState.Actions.uncommit.suspend(false)
		CurrentState.Actions.post.suspend(false)
		CurrentState.Actions.unpost.suspend(true)
		CurrentState.Actions.print.suspend(false)

		$fgta5.MessageBox.info(`jurnal '${jurnal_doc}' berhasil di commit`)
	} catch (err) {
		$fgta5.MessageBox.error(err.message)
		throw err
	}
}


async function btn_actionUncommit_click(self, frm, CurrentState, evt) {
	const jurnal_id = frm.Inputs[_jurnal_id].value
	const jurnal_doc = frm.Inputs[_jurnal_doc].value

	// konfirmasi kommit
	const ret = await $fgta5.MessageBox.confirm(`anda mau <span style="font-weight:bold; color:red">un-Commit</span> jurnal '${jurnal_doc}'.<br>Lanjutkan?`)
	if (ret !== 'ok') {
		return;
	}


	const obj_jurnal_version = frm.Inputs[_jurnal_version]
	const obj_iscommit = frm.Inputs[_iscommit]
	try {
		const url = 'jurnal/execute'
		const result = await Module.apiCall(url, {
			fnName: 'uncommit',
			jurnal_id: jurnal_id
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
		obj_jurnal_version.value = result.version


		frm.acceptChanges()
		self.Modules.jurnalHeaderList.updateCurrentRow(self, { iscommit: result.iscommit })


		CurrentState.Actions.edit.suspend(false)
		CurrentState.Actions.commit.suspend(false)
		CurrentState.Actions.uncommit.suspend(true)
		CurrentState.Actions.post.suspend(true)
		CurrentState.Actions.unpost.suspend(true)
		CurrentState.Actions.print.suspend(true)

		$fgta5.MessageBox.info(`jurnal '${jurnal_doc}' berhasil di un-commit`)
	} catch (err) {
		$fgta5.MessageBox.error(err.message)
		throw err
	}
}


async function btn_actionPost_click(self, frm, CurrentState, evt) {
	const jurnal_id = frm.Inputs[_jurnal_id].value
	const jurnal_doc = frm.Inputs[_jurnal_doc].value

	// konfirmasi kommit
	const ret = await $fgta5.MessageBox.confirm(`anda mau <b>Posting</b> jurnal '${jurnal_doc}'. lanjutkan?`)
	if (ret !== 'ok') {
		return;
	}

	const obj_ispost = frm.Inputs[_ispost]
	try {
		const url = 'jurnal/execute'
		const result = await Module.apiCall(url, {
			fnName: 'post',
			jurnal_id: jurnal_id
		})

		if (result.ispost == false) {
			throw new Error('<b>Gagal</b> saat proses posting')
		}

		// check unchanged status
		if (result.unchanged) {
			console.warn('already posted. Data unchanged')
			return
		}

		obj_ispost.value = result.ispost
		frm.acceptChanges()

		self.Modules.jurnalHeaderList.updateCurrentRow(self, { ispost: result.ispost })


		CurrentState.Actions.edit.suspend(true)
		CurrentState.Actions.commit.suspend(true)
		CurrentState.Actions.uncommit.suspend(true)
		CurrentState.Actions.post.suspend(true)
		CurrentState.Actions.unpost.suspend(false)
		CurrentState.Actions.print.suspend(false)

		$fgta5.MessageBox.info(`jurnal '${jurnal_doc}' berhasil di posting`)
	} catch (err) {
		$fgta5.MessageBox.error(err.message)
		throw err
	}
}


async function btn_actionUnpost_click(self, frm, CurrentState, evt) {
	const jurnal_id = frm.Inputs[_jurnal_id].value
	const jurnal_doc = frm.Inputs[_jurnal_doc].value

	// konfirmasi kommit
	const upostMessage = await $fgta5.MessageBox.ask(`<div class="fgta5-messagebox-questdiv">anda mau <span style="font-weight:bold; color:red">Un-Posting</span> jurnal '${jurnal_doc}'</div>Alasan unpost?`)
	if (upostMessage == null) {
		return;
	}


	const obj_ispost = frm.Inputs[_ispost]
	try {
		const url = 'jurnal/execute'
		const result = await Module.apiCall(url, {
			fnName: 'unpost',
			jurnal_id: jurnal_id,
			upostMessage: upostMessage
		})

		if (result.ispost == true) {
			throw new Error('<b>Gagal</b> saat proses unposting')
		}

		// check unchanged status
		if (result.unchanged) {
			console.warn('already in un-post status. Data unchanged')
			return
		}

		obj_ispost.value = result.ispost
		frm.acceptChanges()

		self.Modules.jurnalHeaderList.updateCurrentRow(self, { ispost: result.ispost })

		CurrentState.Actions.edit.suspend(true)
		CurrentState.Actions.commit.suspend(true)
		CurrentState.Actions.uncommit.suspend(false)
		CurrentState.Actions.post.suspend(false)
		CurrentState.Actions.unpost.suspend(true)
		CurrentState.Actions.print.suspend(false)

		$fgta5.MessageBox.info(`jurnal '${jurnal_doc}' berhasil di unposting`)
	} catch (err) {
		$fgta5.MessageBox.error(err.message)
		throw err
	}
}


async function btn_actionPrint_click(self, frm, CurrentState, evt) {
	evt.preventDefault();
	evt.stopPropagation();

	const printArea = document.getElementById('print-area')
	const jurnal_id = frm.Inputs[_jurnal_id].value
	const jurnal_doc = frm.Inputs[_jurnal_doc].value
	const iscommit = frm.Inputs[_iscommit].value

	console.log(selectedJurnaltype)

	const { jurnaltype_printout } = selectedJurnaltype
	if (iscommit) {
		await printDocument(self, printArea, jurnal_id, jurnaltype_printout)
		window.print();
	} else {
		printArea.innerHTML = `document ${jurnal_doc} belum di-commit`
	}
}

function disableJurnaltype(frm, disabled) {
	const obj_jurnaltype_id = frm.Inputs[_jurnaltype_id]
	obj_jurnaltype_id.disabled = disabled
}

function disablePaymreq(frm, disabled) {
	const obj_paymreq_id = frm.Inputs[_paymreq_id]
	obj_paymreq_id.disabled = disabled

}


function jurnaltype_changed(self, jurnaltype, frm) {
	if (jurnaltype == null) {
		jurnaltype = {}
	}


	// informasikan juga ke detil soal perubahan jurnaltype
	self.Modules.extenderDetil.headerJurnaltype_changed(self, jurnaltype, frm)



	// due date
	const obj_jurnal_datedue = frm.Inputs[_jurnal_datedue]
	obj_jurnal_datedue.disabled = !jurnaltype.isheadallowchangeduedate
	pageHelper.setVisibility(`${_jurnal_datedue}-container`, jurnaltype.isheadhasduedate)

	// copyto
	const obj_copyto = frm.Inputs[_copyto]
	obj_copyto.value = jurnaltype.jurnaltype_headcopyto
	const jurnaltype_headcopyto = jurnaltype.jurnaltype_headcopyto ?? ''
	pageHelper.setVisibility(`${_copyto}-container`, jurnaltype_headcopyto.trim() != '')


	// payment req
	const obj_paymreq_id = frm.Inputs[_paymreq_id]
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
	const obj_curr_id = frm.Inputs[_curr_id]
	const obj_jurnal_value = frm.Inputs[_jurnal_value]
	obj_curr_id.disabled = !jurnaltype.isheadallowselectcurr
	obj_jurnal_value.disabled = !jurnaltype.isheadallowchangevalue
	pageHelper.setVisibility(`${_jurnal_idr}-container`, jurnaltype.isheadhasvalue)
	pageHelper.setVisibility(`${_jurnal_value}-container`, jurnaltype.isheadhasvalue)
	pageHelper.setVisibility(`${_curr_id}-container`, jurnaltype.isheadhasvalue)
	pageHelper.setVisibility(`${_curr_rate}-container`, jurnaltype.isheadhasvalue)
	pageHelper.setVisibility(`${_coacurr}-container`, jurnaltype.isheadhasvalue)

	if (!jurnaltype.isheadhasvalue) {
		obj_curr_id.setSelected(null)
	}




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


function paymreq_changed(self, paymreq, frm) {

	// duedate
	frm.Inputs[_jurnal_datedue].value = paymreq.paymreq_datedue


	// descr
	frm.Inputs[_jurnal_descr].value = paymreq.outstanding_descr


	// partner
	frm.Inputs[_partner_id].setSelected(paymreq.partner_id, paymreq.partner_name)

	// struct
	frm.Inputs[_struct_id].setSelected(paymreq.struct_id, paymreq.struct_name)

	// site
	frm.Inputs[_site_id].setSelected(paymreq.site_id, paymreq.site_name)

	// unit
	frm.Inputs[_unit_id].setSelected(paymreq.unit_id, paymreq.unit_name)

	// project
	frm.Inputs[_project_id].setSelected(paymreq.project_id, paymreq.project_name)

	// paymtype
	if (selectedJurnaltype.isheadhaspaymtype === true) {
		frm.Inputs[_paymtype_id].setSelected(paymreq.paymtype_id, paymreq.paymtype_name)
		const paymtype = Context.setting.paymtype[paymreq.paymtype_id]
		paymtype_changed(self, paymtype, frm)
	} else {
		frm.Inputs[_paymtype_id].clear()
		frm.Inputs[_paymtype_id].setSelected(null)
		paymtype_changed(self, null, frm)
	}



	// partnerbank
	frm.Inputs[_partnerbank_id].setSelected(paymreq.partnerbank_id, paymreq.partnerbank_name)


	// bankaccount
	frm.Inputs[_partnerbank_account].value = paymreq.partnerbank_account

	// accountname
	frm.Inputs[_partnerbank_accountname].value = paymreq.partnerbank_accountname

	// bankname
	frm.Inputs[_partnerbank_bankname].value = paymreq.partnerbank_bankname


	// partnercontact
	frm.Inputs[_partnercontact_id].setSelected(paymreq.partnercontact_id, paymreq.partnercontact_name)

	// curr
	frm.Inputs[_curr_id].setSelected(paymreq.curr_id, paymreq.curr_name)

	// value
	const value = paymreq.outstanding_value
	const rate = paymreq.curr_rate
	const idr = value * rate
	frm.Inputs[_jurnal_value].value = value
	frm.Inputs[_jurnal_idr].value = idr
	frm.Inputs[_curr_rate].value = rate



}


function paymtype_changed(self, paymtype, frm) {
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
	// frm.Inputs[_payment_bgno].markAsRequired(paymtype.ishasgiro)
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

function recalculateCurrency(self, frm) {
	const rate = frm.Inputs[_curr_rate].value
	const value = frm.Inputs[_jurnal_value].value
	const idr = value * rate

	frm.Inputs[_jurnal_idr].value = idr
}

function isUnbalance(balance_value, balance_idr) {
	if (balance_value !== undefined) {
		if (balance_value != 0) {
			return true
		}
	}

	if (balance_idr !== undefined) {
		if (balance_idr != 0) {
			return true
		}
	}

	return false
}