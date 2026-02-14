import Context from './paymreq-context.mjs'
import * as Ext from './paymreq-ext.mjs'
import * as pageHelper from '/public/libs/webmodule/pagehelper.mjs'

const Extender = Ext.extenderHeader ?? Ext


const CurrentState = {}
const Crsl =  Context.Crsl
const CurrentSectionId = Context.Sections.paymreqHeaderEdit
const CurrentSection = Crsl.Items[CurrentSectionId]
const Source = Context.Source


const TitleWhenNew = 'New Payment Request'
const TitleWhenView = 'View Payment Request'
const TitleWhenEdit = 'Edit Payment Request'
const EditModeText = 'Edit'
const LockModeText = 'Lock'

const btn_edit = new $fgta5.ActionButton('paymreqHeaderEdit-btn_edit')
const btn_save = new $fgta5.ActionButton('paymreqHeaderEdit-btn_save')
const btn_new = new $fgta5.ActionButton('paymreqHeaderEdit-btn_new', 'paymreqHeader-new')
const btn_del = new $fgta5.ActionButton('paymreqHeaderEdit-btn_delete')
const btn_reset = new $fgta5.ActionButton('paymreqHeaderEdit-btn_reset')
const btn_prev = new $fgta5.ActionButton('paymreqHeaderEdit-btn_prev')
const btn_next = new $fgta5.ActionButton('paymreqHeaderEdit-btn_next')

const btn_actionCommit = new $fgta5.ActionButton('paymreqHeaderEdit-btn_actionCommit')
const btn_actionUncommit = new $fgta5.ActionButton('paymreqHeaderEdit-btn_actionUncommit')
const btn_actionApprove = new $fgta5.ActionButton('paymreqHeaderEdit-btn_actionApprove')
const btn_actionUnapprove = new $fgta5.ActionButton('paymreqHeaderEdit-btn_actionUnapprove')
const btn_actionPrint = new $fgta5.ActionButton('paymreqHeaderEdit-btn_actionPrint')

const btn_recordstatus = document.getElementById('paymreqHeader-btn_recordstatus')
const btn_logs = document.getElementById('paymreqHeader-btn_logs')
const btn_about = document.getElementById('paymreqHeader-btn_about')

const frm = new $fgta5.Form('paymreqHeaderEdit-frm');
const obj_paymreq_id = frm.Inputs['paymreqHeaderEdit-obj_paymreq_id']
const obj_paymreq_doc = frm.Inputs['paymreqHeaderEdit-obj_paymreq_doc']
const obj_iscommit = frm.Inputs['paymreqHeaderEdit-obj_iscommit']
const obj_isapproved = frm.Inputs['paymreqHeaderEdit-obj_isapproved']
const obj_paymreqtype_id = frm.Inputs['paymreqHeaderEdit-obj_paymreqtype_id']
const obj_paymreq_invoice = frm.Inputs['paymreqHeaderEdit-obj_paymreq_invoice']
const obj_paymreq_date = frm.Inputs['paymreqHeaderEdit-obj_paymreq_date']
const obj_ffl_id = frm.Inputs['paymreqHeaderEdit-obj_ffl_id']
const obj_po_id = frm.Inputs['paymreqHeaderEdit-obj_po_id']
const obj_paymreq_descr = frm.Inputs['paymreqHeaderEdit-obj_paymreq_descr']
const obj_paymreq_datedue = frm.Inputs['paymreqHeaderEdit-obj_paymreq_datedue']
const obj_struct_id = frm.Inputs['paymreqHeaderEdit-obj_struct_id']
const obj_project_id = frm.Inputs['paymreqHeaderEdit-obj_project_id']
const obj_site_id = frm.Inputs['paymreqHeaderEdit-obj_site_id']
const obj_unit_id = frm.Inputs['paymreqHeaderEdit-obj_unit_id']
const obj_bc_id = frm.Inputs['paymreqHeaderEdit-obj_bc_id']
const obj_partner_id = frm.Inputs['paymreqHeaderEdit-obj_partner_id']
const obj_partnercontact_id = frm.Inputs['paymreqHeaderEdit-obj_partnercontact_id']
const obj_paymtype_id = frm.Inputs['paymreqHeaderEdit-obj_paymtype_id']
const obj_curr_id = frm.Inputs['paymreqHeaderEdit-obj_curr_id']
const obj_payment_bgno = frm.Inputs['paymreqHeaderEdit-obj_payment_bgno']
const obj_partnerbank_id = frm.Inputs['paymreqHeaderEdit-obj_partnerbank_id']
const obj_partnerbank_account = frm.Inputs['paymreqHeaderEdit-obj_partnerbank_account']
const obj_partnerbank_accountname = frm.Inputs['paymreqHeaderEdit-obj_partnerbank_accountname']
const obj_partnerbank_bankname = frm.Inputs['paymreqHeaderEdit-obj_partnerbank_bankname']
const obj_ppn_id = frm.Inputs['paymreqHeaderEdit-obj_ppn_id']
const obj_pph_id = frm.Inputs['paymreqHeaderEdit-obj_pph_id']
const obj_paymreq_value = frm.Inputs['paymreqHeaderEdit-obj_paymreq_value']
const obj_paymreq_ppn = frm.Inputs['paymreqHeaderEdit-obj_paymreq_ppn']
const obj_paymreq_pph = frm.Inputs['paymreqHeaderEdit-obj_paymreq_pph']
const obj_paymreq_bill = frm.Inputs['paymreqHeaderEdit-obj_paymreq_bill']
const obj_paymreq_total = frm.Inputs['paymreqHeaderEdit-obj_paymreq_total']	
const rec_createby = document.getElementById('fRecord-section-createby')
const rec_createdate = document.getElementById('fRecord-section-createdate')
const rec_modifyby = document.getElementById('fRecord-section-modifyby')
const rec_modifydate = document.getElementById('fRecord-section-modifydate')
const rec_id = document.getElementById('fRecord-section-id')


export const Section = CurrentSection

export async function init(self, args) {
	console.log('initializing paymreqHeaderEdit ...')
	

	CurrentSection.addEventListener($fgta5.Section.EVT_BACKBUTTONCLICK, async (evt)=>{
		backToList(self, evt)
	})

	frm.addEventListener('locked', (evt) => { frm_locked(self, evt) });
	frm.addEventListener('unlocked', (evt) => { frm_unlocked(self, evt) });
	frm.render()

	btn_edit.addEventListener('click', (evt)=>{ btn_edit_click(self, evt) })
	btn_save.addEventListener('click', (evt)=>{ btn_save_click(self, evt)  })
	btn_new.addEventListener('click', (evt)=>{ btn_new_click(self, evt)})
	btn_del.addEventListener('click', (evt)=>{ btn_del_click(self, evt)})
	btn_reset.addEventListener('click', (evt)=>{ btn_reset_click(self, evt)})
	btn_prev.addEventListener('click', (evt)=>{ btn_prev_click(self, evt)})
	btn_next.addEventListener('click', (evt)=>{ btn_next_click(self, evt)})


	btn_recordstatus.addEventListener('click', evt=>{ btn_recordstatus_click(self, evt) })	
	btn_logs.addEventListener('click', evt=>{ btn_logs_click(self, evt) })	
	btn_about.addEventListener('click', evt=>{ btn_about_click(self, evt) })

	// set actions
	CurrentState.Actions = {
		newdata: btn_new,
		edit: btn_edit,
		commit: btn_actionCommit,
		uncommit: btn_actionUncommit,
		approve: btn_actionApprove,
		unapprove: btn_actionUnapprove,
		print: btn_actionPrint,	
	}
	
	// export async function paymreqHeaderEdit_init(self, CurrentState)
	const fn_init_name = 'paymreqHeaderEdit_init'
	const fn_init = Extender[fn_init_name]
	if (typeof fn_init === 'function') {
		await fn_init(self, CurrentState)
	}


	// buat di Extender: export function setupActionButtonEvent(self, frm, CurrentState, buttons) { }
	const fn_setupactionbuttonevent_name = 'setupActionButtonEvent'
	const fn_setupactionbuttonevent = Extender[fn_setupactionbuttonevent_name]
	if (typeof fn_setupactionbuttonevent === 'function') {
		fn_setupactionbuttonevent(self, frm, CurrentState, {
			btn_actionCommit,
			btn_actionUncommit,
			btn_actionApprove,
			btn_actionUnapprove,
			btn_actionPrint,
		})
	} else {
		console.warn('Extender.setupActionButtonEvent is not implemented')
		console.log('buat function di extender: export function setupActionButtonEvent(self, buttons)')
	}

	
	// Combobox: obj_paymreqtype_id
	obj_paymreqtype_id.addEventListener('selected', (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selected_name = 'obj_paymreqtype_id_selected'
		const fn_selected = Extender[fn_selected_name]
		if (typeof fn_selected === 'function') {
			// create function di Extender:
			// export async function obj_paymreqtype_id_selected(self, obj_paymreqtype_id, frm, evt) {}
			fn_selected(self, obj_paymreqtype_id, frm, evt)
		} else {	
			console.warn('Extender.obj_paymreqtype_id_selected is not implemented')
		}		
	})
	
	obj_paymreqtype_id.addEventListener('selecting', async (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selecting_name = 'obj_paymreqtype_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_paymreqtype_id_selecting(self, obj_paymreqtype_id, frm, evt) {}
			fn_selecting(self, obj_paymreqtype_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'paymreqtype/header-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			
			// buat function di extender:
			// export function obj_paymreqtype_id_selecting_criteria(self, obj_paymreqtype_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_paymreqtype_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_paymreqtype_id, frm, criteria, sort, evt)
			}

			cbo.wait()
			try {
				const result = await Module.apiCall(evt.detail.url, {
					sort,
					criteria,
					offset: evt.detail.offset,
					limit: evt.detail.limit,
				}) 

				for (var row of result.data) {
					evt.detail.addRow(row.paymreqtype_id, row.paymreqtype_name, row)
				}

				dialog.setNext(result.nextoffset, result.limit)
			} catch (err) {
				$fgta5.MessageBox.error(err.message)
			} finally {
				cbo.wait(false)
			}

			
		}		
	})
	
	
	// Combobox: obj_ffl_id
	obj_ffl_id.addEventListener('selecting', async (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selecting_name = 'obj_ffl_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_ffl_id_selecting(self, obj_ffl_id, frm, evt) {}
			fn_selecting(self, obj_ffl_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'po/header-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			
			// buat function di extender:
			// export function obj_ffl_id_selecting_criteria(self, obj_ffl_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_ffl_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_ffl_id, frm, criteria, sort, evt)
			}

			cbo.wait()
			try {
				const result = await Module.apiCall(evt.detail.url, {
					sort,
					criteria,
					offset: evt.detail.offset,
					limit: evt.detail.limit,
				}) 

				for (var row of result.data) {
					evt.detail.addRow(row.po_id, row.po_descr, row)
				}

				dialog.setNext(result.nextoffset, result.limit)
			} catch (err) {
				$fgta5.MessageBox.error(err.message)
			} finally {
				cbo.wait(false)
			}

			
		}		
	})
	
	
	// Combobox: obj_po_id
	obj_po_id.addEventListener('selecting', async (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selecting_name = 'obj_po_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_po_id_selecting(self, obj_po_id, frm, evt) {}
			fn_selecting(self, obj_po_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'ffl/header-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			
			// buat function di extender:
			// export function obj_po_id_selecting_criteria(self, obj_po_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_po_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_po_id, frm, criteria, sort, evt)
			}

			cbo.wait()
			try {
				const result = await Module.apiCall(evt.detail.url, {
					sort,
					criteria,
					offset: evt.detail.offset,
					limit: evt.detail.limit,
				}) 

				for (var row of result.data) {
					evt.detail.addRow(row.ffl_id, row.ffl_descr, row)
				}

				dialog.setNext(result.nextoffset, result.limit)
			} catch (err) {
				$fgta5.MessageBox.error(err.message)
			} finally {
				cbo.wait(false)
			}

			
		}		
	})
	
	
	// Combobox: obj_struct_id
	obj_struct_id.addEventListener('selecting', async (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selecting_name = 'obj_struct_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_struct_id_selecting(self, obj_struct_id, frm, evt) {}
			fn_selecting(self, obj_struct_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'struct/header-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			
			// buat function di extender:
			// export function obj_struct_id_selecting_criteria(self, obj_struct_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_struct_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_struct_id, frm, criteria, sort, evt)
			}

			cbo.wait()
			try {
				const result = await Module.apiCall(evt.detail.url, {
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

			
		}		
	})
	
	
	// Combobox: obj_project_id
	obj_project_id.addEventListener('selecting', async (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selecting_name = 'obj_project_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_project_id_selecting(self, obj_project_id, frm, evt) {}
			fn_selecting(self, obj_project_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'project/header-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			
			// buat function di extender:
			// export function obj_project_id_selecting_criteria(self, obj_project_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_project_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_project_id, frm, criteria, sort, evt)
			}

			cbo.wait()
			try {
				const result = await Module.apiCall(evt.detail.url, {
					sort,
					criteria,
					offset: evt.detail.offset,
					limit: evt.detail.limit,
				}) 

				for (var row of result.data) {
					evt.detail.addRow(row.project_id, row.project_name, row)
				}

				dialog.setNext(result.nextoffset, result.limit)
			} catch (err) {
				$fgta5.MessageBox.error(err.message)
			} finally {
				cbo.wait(false)
			}

			
		}		
	})
	
	
	// Combobox: obj_site_id
	obj_site_id.addEventListener('selecting', async (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selecting_name = 'obj_site_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_site_id_selecting(self, obj_site_id, frm, evt) {}
			fn_selecting(self, obj_site_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'site/header-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			
			// buat function di extender:
			// export function obj_site_id_selecting_criteria(self, obj_site_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_site_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_site_id, frm, criteria, sort, evt)
			}

			cbo.wait()
			try {
				const result = await Module.apiCall(evt.detail.url, {
					sort,
					criteria,
					offset: evt.detail.offset,
					limit: evt.detail.limit,
				}) 

				for (var row of result.data) {
					evt.detail.addRow(row.site_id, row.site_name, row)
				}

				dialog.setNext(result.nextoffset, result.limit)
			} catch (err) {
				$fgta5.MessageBox.error(err.message)
			} finally {
				cbo.wait(false)
			}

			
		}		
	})
	
	
	// Combobox: obj_unit_id
	obj_unit_id.addEventListener('selecting', async (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selecting_name = 'obj_unit_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_unit_id_selecting(self, obj_unit_id, frm, evt) {}
			fn_selecting(self, obj_unit_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'unit/header-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			
			// buat function di extender:
			// export function obj_unit_id_selecting_criteria(self, obj_unit_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_unit_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_unit_id, frm, criteria, sort, evt)
			}

			cbo.wait()
			try {
				const result = await Module.apiCall(evt.detail.url, {
					sort,
					criteria,
					offset: evt.detail.offset,
					limit: evt.detail.limit,
				}) 

				for (var row of result.data) {
					evt.detail.addRow(row.unit_id, row.unit_name, row)
				}

				dialog.setNext(result.nextoffset, result.limit)
			} catch (err) {
				$fgta5.MessageBox.error(err.message)
			} finally {
				cbo.wait(false)
			}

			
		}		
	})
	
	
	// Combobox: obj_bc_id
	obj_bc_id.addEventListener('selecting', async (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selecting_name = 'obj_bc_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_bc_id_selecting(self, obj_bc_id, frm, evt) {}
			fn_selecting(self, obj_bc_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'bc/header-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			
			// buat function di extender:
			// export function obj_bc_id_selecting_criteria(self, obj_bc_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_bc_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_bc_id, frm, criteria, sort, evt)
			}

			cbo.wait()
			try {
				const result = await Module.apiCall(evt.detail.url, {
					sort,
					criteria,
					offset: evt.detail.offset,
					limit: evt.detail.limit,
				}) 

				for (var row of result.data) {
					evt.detail.addRow(row.bc_id, row.bc_descr, row)
				}

				dialog.setNext(result.nextoffset, result.limit)
			} catch (err) {
				$fgta5.MessageBox.error(err.message)
			} finally {
				cbo.wait(false)
			}

			
		}		
	})
	
	
	// Combobox: obj_partner_id
	obj_partner_id.addEventListener('selected', (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selected_name = 'obj_partner_id_selected'
		const fn_selected = Extender[fn_selected_name]
		if (typeof fn_selected === 'function') {
			// create function di Extender:
			// export async function obj_partner_id_selected(self, obj_partner_id, frm, evt) {}
			fn_selected(self, obj_partner_id, frm, evt)
		} else {	
			console.warn('Extender.obj_partner_id_selected is not implemented')
		}		
	})
	
	obj_partner_id.addEventListener('selecting', async (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selecting_name = 'obj_partner_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_partner_id_selecting(self, obj_partner_id, frm, evt) {}
			fn_selecting(self, obj_partner_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'partner/header-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			
			// buat function di extender:
			// export function obj_partner_id_selecting_criteria(self, obj_partner_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_partner_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_partner_id, frm, criteria, sort, evt)
			}

			cbo.wait()
			try {
				const result = await Module.apiCall(evt.detail.url, {
					sort,
					criteria,
					offset: evt.detail.offset,
					limit: evt.detail.limit,
				}) 

				for (var row of result.data) {
					evt.detail.addRow(row.partner_id, row.partner_name, row)
				}

				dialog.setNext(result.nextoffset, result.limit)
			} catch (err) {
				$fgta5.MessageBox.error(err.message)
			} finally {
				cbo.wait(false)
			}

			
		}		
	})
	
	
	// Combobox: obj_partnercontact_id
	obj_partnercontact_id.addEventListener('selecting', async (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selecting_name = 'obj_partnercontact_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_partnercontact_id_selecting(self, obj_partnercontact_id, frm, evt) {}
			fn_selecting(self, obj_partnercontact_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'partner/contact-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			
			// buat function di extender:
			// export function obj_partnercontact_id_selecting_criteria(self, obj_partnercontact_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_partnercontact_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_partnercontact_id, frm, criteria, sort, evt)
			}

			cbo.wait()
			try {
				const result = await Module.apiCall(evt.detail.url, {
					sort,
					criteria,
					offset: evt.detail.offset,
					limit: evt.detail.limit,
				}) 

				for (var row of result.data) {
					evt.detail.addRow(row.partnercontact_id, row.partnercontact_name, row)
				}

				dialog.setNext(result.nextoffset, result.limit)
			} catch (err) {
				$fgta5.MessageBox.error(err.message)
			} finally {
				cbo.wait(false)
			}

			
		}		
	})
	
	
	// Combobox: obj_paymtype_id
	obj_paymtype_id.addEventListener('selected', (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selected_name = 'obj_paymtype_id_selected'
		const fn_selected = Extender[fn_selected_name]
		if (typeof fn_selected === 'function') {
			// create function di Extender:
			// export async function obj_paymtype_id_selected(self, obj_paymtype_id, frm, evt) {}
			fn_selected(self, obj_paymtype_id, frm, evt)
		} else {	
			console.warn('Extender.obj_paymtype_id_selected is not implemented')
		}		
	})
	
	obj_paymtype_id.addEventListener('selecting', async (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selecting_name = 'obj_paymtype_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_paymtype_id_selecting(self, obj_paymtype_id, frm, evt) {}
			fn_selecting(self, obj_paymtype_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'paymtype/header-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			
			// buat function di extender:
			// export function obj_paymtype_id_selecting_criteria(self, obj_paymtype_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_paymtype_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_paymtype_id, frm, criteria, sort, evt)
			}

			cbo.wait()
			try {
				const result = await Module.apiCall(evt.detail.url, {
					sort,
					criteria,
					offset: evt.detail.offset,
					limit: evt.detail.limit,
				}) 

				for (var row of result.data) {
					evt.detail.addRow(row.paymtype_id, row.paymtype_name, row)
				}

				dialog.setNext(result.nextoffset, result.limit)
			} catch (err) {
				$fgta5.MessageBox.error(err.message)
			} finally {
				cbo.wait(false)
			}

			
		}		
	})
	
	
	// Combobox: obj_curr_id
	obj_curr_id.addEventListener('selecting', async (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selecting_name = 'obj_curr_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_curr_id_selecting(self, obj_curr_id, frm, evt) {}
			fn_selecting(self, obj_curr_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'curr/header-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			
			// buat function di extender:
			// export function obj_curr_id_selecting_criteria(self, obj_curr_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_curr_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_curr_id, frm, criteria, sort, evt)
			}

			cbo.wait()
			try {
				const result = await Module.apiCall(evt.detail.url, {
					sort,
					criteria,
					offset: evt.detail.offset,
					limit: evt.detail.limit,
				}) 

				for (var row of result.data) {
					evt.detail.addRow(row.curr_id, row.curr_name, row)
				}

				dialog.setNext(result.nextoffset, result.limit)
			} catch (err) {
				$fgta5.MessageBox.error(err.message)
			} finally {
				cbo.wait(false)
			}

			
		}		
	})
	
	
	// Combobox: obj_partnerbank_id
	obj_partnerbank_id.addEventListener('selected', (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selected_name = 'obj_partnerbank_id_selected'
		const fn_selected = Extender[fn_selected_name]
		if (typeof fn_selected === 'function') {
			// create function di Extender:
			// export async function obj_partnerbank_id_selected(self, obj_partnerbank_id, frm, evt) {}
			fn_selected(self, obj_partnerbank_id, frm, evt)
		} else {	
			console.warn('Extender.obj_partnerbank_id_selected is not implemented')
		}		
	})
	
	obj_partnerbank_id.addEventListener('selecting', async (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selecting_name = 'obj_partnerbank_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_partnerbank_id_selecting(self, obj_partnerbank_id, frm, evt) {}
			fn_selecting(self, obj_partnerbank_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'partner/bank-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			
			// buat function di extender:
			// export function obj_partnerbank_id_selecting_criteria(self, obj_partnerbank_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_partnerbank_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_partnerbank_id, frm, criteria, sort, evt)
			}

			cbo.wait()
			try {
				const result = await Module.apiCall(evt.detail.url, {
					sort,
					criteria,
					offset: evt.detail.offset,
					limit: evt.detail.limit,
				}) 

				for (var row of result.data) {
					evt.detail.addRow(row.partnerbank_id, row.partnerbank_name, row)
				}

				dialog.setNext(result.nextoffset, result.limit)
			} catch (err) {
				$fgta5.MessageBox.error(err.message)
			} finally {
				cbo.wait(false)
			}

			
		}		
	})
	
	
	// Combobox: obj_ppn_id
	obj_ppn_id.addEventListener('selected', (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selected_name = 'obj_ppn_id_selected'
		const fn_selected = Extender[fn_selected_name]
		if (typeof fn_selected === 'function') {
			// create function di Extender:
			// export async function obj_ppn_id_selected(self, obj_ppn_id, frm, evt) {}
			fn_selected(self, obj_ppn_id, frm, evt)
		} else {	
			console.warn('Extender.obj_ppn_id_selected is not implemented')
		}		
	})
	
	obj_ppn_id.addEventListener('selecting', async (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selecting_name = 'obj_ppn_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_ppn_id_selecting(self, obj_ppn_id, frm, evt) {}
			fn_selecting(self, obj_ppn_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'taxtype/header-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			
			// buat function di extender:
			// export function obj_ppn_id_selecting_criteria(self, obj_ppn_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_ppn_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_ppn_id, frm, criteria, sort, evt)
			}

			cbo.wait()
			try {
				const result = await Module.apiCall(evt.detail.url, {
					sort,
					criteria,
					offset: evt.detail.offset,
					limit: evt.detail.limit,
				}) 

				for (var row of result.data) {
					evt.detail.addRow(row.taxtype_id, row.taxtype_name, row)
				}

				dialog.setNext(result.nextoffset, result.limit)
			} catch (err) {
				$fgta5.MessageBox.error(err.message)
			} finally {
				cbo.wait(false)
			}

			
		}		
	})
	
	
	// Combobox: obj_pph_id
	obj_pph_id.addEventListener('selected', (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selected_name = 'obj_pph_id_selected'
		const fn_selected = Extender[fn_selected_name]
		if (typeof fn_selected === 'function') {
			// create function di Extender:
			// export async function obj_pph_id_selected(self, obj_pph_id, frm, evt) {}
			fn_selected(self, obj_pph_id, frm, evt)
		} else {	
			console.warn('Extender.obj_pph_id_selected is not implemented')
		}		
	})
	
	obj_pph_id.addEventListener('selecting', async (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selecting_name = 'obj_pph_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_pph_id_selecting(self, obj_pph_id, frm, evt) {}
			fn_selecting(self, obj_pph_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'taxtype/header-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			
			// buat function di extender:
			// export function obj_pph_id_selecting_criteria(self, obj_pph_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_pph_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_pph_id, frm, criteria, sort, evt)
			}

			cbo.wait()
			try {
				const result = await Module.apiCall(evt.detail.url, {
					sort,
					criteria,
					offset: evt.detail.offset,
					limit: evt.detail.limit,
				}) 

				for (var row of result.data) {
					evt.detail.addRow(row.taxtype_id, row.taxtype_name, row)
				}

				dialog.setNext(result.nextoffset, result.limit)
			} catch (err) {
				$fgta5.MessageBox.error(err.message)
			} finally {
				cbo.wait(false)
			}

			
		}		
	})
	
		
	
}

export async function openSelectedData(self, params) {
	console.log('openSelectedData')

	let mask = $fgta5.Modal.createMask()
	try {
		obj_paymreqtype_id.clear()
		obj_ffl_id.clear()
		obj_po_id.clear()
		obj_struct_id.clear()
		obj_project_id.clear()
		obj_site_id.clear()
		obj_unit_id.clear()
		obj_bc_id.clear()
		obj_partner_id.clear()
		obj_partnercontact_id.clear()
		obj_paymtype_id.clear()
		obj_curr_id.clear()
		obj_partnerbank_id.clear()
		obj_ppn_id.clear()
		obj_pph_id.clear()
					
		const id = params.keyvalue
		const data = await openData(self, id)

		

		CurrentState.currentOpenedId = id

		// export async function paymreqHeaderEdit_isEditDisabled(self, data)
		const fn_iseditdisabled_name = 'paymreqHeaderEdit_isEditDisabled'
		const fn_iseditdisabled = Extender[fn_iseditdisabled_name]
		if (typeof fn_iseditdisabled === 'function') {
			const editDisabled = fn_iseditdisabled(self, data)
			CurrentState.editDisabled = editDisabled
		}

		// disable primary key
		setPrimaryKeyState(self, {disabled:true})

		// isi form dengan data
		frm.setData(data)

		// jika ada kebutuhan untuk oleh lagi form dan data, bisa lakukan di extender
		// export async function paymreqHeaderEdit_formOpened(self, frm, CurrentState)
		const fn_formopened_name = 'paymreqHeaderEdit_formOpened'
		const fn_formopened = Extender[fn_formopened_name]
		if (typeof fn_formopened === 'function') {
			await fn_formopened(self, frm, CurrentState)
		}

		// finally, accept changes dan lock form
		frm.acceptChanges()
		frm.lock()

	} catch (err) {
		CurrentState.currentOpenedId = null
		throw err
	} finally {
		mask.close()
		mask = null
	}
}



export function getHeaderForm(self) {
	return frm
}

export function getForm(self) {
	return frm
}

export function clearForm(self, text) {
	frm.clear(text)
}

export function disableNextButton(self, disabled=true) {
	btn_next.disabled = disabled
}

export function disablePrevButton(self, disabled=true) {
	btn_prev.disabled = disabled
}

export function keyboardAction(self, actionName) {
	if (actionName=='save') {
		frm.acceptInput()
		btn_save.click()
	} else if (actionName=='new') {
		frm.acceptInput()
		btn_new.click()
	} else if (actionName=='escape') {
		frm.acceptInput()
		if (frm.isLocked() || frm.isNew()) {
			backToList(self)
		} else {
			btn_edit.click() // untuk lock data
		}
	} else if (actionName=='togleEdit') {
		frm.acceptInput()
		btn_edit.click()
	} else if (actionName=='right') {
		btn_next.click()
	} else if (actionName=='left') {
		btn_prev.click()
	}
}


async function newData(self, datainit) {
	try {
		frm.newData(datainit)
		frm.acceptChanges()
		frm.setAsNewData()
	} catch (err) {
		throw err
	}
}

async function openData(self, id) {
	const url = `/${Context.moduleName}/header-open`
	try {
		const result = await Module.apiCall(url, { id }) 
		return result 
	} catch (err) {
		throw err	
	} 	
}

async function createData(self, data, formData) {
	const url = `/${Context.moduleName}/header-create`
	try {
		const result = await Module.apiCall(url, { data, source: Source }, formData) 
		return result 
	} catch (err) {
		throw err	
	} 	
}


async function updateData(self, data, formData) {
	const url = `/${Context.moduleName}/header-update`
	try {
		const result = await Module.apiCall(url, { data, source: Source }, formData) 
		return result 
	} catch (err) {
		throw err	
	} 
}


async function deleteData(self, id) {
	const url = `/${Context.moduleName}/header-delete`
	try {
		const result = await Module.apiCall(url, { id, source: Source }) 
		return result 
	} catch (err) {
		throw err	
	} 
}


async function backToList(self, evt) {
	// cek apakah ada perubahan data
	let goback = false
	if (frm.isChanged()) {
		// ada perubahan data, konfirmasi apakah mau lanjut back
		var ret = await $fgta5.MessageBox.confirm(Module.BACK_CONFIRM)
		if (ret=='ok') {
			// user melanjutkan back, walaupun data berubah
			// reset dahulu data form
			frm.reset()
			goback = true
		}
	} else {
		goback = true
	}

	if (goback) {
		frm.lock()
		const listId =  Context.Sections.paymreqHeaderList
		const listSection = Crsl.Items[listId]
		listSection.show({direction: 1})
	}
}

async function  frm_locked(self, evt) {
	CurrentSection.Title = TitleWhenView

	btn_edit.setText(EditModeText)

	btn_edit.disabled = false
	btn_save.disabled = true
	btn_new.disabled = false
	btn_del.disabled = true
	btn_reset.disabled = true
	btn_prev.disabled = false
	btn_next.disabled = false

	// Enable action: action hanya bisa dilakukan saat posisi edit off
	btn_actionCommit.disabled = false
	btn_actionUncommit.disabled = false
	btn_actionApprove.disabled = false
	btn_actionUnapprove.disabled = false
	btn_actionPrint.disabled = false
	
	// Extender untuk event locked
	// export function paymreqHeaderEdit_formLocked(self, frm, CurrentState) {}
	const fn_name = 'paymreqHeaderEdit_formLocked'
	const fn = Extender[fn_name]
	if (typeof fn === 'function') {
		fn(self, frm, CurrentState)
	}

	if (CurrentState.editDisabled) {
		// jika karena suatu kondisi data mengharuskan data tidak boleh diedit
		btn_edit.disabled = true
	}

	
	// trigger lock event di detil
	self.Modules.paymreqDetilList.headerLocked(self)
	self.Modules.paymreqDetilEdit.headerLocked(self)
		

}

async function  frm_unlocked(self, evt) {
	if (frm.isNew()) {
		CurrentSection.Title = TitleWhenNew
	} else {
		CurrentSection.Title = TitleWhenEdit
	}

	btn_edit.setText(LockModeText)

	btn_edit.disabled = false
	btn_save.disabled = false
	btn_new.disabled = true
	btn_del.disabled = false
	btn_reset.disabled = false
	btn_prev.disabled = true
	btn_next.disabled = true

	// Disable action: action hanya bisa dilakukan saat posisi edit off
	btn_actionCommit.disabled = true
	btn_actionUncommit.disabled = true
	btn_actionApprove.disabled = true
	btn_actionUnapprove.disabled = true
	btn_actionPrint.disabled = true

	// Extender untuk event Unlocked
	// export function paymreqHeaderEdit_formUnlocked(self, frm, CurrentState) {}
	const fn_name = 'paymreqHeaderEdit_formUnlocked'
	const fn = Extender[fn_name]
	if (typeof fn === 'function') {
		fn(self, frm, CurrentState)
	}

	
	// trigger unlock event di detil
	self.Modules.paymreqDetilList.headerUnlocked(self)
	self.Modules.paymreqDetilEdit.headerUnlocked(self)	
		
}

async function setPrimaryKeyState(self, opt) {
	const obj_pk = frm.getPrimaryInput()
	obj_pk.disabled = opt.disabled===true
	if (opt.placeholder!==undefined) {
		obj_pk.placeholder = opt.placeholder
	}
	if (opt.value!==undefined) {
		obj_pk.value = opt.value
	}
}



async function btn_edit_click(self, evt) {
	console.log('btn_edit_click')

	if (frm.isLocked()) {
		// user mau inlock
		frm.lock(false)
	} else {
		if (frm.isChanged() || frm.isNew()) {
			await $fgta5.MessageBox.warning(Module.EDIT_WARNING)
			return
		}
		frm.lock(true)
	}
}

async function btn_new_click(self, evt) {
	console.log('btn_new_click')
	const sourceSection = evt.target.getAttribute('data-sectionsource') 

	const paymreqHeaderList = self.Modules.paymreqHeaderList
	const listsecid = paymreqHeaderList.Section.Id
	const fromListSection = sourceSection===listsecid
	if (fromListSection) {
		// klik new dari list (tidak perlu cek ada perubahan data)
		// tampilkan dulu form
		await CurrentSection.show()
	} else {
		// klik new dari form
		let cancel_new = false
		if (frm.isChanged()) {
			const ret = await $fgta5.MessageBox.confirm(Module.NEWDATA_CONFIRM)
			if (ret=='cancel') {
				cancel_new = true
			}
		}
		if (cancel_new) {
			return
		}
	}

	if (frm.AutoID) {
		setPrimaryKeyState(self, {disabled:true, placeholder:'[AutoID]'})
	} else {
		setPrimaryKeyState(self, {disabled:false, placeholder:'ID'})
	}

	try {

		// inisiasi data baru
		const datainit = {
			paymreq_date: new Date(),
			paymreq_datedue: new Date(),
			paymreq_value: 0,
			paymreq_ppn: 0,
			paymreq_pph: 0,
			paymreq_bill: 0,
			paymreq_total: 0,
		}


		// jika perlu modifikasi data initial,
		// atau dialog untuk opsi data baru, dapat dibuat di Extender
		const fn_newdata_name = 'paymreqHeaderEdit_newData'
		const fn_newdata = Extender[fn_newdata_name]
		if (typeof fn_newdata === 'function') {
			// export async function paymreqHeaderEdit_newData(self, datainit, frm) {}
			await fn_newdata(self, datainit, frm)
		}

		// buat data baru
		await newData(self, datainit)

		// buka lock, agar user bisa edit
		frm.lock(false)

		// jika edit di suspend, enable dulu
		btn_edit.suspend(false)


		// matikan tombol edit dan del saat kondisi form adalah data baru 
		btn_edit.disabled = true
		btn_del.disabled = true
	} catch (err) {
		console.error(err)
		await $fgta5.MessageBox.error(err.message)
		if (fromListSection) {
			// jika saat tombol baru dipilih saat di list, tampilan kembalikan ke list
			self.Modules.paymreqHeaderList.Section.show()
		}
	}
}

async function btn_save_click(self, evt) {
	console.log('btn_save_click')


	// Extender Autofill
	const fn_autofill_name = 'paymreqHeaderEdit_autofill'
	const fn_autofill = Extender[fn_autofill_name]
	if (typeof fn_autofill === 'function') {
		await fn_autofill(self, frm)
	}

	// cek apakah data valid
	const valid = frm.validate()
	if (!valid) {
		const message = frm.getLastError()
		console.warn(message)
		$fgta5.MessageBox.warning(message)
		return
	}


	// abaikan jika bukan data baru dan tidak ada perubahan
	let dataToSave
	const isNewData = frm.isNew()
	if (!isNewData) {
		// cek dulu apakah ada perubahaan
		if (!frm.isChanged()) {
			// skip save jika tidak ada perubahan data
			console.log('tidak ada perubahan data, skip save')
			return
		} 
		
		// ambil hanya data yang berubah
		dataToSave = frm.getDataChanged()

	} else {

		// untuk posisi data baru, ambil semua data
		dataToSave = frm.getData()		
	}



	// bila ada file, upload filenya
	let formData = null
	const files = frm.getFiles()
	if (files!=null) {
		formData = new FormData();
		for (let name in files) {
			const file = files[name]
			formData.append(name, file)
		}
	}


	// Extender Saving
	// export async function paymreqHeaderEdit_dataSaving(self, dataToSave, frm, args) {}
	const args = { cancelSave: false }
	const fn_datasaving_name = 'paymreqHeaderEdit_dataSaving'
	const fn_datasaving = Extender[fn_datasaving_name]
	if (typeof fn_datasaving === 'function') {
		await fn_datasaving(self, dataToSave, frm, args)
	}

	// batalkan save, jika ada request cancel
	if (args.cancelSave) {
		console.log('save is canceled')
		return
	}
	

	let mask = $fgta5.Modal.createMask()
	try {
		let result

		if (isNewData) {
			result = await createData(self, dataToSave, formData)
		} else {
 			result = await updateData(self, dataToSave, formData)
		}

		console.log('result', result)
		const obj_pk = frm.getPrimaryInput()
		const pk = obj_pk.getBindingData()
		const idValue = result[pk]

		console.log(`get data id ${idValue}`)
		const data = await openData(self, idValue)
		console.log('data', data)

		

		CurrentState.currentOpenedId = idValue

		if (frm.AutoID) {
			console.log('update field ID di form')
			obj_pk.value = idValue
		} else {
			// jika bukan autoID, kunci field PK menjadi disabled
			setPrimaryKeyState(self, {disabled:true})

		}

		// update form
		frm.setData(data)	


		// Extender Saving
		const fn_datasaved_name = 'paymreqHeaderEdit_dataSaved'
		const fn_datasaved = Extender[fn_datasaved_name]
		if (typeof fn_datasaved === 'function') {
			// export async function paymreqHeaderEdit_dataSaved(self, data, frm) {}
			await fn_datasaved(self, data, frm)
		}


		// persist perubahan di form
		frm.acceptChanges()


		if (isNewData) {
			// saat new data, posisi button toggle edit akan disabled
			// setelah berhasil save, nyalakan button edit (untuk lock)
			btn_edit.disabled = false

			// buat baris baru di grid
			console.log('tamabah baris baru di grid')
			self.Modules.paymreqHeaderList.addNewRow(self, data)
		} else {
			console.log('update data baris yang dibuka')
			self.Modules.paymreqHeaderList.updateCurrentRow(self, data)
		}

	} catch (err) {
		console.error(err)
		await $fgta5.MessageBox.error(err.message)
	} finally {
		mask.close()
		mask = null
	}
}

async function btn_del_click(self, evt) {
	console.log('btn_del_click')

	// jika data masih dalam kondisi baru (belum di save, 
	// perintah delete harus dibatalkan, 
	// karena belum ada data di database)
	const isNewData = frm.isNew()
	if (isNewData) {
		console.log('posisi data baru, skip delete')
		return
	}

	const obj_pk = frm.getPrimaryInput()
	const idValue = obj_pk.value

	// konfirmasi untuk delete data
	const resp = await $fgta5.MessageBox.confirm(Module.DELETE_CONFIRM + `id: ${idValue}`)
	if (resp!='ok') {
		return
	}

	console.log('delete data')
	let mask = $fgta5.Modal.createMask()
	try {
		const result = await deleteData(self, idValue)
		
		// hapus current row yang dipilih di list
		self.Modules.paymreqHeaderList.removeCurrentRow(self)
		
		// kembali ke list
		self.Modules.paymreqHeaderList.Section.show()


		// lock kembali form
		frm.lock()

	} catch (err) {
		console.error(err)
		await $fgta5.MessageBox.error(err.message)
	} finally {
		mask.close()
		mask = null
	}

}


async function btn_reset_click(self, evt) {
	console.log('btn_reset_click')

	const isNewData = frm.isNew()
	if (isNewData) {
		// untuk data baru, di reset berarti sama seperti membuat data baru
		console.log('reset: buat data baru')
		newData(self)
	} else {
		if (frm.isChanged()) {
			// ada perubahan data, tampilkan konfirmasi perubahan data
			var resp = await $fgta5.MessageBox.confirm(Module.RESET_CONFIRM)
			if (resp!='ok') {
				// user klik tombil cancel
				console.log('cancel reset')
				return
			}
			console.log('reset form')
			frm.reset()
		} else {
			console.log('tidak ada perubahan data, reset data tidak dieksekusi')
		}
	}

}

async function btn_prev_click(self, evt) {
	console.log('btn_prev_click')
	self.Modules.paymreqHeaderList.selectPreviousRow(self)
}

async function btn_next_click(self, evt) {
	console.log('btn_next_click')
	self.Modules.paymreqHeaderList.selectNextRow(self)
}




async function btn_recordstatus_click(self, evt) {
	console.log('btn_recordstatus_click')
	const params = {
		Context,
		sectionReturn: CurrentSection
	}
	
	if (frm.isNew()) {
		console.warn('tidak bisa buka rescord status jika data baru')	
		$fgta5.MessageBox.warning('Record Status bisa dibuka setelah data disimpan')
		return;
	}

	pageHelper.openSection(self, 'fRecord-section', params, async ()=>{

		let mask = $fgta5.Modal.createMask()
		try {
			// ambil data
			const pk = frm.getPrimaryInput()
			const id = pk.value
			const data = await openData(self, id)

			rec_id.innerHTML = id
			rec_createby.innerHTML = data._createby
			rec_createdate.innerHTML = data._createdate
			rec_modifyby.innerHTML = data._modifyby
			rec_modifydate.innerHTML = data._modifydate

			const fn_addrecordinfo_name = 'paymreqHeaderEdit_addRecordInfo'
			const fn_addrecordinfo = Extender[fn_addrecordinfo_name]
			if (typeof fn_addrecordinfo === 'function') {
				await fn_addrecordinfo(self, data)
			}

		} catch (err) {
			console.error(err)
			$fgta5.MessageBox.error(err.message)
		} finally {
			mask.close()
			mask = null
		}
	})

}

async function btn_logs_click(self, evt) {
	const params = {
		Context,
		sectionReturn: CurrentSection
	}

	if (frm.isNew()) {
		console.warn('tidak bisa buka logs jika data baru')	
		$fgta5.MessageBox.warning('Logs bisa dibuka setelah data disimpan')
		return;
	}

	pageHelper.openSection(self, 'fLogs-section', params, async ()=>{
		// get log data
		const pk = frm.getPrimaryInput()
		const id = pk.value


		let mask = $fgta5.Modal.createMask()
		try {

			const logApp = Context.appsUrls.core ?? Context.appsUrls[Context.appName]
			const url = `${logApp.url}/logs/list`
			const criteria = {
				module: Context.moduleName,
				table: 'public.paymreq',
				id: id
			}

			const result = await Module.apiCall(url, {  
				criteria
			}) 

			const sc = document.getElementById('fLogs-section')
			const tbody = sc.querySelector('tbody')
			pageHelper.renderLog(tbody, result.data)
		} catch (err) {
			console.error(err)
			$fgta5.MessageBox.error(err.message)
		} finally {
			mask.close()
			mask = null
		}

	})
}

async function btn_about_click(self, evt) {
	const params = {
		Context,
		sectionReturn: CurrentSection
	}
	pageHelper.openSection(self, 'fAbout-section', params, async ()=>{
		
		const AboutSection = Crsl.Items['fAbout-section']
		AboutSection.Title = 'About Payment Request'

		const section = document.getElementById('fAbout-section')

		if ( document.getElementById('fAbout-section-fdescr') == null) {
			const divDescr = document.createElement('div')
			divDescr.setAttribute('id', 'fAbout-section-fdescr')
			divDescr.setAttribute('style', 'padding: 0 0 10px 0')
			divDescr.innerHTML = ''
			const divTopbar = section.querySelector('div[data-topbar]')
			divTopbar.parentNode.insertBefore(divDescr, divTopbar.nextSibling);
		}

		if ( document.getElementById('fAbout-section-footer') == null) {
			const divFooter = document.createElement('div')
			divFooter.setAttribute('id', 'fAbout-section-footer')
			divFooter.setAttribute('style', 'border-top: 1px solid #ccc; padding: 5px 0 0 0; margin-top: 50px')
			divFooter.innerHTML = 'This module is generated by fgta5 generator at 14 Feb 2026 23:06'
			section.appendChild(divFooter)
		}
		
	})
}