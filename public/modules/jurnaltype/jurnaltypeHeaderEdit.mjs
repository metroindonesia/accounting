import Context from './jurnaltype-context.mjs'
import * as Ext from './jurnaltype-ext.mjs'
import * as pageHelper from '/public/libs/webmodule/pagehelper.mjs'

const Extender = Ext.extenderHeader ?? Ext


const Crsl =  Context.Crsl
const CurrentSectionId = Context.Sections.jurnaltypeHeaderEdit
const CurrentSection = Crsl.Items[CurrentSectionId]
const Source = Context.Source
const CurrentState = {}

const TitleWhenNew = 'New Jurnal Type'
const TitleWhenView = 'View Jurnal Type'
const TitleWhenEdit = 'Edit Jurnal Type'
const EditModeText = 'Edit'
const LockModeText = 'Lock'

const btn_edit = new $fgta5.ActionButton('jurnaltypeHeaderEdit-btn_edit')
const btn_save = new $fgta5.ActionButton('jurnaltypeHeaderEdit-btn_save')
const btn_new = new $fgta5.ActionButton('jurnaltypeHeaderEdit-btn_new', 'jurnaltypeHeader-new')
const btn_del = new $fgta5.ActionButton('jurnaltypeHeaderEdit-btn_delete')
const btn_reset = new $fgta5.ActionButton('jurnaltypeHeaderEdit-btn_reset')
const btn_prev = new $fgta5.ActionButton('jurnaltypeHeaderEdit-btn_prev')
const btn_next = new $fgta5.ActionButton('jurnaltypeHeaderEdit-btn_next')


const btn_recordstatus = document.getElementById('jurnaltypeHeader-btn_recordstatus')
const btn_logs = document.getElementById('jurnaltypeHeader-btn_logs')
const btn_about = document.getElementById('jurnaltypeHeader-btn_about')

const frm = new $fgta5.Form('jurnaltypeHeaderEdit-frm');
const obj_jurnaltype_id = frm.Inputs['jurnaltypeHeaderEdit-obj_jurnaltype_id']
const obj_jurnaltype_name = frm.Inputs['jurnaltypeHeaderEdit-obj_jurnaltype_name']
const obj_doc_id = frm.Inputs['jurnaltypeHeaderEdit-obj_doc_id']
const obj_jurnaltype_isallowselect = frm.Inputs['jurnaltypeHeaderEdit-obj_jurnaltype_isallowselect']
const obj_jurnaltype_descr = frm.Inputs['jurnaltypeHeaderEdit-obj_jurnaltype_descr']
const obj_jurnalmodel_id = frm.Inputs['jurnaltypeHeaderEdit-obj_jurnalmodel_id']
const obj_jurnaltype_headcopyto = frm.Inputs['jurnaltypeHeaderEdit-obj_jurnaltype_headcopyto']
const obj_jurnaltype_printout = frm.Inputs['jurnaltypeHeaderEdit-obj_jurnaltype_printout']
const obj_jurnaltype_printtitle = frm.Inputs['jurnaltypeHeaderEdit-obj_jurnaltype_printtitle']
const obj_isheadhaspaymreq = frm.Inputs['jurnaltypeHeaderEdit-obj_isheadhaspaymreq']
const obj_isheadhaspaymtype = frm.Inputs['jurnaltypeHeaderEdit-obj_isheadhaspaymtype']
const obj_isheadhascoa = frm.Inputs['jurnaltypeHeaderEdit-obj_isheadhascoa']
const obj_paymreqprocess = frm.Inputs['jurnaltypeHeaderEdit-obj_paymreqprocess']
const obj_isdetilallowgetap = frm.Inputs['jurnaltypeHeaderEdit-obj_isdetilallowgetap']
const obj_isdetilallowgetar = frm.Inputs['jurnaltypeHeaderEdit-obj_isdetilallowgetar']
const obj_ishasduedate = frm.Inputs['jurnaltypeHeaderEdit-obj_ishasduedate']
const obj_isheadallowchangeduedate = frm.Inputs['jurnaltypeHeaderEdit-obj_isheadallowchangeduedate']
const obj_isheadhasvalue = frm.Inputs['jurnaltypeHeaderEdit-obj_isheadhasvalue']
const obj_isheadallowchangevalue = frm.Inputs['jurnaltypeHeaderEdit-obj_isheadallowchangevalue']
const obj_isheadallowselectcurr = frm.Inputs['jurnaltypeHeaderEdit-obj_isheadallowselectcurr']
const obj_isheadhaspartner = frm.Inputs['jurnaltypeHeaderEdit-obj_isheadhaspartner']
const obj_isheadpartnermandatory = frm.Inputs['jurnaltypeHeaderEdit-obj_isheadpartnermandatory']
const obj_ispartnerdisabled = frm.Inputs['jurnaltypeHeaderEdit-obj_ispartnerdisabled']
const obj_isheadhasunit = frm.Inputs['jurnaltypeHeaderEdit-obj_isheadhasunit']
const obj_isheadunitmandatory = frm.Inputs['jurnaltypeHeaderEdit-obj_isheadunitmandatory']
const obj_isunitdisabled = frm.Inputs['jurnaltypeHeaderEdit-obj_isunitdisabled']
const obj_isheadhassite = frm.Inputs['jurnaltypeHeaderEdit-obj_isheadhassite']
const obj_isheadsitemandatory = frm.Inputs['jurnaltypeHeaderEdit-obj_isheadsitemandatory']
const obj_issitedisabled = frm.Inputs['jurnaltypeHeaderEdit-obj_issitedisabled']
const obj_isheadhasstruct = frm.Inputs['jurnaltypeHeaderEdit-obj_isheadhasstruct']
const obj_isheadstructmandatory = frm.Inputs['jurnaltypeHeaderEdit-obj_isheadstructmandatory']
const obj_isstructdisabled = frm.Inputs['jurnaltypeHeaderEdit-obj_isstructdisabled']
const obj_isheadhasproject = frm.Inputs['jurnaltypeHeaderEdit-obj_isheadhasproject']
const obj_isheadprojectmandatory = frm.Inputs['jurnaltypeHeaderEdit-obj_isheadprojectmandatory']
const obj_isheadallowselectproject = frm.Inputs['jurnaltypeHeaderEdit-obj_isheadallowselectproject']
const obj_isdetilhaspartner = frm.Inputs['jurnaltypeHeaderEdit-obj_isdetilhaspartner']
const obj_isdetilpartnermandatory = frm.Inputs['jurnaltypeHeaderEdit-obj_isdetilpartnermandatory']
const obj_isdetilallowselectpartner = frm.Inputs['jurnaltypeHeaderEdit-obj_isdetilallowselectpartner']
const obj_isdethasunit = frm.Inputs['jurnaltypeHeaderEdit-obj_isdethasunit']
const obj_isdetilunitmandatory = frm.Inputs['jurnaltypeHeaderEdit-obj_isdetilunitmandatory']
const obj_isdetilallowselectunit = frm.Inputs['jurnaltypeHeaderEdit-obj_isdetilallowselectunit']
const obj_isdethassite = frm.Inputs['jurnaltypeHeaderEdit-obj_isdethassite']
const obj_isdetilsitemandatory = frm.Inputs['jurnaltypeHeaderEdit-obj_isdetilsitemandatory']
const obj_isdetilallowselectsite = frm.Inputs['jurnaltypeHeaderEdit-obj_isdetilallowselectsite']
const obj_isdetilhasstruct = frm.Inputs['jurnaltypeHeaderEdit-obj_isdetilhasstruct']
const obj_isdetilstructmandatory = frm.Inputs['jurnaltypeHeaderEdit-obj_isdetilstructmandatory']
const obj_isdetilallowselectstruct = frm.Inputs['jurnaltypeHeaderEdit-obj_isdetilallowselectstruct']
const obj_isdetilhasproject = frm.Inputs['jurnaltypeHeaderEdit-obj_isdetilhasproject']
const obj_isdetilprojectmandatory = frm.Inputs['jurnaltypeHeaderEdit-obj_isdetilprojectmandatory']
const obj_isdetilallowselectproject = frm.Inputs['jurnaltypeHeaderEdit-obj_isdetilallowselectproject']	
const rec_createby = document.getElementById('fRecord-section-createby')
const rec_createdate = document.getElementById('fRecord-section-createdate')
const rec_modifyby = document.getElementById('fRecord-section-modifyby')
const rec_modifydate = document.getElementById('fRecord-section-modifydate')
const rec_id = document.getElementById('fRecord-section-id')


export const Section = CurrentSection


export async function init(self, args) {
	console.log('initializing jurnaltypeHeaderEdit ...')
	

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
	}
	
	// export async function jurnaltypeHeaderEdit_init(self, CurrentState)
	const fn_init_name = 'jurnaltypeHeaderEdit_init'
	const fn_init = Extender[fn_init_name]
	if (typeof fn_init === 'function') {
		await fn_init(self, CurrentState)
	}


	

	
	// Combobox: obj_doc_id
	obj_doc_id.addEventListener('selecting', async (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selecting_name = 'obj_doc_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_doc_id_selecting(self, obj_doc_id, frm, evt) {}
			fn_selecting(self, obj_doc_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'doc/header-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			
			// buat function di extender:
			// export function obj_doc_id_selecting_criteria(self, obj_doc_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_doc_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_doc_id, frm, criteria, sort, evt)
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
					evt.detail.addRow(row.doc_id, row.doc_name, row)
				}

				dialog.setNext(result.nextoffset, result.limit)
			} catch (err) {
				$fgta5.MessageBox.error(err.message)
			} finally {
				cbo.wait(false)
			}

			
		}		
	})
	
	
	// Combobox: obj_jurnalmodel_id
	obj_jurnalmodel_id.addEventListener('selected', (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selected_name = 'obj_jurnalmodel_id_selected'
		const fn_selected = Extender[fn_selected_name]
		if (typeof fn_selected === 'function') {
			// create function di Extender:
			// export async function obj_jurnalmodel_id_selected(self, obj_jurnalmodel_id, frm, evt) {}
			fn_selected(self, obj_jurnalmodel_id, frm, evt)
		} else {	
			console.warn('Extender.obj_jurnalmodel_id_selected is not implemented')
		}		
	})
	
	obj_jurnalmodel_id.addEventListener('selecting', async (evt)=>{
		
		evt.detail.CurrentState = CurrentState
		
		const fn_selecting_name = 'obj_jurnalmodel_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_jurnalmodel_id_selecting(self, obj_jurnalmodel_id, frm, evt) {}
			fn_selecting(self, obj_jurnalmodel_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'jurnalmodel/header-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			
			// buat function di extender:
			// export function obj_jurnalmodel_id_selecting_criteria(self, obj_jurnalmodel_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_jurnalmodel_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_jurnalmodel_id, frm, criteria, sort, evt)
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
					evt.detail.addRow(row.jurnalmodel_id, row.jurnalmodel_name, row)
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
		obj_doc_id.clear()
		obj_jurnalmodel_id.clear()
					
		const id = params.keyvalue
		const data = await openData(self, id)

		

		CurrentState.currentOpenedId = id

		// export async function jurnaltypeHeaderEdit_isEditDisabled(self, data)
		const fn_iseditdisabled_name = 'jurnaltypeHeaderEdit_isEditDisabled'
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
		// export async function jurnaltypeHeaderEdit_formOpened(self, frm, CurrentState)
		const fn_formopened_name = 'jurnaltypeHeaderEdit_formOpened'
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

export function getCurrentState(self) {
	return CurrentState
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
		const listId =  Context.Sections.jurnaltypeHeaderList
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

	
	
	// Extender untuk event locked
	// export function jurnaltypeHeaderEdit_formLocked(self, frm, CurrentState) {}
	const fn_name = 'jurnaltypeHeaderEdit_formLocked'
	const fn = Extender[fn_name]
	if (typeof fn === 'function') {
		fn(self, frm, CurrentState)
	}

	if (CurrentState.editDisabled) {
		// jika karena suatu kondisi data mengharuskan data tidak boleh diedit
		btn_edit.disabled = true
	}

	
	// trigger lock event di coa
	self.Modules.jurnaltypeCoaList.headerLocked(self)
	self.Modules.jurnaltypeCoaEdit.headerLocked(self)
	
	// trigger lock event di user
	self.Modules.jurnaltypeUserList.headerLocked(self)
	self.Modules.jurnaltypeUserEdit.headerLocked(self)
	
	// trigger lock event di paymreqtype
	self.Modules.jurnaltypePaymreqtypeList.headerLocked(self)
	self.Modules.jurnaltypePaymreqtypeEdit.headerLocked(self)
		

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

	

	// Extender untuk event Unlocked
	// export function jurnaltypeHeaderEdit_formUnlocked(self, frm, CurrentState) {}
	const fn_name = 'jurnaltypeHeaderEdit_formUnlocked'
	const fn = Extender[fn_name]
	if (typeof fn === 'function') {
		fn(self, frm, CurrentState)
	}

	
	// trigger unlock event di coa
	self.Modules.jurnaltypeCoaList.headerUnlocked(self)
	self.Modules.jurnaltypeCoaEdit.headerUnlocked(self)	
	
	// trigger unlock event di user
	self.Modules.jurnaltypeUserList.headerUnlocked(self)
	self.Modules.jurnaltypeUserEdit.headerUnlocked(self)	
	
	// trigger unlock event di paymreqtype
	self.Modules.jurnaltypePaymreqtypeList.headerUnlocked(self)
	self.Modules.jurnaltypePaymreqtypeEdit.headerUnlocked(self)	
		
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

	const jurnaltypeHeaderList = self.Modules.jurnaltypeHeaderList
	const listsecid = jurnaltypeHeaderList.Section.Id
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
		}


		// jika perlu modifikasi data initial,
		// atau dialog untuk opsi data baru, dapat dibuat di Extender
		const fn_newdata_name = 'jurnaltypeHeaderEdit_newData'
		const fn_newdata = Extender[fn_newdata_name]
		if (typeof fn_newdata === 'function') {
			// export async function jurnaltypeHeaderEdit_newData(self, datainit, frm) {}
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
			self.Modules.jurnaltypeHeaderList.Section.show()
		}
	}
}

async function btn_save_click(self, evt) {
	console.log('btn_save_click')


	// Extender Autofill
	const fn_autofill_name = 'jurnaltypeHeaderEdit_autofill'
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
	// export async function jurnaltypeHeaderEdit_dataSaving(self, dataToSave, frm, args) {}
	const args = { cancelSave: false }
	const fn_datasaving_name = 'jurnaltypeHeaderEdit_dataSaving'
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
		const fn_datasaved_name = 'jurnaltypeHeaderEdit_dataSaved'
		const fn_datasaved = Extender[fn_datasaved_name]
		if (typeof fn_datasaved === 'function') {
			// export async function jurnaltypeHeaderEdit_dataSaved(self, data, frm) {}
			await fn_datasaved(self, result, frm)
		}


		// persist perubahan di form
		frm.acceptChanges()


		if (isNewData) {
			// saat new data, posisi button toggle edit akan disabled
			// setelah berhasil save, nyalakan button edit (untuk lock)
			btn_edit.disabled = false

			// buat baris baru di grid
			console.log('tamabah baris baru di grid')
			self.Modules.jurnaltypeHeaderList.addNewRow(self, data)
		} else {
			console.log('update data baris yang dibuka')
			self.Modules.jurnaltypeHeaderList.updateCurrentRow(self, data)
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
		self.Modules.jurnaltypeHeaderList.removeCurrentRow(self)
		
		// kembali ke list
		self.Modules.jurnaltypeHeaderList.Section.show()


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
	self.Modules.jurnaltypeHeaderList.selectPreviousRow(self)
}

async function btn_next_click(self, evt) {
	console.log('btn_next_click')
	self.Modules.jurnaltypeHeaderList.selectNextRow(self)
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

			const fn_addrecordinfo_name = 'jurnaltypeHeaderEdit_addRecordInfo'
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
				table: 'public.jurnaltype',
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
		AboutSection.Title = 'About Jurnal Type'

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
			divFooter.innerHTML = 'This module is generated by fgta5 generator at 25 Feb 2026 16:08'
			section.appendChild(divFooter)
		}
		
	})
}