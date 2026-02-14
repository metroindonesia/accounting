import Context from './paymreq-context.mjs'
import * as Ext from './paymreq-ext.mjs'
import * as pageHelper from '/public/libs/webmodule/pagehelper.mjs'

const Extender = Ext.extenderDetil ?? Ext


const CurrentState = {}
const Crsl =  Context.Crsl
const CurrentSectionId = Context.Sections.paymreqDetilEdit
const CurrentSection = Crsl.Items[CurrentSectionId]
const Source = Context.Source

const TitleWhenNew = 'New Detil'
const TitleWhenView = 'View Detil'
const TitleWhenEdit = 'Edit Detil'
const EditModeText = 'Edit'
const LockModeText = 'Lock'



const btn_edit = new $fgta5.ActionButton('paymreqDetilEdit-btn_edit')
const btn_save = new $fgta5.ActionButton('paymreqDetilEdit-btn_save')
const btn_new = new $fgta5.ActionButton('paymreqDetilEdit-btn_new', 'paymreqDetil-addrow')
const btn_del = new $fgta5.ActionButton('paymreqDetilEdit-btn_delete', 'paymreqDetil-delrow')
const btn_reset = new $fgta5.ActionButton('paymreqDetilEdit-btn_reset')
const btn_prev = new $fgta5.ActionButton('paymreqDetilEdit-btn_prev')
const btn_next = new $fgta5.ActionButton('paymreqDetilEdit-btn_next')

const btn_recordstatus = document.getElementById('paymreqDetil-btn_recordstatus')
const btn_logs = document.getElementById('paymreqDetil-btn_logs')

const frm = new $fgta5.Form('paymreqDetilEdit-frm');
const obj_paymreqdetil_id = frm.Inputs['paymreqDetilEdit-obj_paymreqdetil_id']
const obj_itemclass_id = frm.Inputs['paymreqDetilEdit-obj_itemclass_id']
const obj_paymreqdetil_descr = frm.Inputs['paymreqDetilEdit-obj_paymreqdetil_descr']
const obj_paymreqdetil_value = frm.Inputs['paymreqDetilEdit-obj_paymreqdetil_value']
const obj_paymreq_id = frm.Inputs['paymreqDetilEdit-obj_paymreq_id']	
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
		const paymreqHeaderEdit = self.Modules.paymreqHeaderEdit
		const frmHeader = paymreqHeaderEdit.getHeaderForm()
		return frmHeader
	}


	
	// Combobox: obj_itemclass_id
	obj_itemclass_id.addEventListener('selecting', async (evt)=>{
		const fn_selecting_name = 'obj_itemclass_id_selecting'
		const fn_selecting = Extender[fn_selecting_name]
		if (typeof fn_selecting === 'function') {
			// create function di Extender (jika perlu):
			// export async function obj_itemclass_id_selecting(self, obj_itemclass_id, frm, evt) {}
			fn_selecting(self, obj_itemclass_id, frm, evt)
		} else {
			// default selecting
			const cbo = evt.detail.sender
			const dialog = evt.detail.dialog
			const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
			const url = 'itemclass/header-list'
			const sort = {}
			const criteria = {
				searchtext: searchtext,
			}

			evt.detail.url = url 
			evt.detail.CurrentState = CurrentState
			
			// buat function di extender:
			// export function obj_itemclass_id_selecting_criteria(self, obj_itemclass_id, frm, criteria, sort, evt) {}
			const fn_selecting_criteria_name = 'obj_itemclass_id_selecting_criteria'
			const fn_selecting_criteria = Extender[fn_selecting_criteria_name]
			if (typeof fn_selecting_criteria === 'function') {
				fn_selecting_criteria(self, obj_itemclass_id, frm, criteria, sort, evt)
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
					evt.detail.addRow(row.itemclass_id, row.itemclass_name, row)
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
		obj_itemclass_id.clear()
		
		const id = params.keyvalue
		const data = await openData(self, id)

		

		CurrentState.currentOpenedId = id
		
		
		// jika posisi header dalam keadaan unlock (bisa edit, perlu cek kondisi data, untuk menentukan bisa diedit atau tidak)
		if (!CurrentState.headerFormLocked) {
			const fn_iseditdisabled_name = 'paymreqDetilEdit_isEditDisabled'
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
		// export function paymreqDetilEdit_formOpened(self, frm, CurrentState) {}
		const fn_formopened_name = 'paymreqDetilEdit_formOpened'
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
	// export function paymreqDetilEdit_formLocked(self, frm, CurrentState) {}
	const fn_name = 'paymreqDetilEdit_formLocked'
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
	// export function paymreqDetilEdit_formUnlocked(self, frm, CurrentState) {}
	const fn_name = 'paymreqDetilEdit_formUnlocked'
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
		const listId =  Context.Sections.paymreqDetilList
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
	// export function paymreqDetilEdit_formLocked(self, frm, CurrentState) {}
	const fn_name = 'paymreqDetilEdit_formLocked'
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
	// export function paymreqDetilEdit_formUnlocked(self, frm) {}
	const fn_name = 'paymreqDetilEdit_formUnlocked'
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

	const paymreqDetilList = self.Modules.paymreqDetilList
	const listsecid = paymreqDetilList.Section.Id
	const fromListSection = sourceSection===listsecid

	if (fromListSection) {
		console.log('tambahkan row baru')
		CurrentSection.setSectionReturn(paymreqDetilList.Section)
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
		const paymreqHeaderEdit = self.Modules.paymreqHeaderEdit
		const frmHeader = paymreqHeaderEdit.getHeaderForm()
		const header_pk = frmHeader.getPrimaryInput()
		const paymreq_id = header_pk.value

		// inisiasi data baru
		const datainit = {
			paymreq_id,
			paymreqdetil_value: 0,
		}


		// jika perlu modifikasi data initial,
		// atau dialog untuk opsi data baru, 
		// dapat dibuat di Extender.newData
		// export async function paymreqDetilEdit_newData(self, datainit, frm, CurrentState) {}
		const fn_newdata_name = 'paymreqDetilEdit_newData'
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
			self.Modules.paymreqDetilList.Section.show()
		}
	}
}


async function btn_save_click(self, evt) {
	console.log('btn_save_click')

	// Extender Autofill
	// export async function paymreqDetilEdit_autofill(self, frm) {}
	const fn_autofill_name = 'paymreqDetilEdit_autofill'
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
	// export async function paymreqDetilEdit_dataSaving(self, dataToSave, frm, args) {}
	const args = { cancelSave: false }
	const fn_datasaving_name = 'paymreqDetilEdit_dataSaving'
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
		// export async function paymreqDetilEdit_dataSaved(self, data, frm) {}
		const fn_datasaved_name = 'paymreqDetilEdit_dataSaved'
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
			self.Modules.paymreqDetilList.addNewRow(self, data)
		} else {
			console.log('update data baris yang dibuka')
			self.Modules.paymreqDetilList.updateCurrentRow(self, data)
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

		// Extender Deleting
		// export async function paymreqDetilEdit_dataDeleting(self, id, args) {}
		const args = { cancelDelete: false }
		const fn_datadeleting_name = 'paymreqDetilEdit_dataDeleting'
		const fn_datadeleting = Extender[fn_datadeleting_name]
		if (typeof fn_datadeleting === 'function') {
			await fn_datadeleting(self, idValue, args)
		}

		// batalkan save, jika ada request cancel
		if (args.cancelDelete) {
			console.log('delete is canceled')
			return
		}

		const result = await deleteData(self, idValue)
		
		

		// Extender Delete
		// export async function paymreqDetilEdit_dataDeleted(self, data) {}
		const fn_datadeleted_name = 'paymreqDetilEdit_dataDeleted'
		const fn_datadeleted = Extender[fn_datadeleted_name]
		if (typeof fn_datadeleted === 'function') {
			await fn_datadeleted(self, result)
		}


		// hapus current row yang dipilih di list
		self.Modules.paymreqDetilList.removeCurrentRow(self)

		// kembali ke list
		self.Modules.paymreqDetilList.Section.show()


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
	self.Modules.paymreqDetilList.selectPreviousRow(self)
}

async function btn_next_click(self, evt) {
	console.log('btn_next_click')
	self.Modules.paymreqDetilList.selectNextRow(self)
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
			// melalui extender paymreqDetilEdit_addRecordInfo
			// export async function paymreqDetilEdit_addRecordInfo(self,  data) {}
			const fn_addrecordinfo_name = 'paymreqDetilEdit_addRecordInfo'
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


			const logApp = Context.appsUrls.core ?? Context.appsUrls[Context.appName]
			const url = `${logApp.url}/logs/list`
			const criteria = {
				module: Context.moduleName,
				table: 'public.paymreqdetil',
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