import Context from './paymreq-context.mjs'
import * as Ext from './paymreq-ext.mjs'

const Extender = Ext.extenderDetil ?? Ext

const Crsl =  Context.Crsl
const CurrentSectionId = Context.Sections.paymreqDetilList
const CurrentSection = Crsl.Items[CurrentSectionId]
const CurrentState = {}

const tbl =  new $fgta5.Gridview('paymreqDetilList-tbl')

const btn_addrow = document.getElementById('paymreqDetilList-btn_addrow') // tidak perlu pakai action, karna action didefine di edit
const btn_delrow = new $fgta5.ActionButton('paymreqDetilList-btn_delrow')

let headerForm

export const Section = CurrentSection


export async function init(self, args) {

	// Back
	CurrentSection.addEventListener($fgta5.Section.EVT_BACKBUTTONCLICK, async (evt)=>{
		const sectionId =  Context.Sections.paymreqHeaderEdit
		const section = Crsl.Items[sectionId]
		section.show({direction: 1})
	})


	tbl.addEventListener('nextdata', async evt=>{ tbl_nextdata(self, evt) })
	tbl.addEventListener('sorting', async evt=>{ tbl_sorting(self, evt) })

	// tambahkan event lain di extender: rowrender, rowremoving
	// dapatkan parameternya di evt.detail
	// export function detilList_addTableEvents(self, tbl) {}
	const fn_addTableEvents_name = 'detilList_addTableEvents'
	const fn_addTableEvents = Extender[fn_addTableEvents_name]
	if (typeof fn_addTableEvents === 'function') {
		fn_addTableEvents(self, tbl)
	}

	if (Module.isMobileDevice()) {
		tbl.addEventListener('cellclick', async evt=>{ tbl_cellclick(self, evt) })
	} else {
		tbl.addEventListener('celldblclick', async evt=>{ tbl_cellclick(self, evt) })
	}


	btn_delrow.addEventListener('click', (evt)=>{ btn_delrow_click(self, evt) })
	
	// Extend list detil
	// export function paymreqDetilList_init(self) {}
	const fn_name = 'paymreqDetilList_init'
	const fn_paymreqDetilList_init = Extender[fn_name]
	if (typeof fn_paymreqDetilList_init === 'function') {
		fn_paymreqDetilList_init(self)
	}

	CurrentState.headerFormLocked = true 
}

function setDefaultHeadTitle(self, headerForm) {
	const data = headerForm.getData()

	

}


export async function openList(self, params) {
	const moduleHeaderEdit = params.moduleHeaderEdit
	
	headerForm = moduleHeaderEdit.getHeaderForm() 
	const pk = headerForm.getPrimaryInput()
	const id = pk.value 

	// set title halaman ini sesuai data di header
	setDefaultHeadTitle(self, headerForm)

	// apabila mau menambahkan informasi saat detil list dibuka,
	// misalnya menambahkan informasi beberapa data dari formHeader
	// bisa di set pada Extender.paymreqDetilList_openList :  bisa menggunakan template untuk di embed ke header pada detil list
	// export function paymreqDetilList_openList(self, headerForm) {}
	const fn_name = 'paymreqDetilList_openList'
	const fn_paymreqDetilList_openList = Extender[fn_name]
	if (typeof fn_paymreqDetilList_openList === 'function') {
		fn_paymreqDetilList_openList(self, headerForm)
	}
	
	const criteria={
		paymreq_id: id
	}
	const sort = tbl.getSort()

	tbl.clear()
	tbl_loadData(self, {criteria, sort})

	const paymreqDetilEdit = self.Modules.paymreqDetilEdit
	const btn_addrow = paymreqDetilEdit.getCurrentState().Actions.newdata
	const btn_edit = paymreqDetilEdit.getCurrentState().Actions.edit
	
	if (CurrentState.headerFormLocked) {
 		btn_addrow.disabled = true
		btn_delrow.disabled = true
	} else {
		btn_addrow.disabled = false
		btn_delrow.disabled = false
	}
}

export function getGrid(self) {
	return tbl
}

export function getCurrentRow(self) {
	return CurrentState.SelectedRow
}

export function addNewRow(self, data) {
	const tr = tbl.addRow(data)
	setCurrentRow(self, tr)
}

export function updateCurrentRow(self, data) {
	const tr = CurrentState.SelectedRow

	try {
		tbl.updateRow(tr, data)
	} catch (err) {
		throw err
	}
}

export function removeCurrentRow(self) {
	const tr = CurrentState.SelectedRow
	tbl.removeRow(tr)
}

export function selectNextRow(self) {
	const tr = CurrentState.SelectedRow
	if (tr.nextElementSibling) {
		tbl.CurrentRow = tr.nextElementSibling
		openRow(self, tr.nextElementSibling)
	}
}

export function selectPreviousRow(self) {
	const tr = CurrentState.SelectedRow
	if (tr.previousElementSibling) {
		tbl.CurrentRow = tr.previousElementSibling
		openRow(self, tr.previousElementSibling)
	}
}

export function setPagingButton(self,  editModule) {
	const tr = CurrentState.SelectedRow
	
	if (tr.previousElementSibling) {
		editModule.disablePrevButton(self, false)
	} else {
		editModule.disablePrevButton(self, true)
	}

	if (tr.nextElementSibling) {
		editModule.disableNextButton(self, false)
	} else {
		editModule.disableNextButton(self, true)
	}

}

export function headerLocked(self) {
	console.log('header locked')
	CurrentState.headerFormLocked = true 
}

export function headerUnlocked(self) {
	console.log('header unlocked')
	CurrentState.headerFormLocked = false
}


export function keyboardAction(self, actionName) {
	if (actionName=='up') {
		tbl.previousRecord()
	} else if (actionName=='down') {
		tbl.nextRecord()
	} else if (actionName=='enter') {
		const paymreqDetilEdit = self.Modules.paymreqDetilEdit
		if (tbl.CurrentRow!=null) {
			paymreqDetilEdit.Section.show({}, (evt)=>{
				openRow(self, tbl.CurrentRow)
			})
		}
	}
}


function setCurrentRow(self, tr) {
	CurrentState.SelectedRow = tr
	tbl.CurrentRow = tr
}


async function openRow(self, tr) {
	if (tr==null) {
		return
	}

	const keyvalue = tr.getAttribute('keyvalue')
	const key = tr.getAttribute('key')

	const paymreqDetilEdit = self.Modules.paymreqDetilEdit
	paymreqDetilEdit.clearForm(self, 'loading...')

	try {
		setCurrentRow(self, tr)
		CurrentState.SelectedRow.keyValue = keyvalue
		CurrentState.SelectedRow.key = key
		await paymreqDetilEdit.openSelectedData(self, {key:key, keyvalue:keyvalue})
	} catch (err) {
		console.error(err)
		await $fgta5.MessageBox.error(err.message)

		setCurrentRow(self, null)
		CurrentSection.show() // kembalikan ke list kalau error saat buka data
	}

	// matikan atau nyalakan button prev/next sesuai kondisi
	setPagingButton(self, paymreqDetilEdit)
}


async function listRows(self, criteria, offset, limit, sort) {
	const url = `/${Context.moduleName}/detil-list`
	const evt = { url, limit }

	// export function detilList_dataLoad(self, criteria, sort, evt) {}
	const fn_dataLoad_name = 'detilList_dataLoad'
	const fn_dataLoad = Extender[fn_dataLoad_name]
	if (typeof fn_dataLoad === 'function') {
		fn_dataLoad(self, criteria, sort, evt)
	}

	try {
		const columns = []
		const result = await Module.apiCall(evt.url, {  
			columns,
			criteria,
			offset,
			limit: evt.limit,
			sort
		}) 
		return result 
	} catch (err) {
		throw err	
	} 
}


async function deleteRows(self, data) {
	const url = `/${Context.moduleName}/detil-delete-rows`
	try {
		
		const result = await Module.apiCall(url, { data }) 
		if (result.deleted) {
			return true
		} else {
			throw new Error(result.message)
		}	
	} catch (err) {
		throw err	
	} 
}

async function tbl_nextdata(self, evt) {
	const criteria = evt.detail.criteria
	const limit = evt.detail.limit
	const offset = evt.detail.nextoffset
	const sort = evt.detail.sort

	await tbl_loadData(self, {criteria, limit, offset, sort})
	tbl.scrollToFooter()
}

async function tbl_sorting(self, evt) {
	tbl.clear()
	const sort = evt.detail.sort
	const criteria = evt.detail.Criteria
	tbl_loadData(self, {criteria, sort})
}

async function tbl_cellclick(self, evt) {
	const tr = evt.detail.tr

	const paymreqDetilEdit = self.Modules.paymreqDetilEdit
	paymreqDetilEdit.Section.show({}, (evt)=>{
		openRow(self, tr)
	})
}


async function tbl_loadData(self, params={}) {
	const { criteria={}, limit=0, offset=0, sort={} } = params
	
	let mask = $fgta5.Modal.createMask()
	try {
		const result = await listRows(self, criteria, offset,limit, sort)

		if (offset===0) {
			tbl.clear()
		}


		tbl.setCriteria(criteria)
		tbl.addRows(result.data)
		tbl.setNext(result.nextoffset, result.limit)


		// export function detilList_tableDataLoaded(self, tbl, result) {}
		const fn_name = 'detilList_tableDataLoaded'
		const fn = Extender[fn_name]
		if (typeof fn === 'function') {
			fn(self, tbl, result)
		}


	} catch (err) {
		console.error(err)
		$fgta5.MessageBox.error(err.message)
	} finally {
		mask.close()
		mask = null
	}	
}


async function btn_delrow_click(self, evt) {
	// cek dahulu apakah ada data yang dipilih
	const selected = tbl.getSelected()
	if (selected.length==0) {
		return
	}

	// konfirmasi apakah yakin mau dihapus
	var ret = await $fgta5.MessageBox.confirm(`Apakah anda yakin akan menghappus ${selected.length} data yang dipilih?`)
	if (ret!='ok') {
		return
	}

	let mask = $fgta5.Modal.createMask()
	try {
		const deleted = await deleteRows(self, selected)
		if (deleted) {
			tbl.removeSelected()
		}
	} catch (err) {
		console.error(err)
		$fgta5.MessageBox.error(err.message)
	} finally {
		mask.close()
		mask = null
	}
	
}
