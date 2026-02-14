import Context from './jurnal-context.mjs'
import * as Ext from './jurnal-ext.mjs'
import * as pageHelper from '/public/libs/webmodule/pagehelper.mjs'

const Extender = Ext.extenderDetil ?? Ext


const CurrentState = {}
const Crsl =  Context.Crsl
const CurrentSectionId = Context.Sections.jurnalDetilEdit
const CurrentSection = Crsl.Items[CurrentSectionId]
const Source = Context.Source

const TitleWhenNew = 'New Detil'
const TitleWhenView = 'View Detil'
const TitleWhenEdit = 'Edit Detil'
const EditModeText = 'Edit'
const LockModeText = 'Lock'



const btn_edit = new $fgta5.ActionButton('jurnalDetilEdit-btn_edit')
const btn_save = new $fgta5.ActionButton('jurnalDetilEdit-btn_save')
const btn_new = new $fgta5.ActionButton('jurnalDetilEdit-btn_new', 'jurnalDetil-addrow')
const btn_del = new $fgta5.ActionButton('jurnalDetilEdit-btn_delete', 'jurnalDetil-delrow')
const btn_reset = new $fgta5.ActionButton('jurnalDetilEdit-btn_reset')
const btn_prev = new $fgta5.ActionButton('jurnalDetilEdit-btn_prev')
const btn_next = new $fgta5.ActionButton('jurnalDetilEdit-btn_next')

const btn_recordstatus = document.getElementById('jurnalDetil-btn_recordstatus')
const btn_logs = document.getElementById('jurnalDetil-btn_logs')

const frm = new $fgta5.Form('jurnalDetilEdit-frm');
const obj_jurnaldetil_id = frm.Inputs['jurnalDetilEdit-obj_jurnaldetil_id']
const obj_coa_id = frm.Inputs['jurnalDetilEdit-obj_coa_id']
const obj_jurnaldetil_descr = frm.Inputs['jurnalDetilEdit-obj_jurnaldetil_descr']
const obj_partner_id = frm.Inputs['jurnalDetilEdit-obj_partner_id']
const obj_dept_id = frm.Inputs['jurnalDetilEdit-obj_dept_id']
const obj_site_id = frm.Inputs['jurnalDetilEdit-obj_site_id']
const obj_unit_id = frm.Inputs['jurnalDetilEdit-obj_unit_id']
const obj_project_id = frm.Inputs['jurnalDetilEdit-obj_project_id']
const obj_curr_id = frm.Inputs['jurnalDetilEdit-obj_curr_id']
const obj_jurnaldetil_value = frm.Inputs['jurnalDetilEdit-obj_jurnaldetil_value']
const obj_curr_rate = frm.Inputs['jurnalDetilEdit-obj_curr_rate']
const obj_jurnaldetil_idr = frm.Inputs['jurnalDetilEdit-obj_jurnaldetil_idr']
const obj_jurnaltype_id = frm.Inputs['jurnalDetilEdit-obj_jurnaltype_id']
const obj_jurnaldetil_id_ref = frm.Inputs['jurnalDetilEdit-obj_jurnaldetil_id_ref']
const obj_coacurr = frm.Inputs['jurnalDetilEdit-obj_coacurr']
const obj_agingtype_id = frm.Inputs['jurnalDetilEdit-obj_agingtype_id']
const obj_iscurradj = frm.Inputs['jurnalDetilEdit-obj_iscurradj']
const obj_jurnaldetil_ishead = frm.Inputs['jurnalDetilEdit-obj_jurnaldetil_ishead']
const obj_isdebet = frm.Inputs['jurnalDetilEdit-obj_isdebet']
const obj_iskredit = frm.Inputs['jurnalDetilEdit-obj_iskredit']
const obj_jurnal_id = frm.Inputs['jurnalDetilEdit-obj_jurnal_id']	
const rec_createby = document.getElementById('fRecord-section-createby')
const rec_createdate = document.getElementById('fRecord-section-createdate')
const rec_modifyby = document.getElementById('fRecord-section-modifyby')
const rec_modifydate = document.getElementById('fRecord-section-modifydate')
const rec_id = document.getElementById('fRecord-section-id')

export const Section = CurrentSection


export async function init(self, args) {

	CurrentSection.addEventListener($fgta5.Section.EVT_BACKBUTTONCLICK, async (evt)=>{
		backToList(self, evt)
	})

	frm.addEventListener('locked', (evt) => { frm_locked(self, evt) });
	frm.addEventListener('unlocked', (evt) => { frm_unlocked(self, evt) });
	frm.render()

	btn_edit.addEventListener('click', (evt)=>{ btn_edit_click(self, evt) })
	btn_save.addEventListener('click', (evt)=>{ btn_save_click(self, evt)  })
	btn_new.addEventListener('click', (evt)=>{ btn_new_click(self, evt) })
	btn_del.addEventListener('click', (evt)=>{ btn_del_click(self, evt) })
	btn_reset.addEventListener('click', (evt)=>{ btn_reset_click(self, evt)})
	btn_prev.addEventListener('click', (evt)=>{ btn_prev_click(self, evt)})
	btn_next.addEventListener('click', (evt)=>{ btn_next_click(self, evt)})
	

	btn_recordstatus.addEventListener('click', evt=>{ btn_recordstatus_click(self, evt) })	
	btn_logs.addEventListener('click', evt=>{ btn_logs_click(self, evt) })	

	CurrentState.headerFormLocked = true 
	CurrentState.editDisabled = false

	CurrentState.Actions = {
		newdata: btn_new,
		edit: btn_edit,
	}

	CurrentState.getHeaderForm = () => {
		const jurnalHeaderEdit = self.Modules.jurnalHeaderEdit
		const frmHeader = jurnalHeaderEdit.getHeaderForm()
		return frmHeader
	}


	
	// Combobox: obj_coa_id
	obj_coa_id.addEventListener('selected', (evt)=>{
		const fn_selected_name = 'obj_coa_id_selected'
		const fn_selected = Extender[fn_selected_name]
		if (typeof fn_selected === 'function') {
			// create function di Extender:
			// export async function obj_coa_id_selected(self, obj_coa_id, frm, evt) {}
			fn_selected(self, obj_coa_id, frm, evt)
		} else {	
			console.warn('Extender.obj_coa_id_selected is not implemented')
		}		
	})
	obj_coa_id.addEventListener('selecting', async (evt)=>{
		const fn_selecting_name = 'obj_coa_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_coa_id_selecting(self, obj_coa_id, frm, evt) {}
			fn_selecting(self, obj_coa_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'coa/header-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			evt.detail.CurrentState = CurrentState
			
			// buat function di extender:
			// export function obj_coa_id_selecting_criteria(self, obj_coa_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_coa_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_coa_id, frm, criteria, sort, evt)
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
					evt.detail.addRow(row.coa_id, row.coa_name, row)
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
	obj_partner_id.addEventListener('selecting', async (evt)=>{
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
			const url = `${Context.appsUrls.ent.url}/partner/header-list`
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			evt.detail.CurrentState = CurrentState
			
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
	
	// Combobox: obj_dept_id
	obj_dept_id.addEventListener('selecting', async (evt)=>{
		const fn_selecting_name = 'obj_dept_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_dept_id_selecting(self, obj_dept_id, frm, evt) {}
			fn_selecting(self, obj_dept_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = `${Context.appsUrls.ent.url}/dept/header-list`
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			evt.detail.CurrentState = CurrentState
			
			// buat function di extender:
			// export function obj_dept_id_selecting_criteria(self, obj_dept_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_dept_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_dept_id, frm, criteria, sort, evt)
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
					evt.detail.addRow(row.dept_id, row.dept_name, row)
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
			const url = `${Context.appsUrls.ent.url}/site/header-list`
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			evt.detail.CurrentState = CurrentState
			
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
			const url = `${Context.appsUrls.ent.url}/unit/header-list`
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			evt.detail.CurrentState = CurrentState
			
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
	
	// Combobox: obj_project_id
	obj_project_id.addEventListener('selecting', async (evt)=>{
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
			const url = `${Context.appsUrls.prj.url}/project/header-list`
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			evt.detail.CurrentState = CurrentState
			
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
	
	// Combobox: obj_curr_id
	obj_curr_id.addEventListener('selected', (evt)=>{
		const fn_selected_name = 'obj_curr_id_selected'
		const fn_selected = Extender[fn_selected_name]
		if (typeof fn_selected === 'function') {
			// create function di Extender:
			// export async function obj_curr_id_selected(self, obj_curr_id, frm, evt) {}
			fn_selected(self, obj_curr_id, frm, evt)
		} else {	
			console.warn('Extender.obj_curr_id_selected is not implemented')
		}		
	})
	obj_curr_id.addEventListener('selecting', async (evt)=>{
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
			const url = `${Context.appsUrls.ent.url}/curr/header-list`
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			evt.detail.CurrentState = CurrentState
			
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
					evt.detail.addRow(row.curr_id, row.curr_code, row)
				}

				dialog.setNext(result.nextoffset, result.limit)
			} catch (err) {
				$fgta5.MessageBox.error(err.message)
			} finally {
				cbo.wait(false)
			}

			
		}		
	})
	obj_curr_id.addEventListener('populating', (evt)=>{
		const fn_populating_name = 'obj_curr_id_populating'
		const fn_populating = Extender[fn_populating_name]
		if (typeof fn_populating === 'function') {
			// create function di Extender:
			// export async function obj_curr_id_populating(self, obj_curr_id, frm, evt) {}
			fn_populating(self, obj_curr_id, frm, evt)
		} else {	
			console.warn('Extender.obj_curr_id_populating is not implemented')
		}		
	})
	
	// Numberbox: obj_jurnaldetil_value
	obj_jurnaldetil_value.addEventListener('changed', (evt)=>{
		const fn_changed_name = 'obj_jurnaldetil_value_changed'
		const fn_changed = Extender[fn_changed_name]
		if (typeof fn_changed === 'function') {
			// create function di Extender:
			// export async function obj_jurnaldetil_value_changed(self, obj_jurnaldetil_value, frm, evt) {}
			fn_changed(self, obj_jurnaldetil_value, frm, evt)
		} else {	
			console.warn('Extender.obj_jurnaldetil_value_changed is not implemented')
		}		
	})
	
	// Numberbox: obj_curr_rate
	obj_curr_rate.addEventListener('changed', (evt)=>{
		const fn_changed_name = 'obj_curr_rate_changed'
		const fn_changed = Extender[fn_changed_name]
		if (typeof fn_changed === 'function') {
			// create function di Extender:
			// export async function obj_curr_rate_changed(self, obj_curr_rate, frm, evt) {}
			fn_changed(self, obj_curr_rate, frm, evt)
		} else {	
			console.warn('Extender.obj_curr_rate_changed is not implemented')
		}		
	})
		
}


export async function openSelectedData(self, params) {
	console.log('openSelectedData')

	let mask = $fgta5.Modal.createMask()
	try {
		obj_coa_id.clear()
		obj_partner_id.clear()
		obj_dept_id.clear()
		obj_site_id.clear()
		obj_unit_id.clear()
		obj_project_id.clear()
		obj_curr_id.clear()
		
		const id = params.keyvalue
		const data = await openData(self, id)

		

		CurrentState.currentOpenedId = id
		
		
		// jika posisi header dalam keadaan unlock (bisa edit, perlu cek kondisi data, untuk menentukan bisa diedit atau tidak)
		if (!CurrentState.headerFormLocked) {
			const fn_iseditdisabled_name = 'jurnalDetilEdit_isEditDisabled'
			const fn_iseditdisabled = Extender[fn_iseditdisabled_name]
			if (typeof fn_iseditdisabled === 'function') {
				const editDisabled = fn_iseditdisabled(self, data)
				CurrentState.editDisabled = editDisabled
			}
		}

		// disable primary key
		setPrimaryKeyState(self, {disabled:true})

		// isi form dengan data
		frm.setData(data)
	
		// jika ada kebutuhan untuk oleh lagi form dan data, bisa lakukan di extender
		// export function jurnalDetilEdit_formOpened(self, frm, CurrentState) {}
		const fn_formopened_name = 'jurnalDetilEdit_formOpened'
		const fn_formopened = Extender[fn_formopened_name]
		if (typeof fn_formopened === 'function') {
			fn_formopened(self, frm, CurrentState)
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

export function getCurrentState(self) {
	return CurrentState
}

export function getForm(self) {
	return frm
}

export function clearForm(self, text) {
	frm.clear(text)
}

export function headerLocked(self) {
	CurrentState.headerFormLocked = true
	CurrentState.editDisabled = true
	btn_new.disabled = true

	// Extender untuk event Locked
	// export function jurnalDetilEdit_formLocked(self, frm, CurrentState) {}
	const fn_name = 'jurnalDetilEdit_formLocked'
	const fn = Extender[fn_name]
	if (typeof fn === 'function') {
		fn(self, frm, CurrentState)
	}	
}

export function headerUnlocked(self) {
	CurrentState.headerFormLocked = false
	CurrentState.editDisabled = false
	btn_new.disabled = false

	// Extender untuk event Unlocked
	// export function jurnalDetilEdit_formUnlocked(self, frm, CurrentState) {}
	const fn_name = 'jurnalDetilEdit_formUnlocked'
	const fn = Extender[fn_name]
	if (typeof fn === 'function') {
		fn(self, frm, CurrentState)
	}	
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
	const url = `/${Context.moduleName}/detil-open`
	try {
		const result = await Module.apiCall(url, { id }) 
		return result 
	} catch (err) {
		throw err	
	} 	
}

async function createData(self, data, formData) {
	const url = `/${Context.moduleName}/detil-create`
	try {
		const result = await Module.apiCall(url, { data, source: Source }, formData) 
		return result 
	} catch (err) {
		throw err	
	} 	
}

async function updateData(self, data, formData) {
	const url = `/${Context.moduleName}/detil-update`
	try {
		const result = await Module.apiCall(url, { data, source: Source }, formData) 
		return result 
	} catch (err) {
		throw err	
	} 
}

async function deleteData(self, id) {
	const url = `/${Context.moduleName}/detil-delete`
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
		const listId =  Context.Sections.jurnalDetilList
		const listSection = Crsl.Items[listId]
		listSection.show({direction: 1})
	}
}


async function  frm_locked(self, evt) {
	console.log('frm_locked')

	CurrentSection.Title = TitleWhenView

	btn_edit.setText(EditModeText)

	//  todo: cek dulu apakah boleh add/remove rows 

	btn_edit.disabled = false
	btn_save.disabled = true
	btn_new.disabled = false
	btn_del.disabled = true
	btn_reset.disabled = true
	btn_prev.disabled = false
	btn_next.disabled = false


	// Extender untuk event locked
	// export function jurnalDetilEdit_formLocked(self, frm, CurrentState) {}
	const fn_name = 'jurnalDetilEdit_formLocked'
	const fn = Extender[fn_name]
	if (typeof fn === 'function') {
		fn(self, frm, CurrentState)
	}	

	// jika heder form dalam kondisi lock,
	// tetap tidak bisa hapus
	if (CurrentState.editDisabled) {
		btn_edit.disabled = true
		btn_new.disabled = true
	} 

}

async function  frm_unlocked(self, evt) {
	console.log('frm_unlocked')

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

	// Extender untuk event Unlocked
	// export function jurnalDetilEdit_formUnlocked(self, frm) {}
	const fn_name = 'jurnalDetilEdit_formUnlocked'
	const fn = Extender[fn_name]
	if (typeof fn === 'function') {
		fn(self, frm)
	}
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
	console.log('new')
	const sourceSection = evt.target.getAttribute('data-sectionsource') 

	const jurnalDetilList = self.Modules.jurnalDetilList
	const listsecid = jurnalDetilList.Section.Id
	const fromListSection = sourceSection===listsecid

	if (fromListSection) {
		console.log('tambahkan row baru')
		CurrentSection.setSectionReturn(jurnalDetilList.Section)
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
	
		// ambil id header
		const jurnalHeaderEdit = self.Modules.jurnalHeaderEdit
		const frmHeader = jurnalHeaderEdit.getHeaderForm()
		const header_pk = frmHeader.getPrimaryInput()
		const jurnal_id = header_pk.value

		// inisiasi data baru
		const datainit = {
			jurnal_id,
			jurnaldetil_value: 0,
			curr_rate: 1,
			jurnaldetil_idr: 0,
		}


		// jika perlu modifikasi data initial,
		// atau dialog untuk opsi data baru, 
		// dapat dibuat di Extender.newData
		// export async function jurnalDetilEdit_newData(self, datainit, frm, CurrentState) {}
		const fn_newdata_name = 'jurnalDetilEdit_newData'
		const fn_newdata = Extender[fn_newdata_name]
		if (typeof fn_newdata === 'function') {
			await fn_newdata(self, datainit, frm, CurrentState)
		}

		// buat data baru
		await newData(self, datainit)

		// buka lock, agar user bisa edit
		frm.lock(false)

		// matikan tombol edit dan del saat kondisi form adalah data baru 
		btn_edit.disabled = true
		btn_del.disabled = true
	} catch (err) {
		console.error(err)
		await $fgta5.MessageBox.error(err.message)
		if (fromListSection) {
			// jika saat tombol baru dipilih saat di list, tampilan kembalikan ke list
			self.Modules.jurnalDetilList.Section.show()
		}
	}
}


async function btn_save_click(self, evt) {
	console.log('btn_save_click')

	// Extender Autofill
	// export async function jurnalDetilEdit_autofill(self, frm) {}
	const fn_autofill_name = 'jurnalDetilEdit_autofill'
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
	// export async function jurnalDetilEdit_dataSaving(self, dataToSave, frm, args) {}
	const args = { cancelSave: false }
	const fn_datasaving_name = 'jurnalDetilEdit_dataSaving'
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
		// export async function jurnalDetilEdit_dataSaved(self, data, frm) {}
		const fn_datasaved_name = 'jurnalDetilEdit_dataSaved'
		const fn_datasaved = Extender[fn_datasaved_name]
		if (typeof fn_datasaved === 'function') {
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
			self.Modules.jurnalDetilList.addNewRow(self, data)
		} else {
			console.log('update data baris yang dibuka')
			self.Modules.jurnalDetilList.updateCurrentRow(self, data)
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
		self.Modules.jurnalDetilList.removeCurrentRow(self)
		
		// kembali ke list
		self.Modules.jurnalDetilList.Section.show()


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
	self.Modules.jurnalDetilList.selectPreviousRow(self)
}

async function btn_next_click(self, evt) {
	console.log('btn_next_click')
	self.Modules.jurnalDetilList.selectNextRow(self)
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


			// jika mau menambah beberapa informasi mengenai record,
			// misalnya commit by, postby, dll
			// melalui extender jurnalDetilEdit_addRecordInfo
			// export async function jurnalDetilEdit_addRecordInfo(self,  data) {}
			const fn_addrecordinfo_name = 'jurnalDetilEdit_addRecordInfo'
			const fn_addrecordinfo = Extender[fn_addrecordinfo_name]
			if (typeof fn_addrecordinfo === 'function') {
				await fn_addrecordinfo(self,  data)
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

			const url = `${Context.appsUrls.core.url}/logs/list`
			const criteria = {
				module: Context.moduleName,
				table: 'act.jurnaldetil',
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