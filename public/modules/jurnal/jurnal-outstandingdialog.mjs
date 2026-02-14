import Context from './jurnal-context.mjs'


const SelectedEvent = (data) => { return new CustomEvent('selected', data) }

export default class {
	#title
	#eventListener = new EventTarget()
	#dlg
	#cboPartner
	#cboCoa
	#cboCurr
	#txtSearch
	#tbody
	#outstandingType
	#agingtypeId
	#rowTemplate
	
	get title() { return this.#title }
	get dialog() { return this.#dlg }
	get eventListener() { return this.#eventListener }
	get cboPartner() { return this.#cboPartner }
	get cboCoa() { return this.#cboCoa }
	get cboCurr() { return this.#cboCurr }
	get txtSearch() { return this.#txtSearch }
	get tableBody() { return this.#tbody }
	get rowTemplate() { return this.#rowTemplate }


	get outstandingType() { return this.#outstandingType }
	set outstandingType(v) { this.#outstandingType = v }

	get agingtypeId() { return this.#agingtypeId }
	set agingtypeId(v) { this.#agingtypeId = v }

	// set cboCoa(v) { this.#cboCoa = v}


	constructor() {
		const self = this

		this.#dlg = dialog_create(self)
		
		this.#cboPartner = new $fgta5.Combobox('dlg-obj_partner_id')
		this.#cboPartner.markAsRequired(true)
		this.#cboPartner.addEventListener('selecting', async (evt)=>{
			cboPartner_selecting(self, evt)
		})

		this.#cboCurr = new $fgta5.Combobox('dlg-obj_curr_id')
		this.#cboCurr.addEventListener('selecting', async (evt)=>{
			cboCurr_selecting(self, evt)
		})

		this.#cboCoa = new $fgta5.Combobox('dlg-obj_coa_id')
		this.#cboCoa.addEventListener('selecting', async (evt)=>{
			cboCoa_selecting(self, evt)
		})
		
		this.#txtSearch = new $fgta5.Textbox('dlg-obj_searchtext')


		this.#tbody = document.getElementById('dialog-outstanding-tablebody')

		// ambil template baris
		const tr = this.#tbody.querySelector('tr')
		this.#rowTemplate = tr.cloneNode(true)
		this.#tbody.innerHTML = ''	

	}


	show(title, param, fn_loader) {
		dialog_show(this, title, param, fn_loader)
	}

	addEventListener(name, evt) {
		this.#eventListener.addEventListener(name, evt)
	}

	setTitle(title) {
		const elTitle = document.getElementById('dialog-outstanding-title')
		elTitle.innerHTML = title
		this.#title = title
	}

	close() {
		this.dialog.close()
	}
}



function dialog_create(self) {
	const target = document.body
	const tpl = document.getElementById('tpl-dialog-outstanding')
	if (tpl==null) {
		console.error('Template dialog-outstanding belum dibuat')
		return null
	}

	const clone = tpl.content.cloneNode(true); // salin isi template
	const dlg = clone.querySelector('dialog')
	target.prepend(dlg)


	// setup close button
	const btnClose = document.getElementById('dialog-outstanding-closebutton')
	btnClose.addEventListener('click', (evt)=>{
		self.dialog.close()
	})

	const btnLoad = document.getElementById('dialog-outstanding-btnLoad')
	btnLoad.addEventListener('click', (evt)=>{
		btnLoad_click(self)
	})

	return dlg;
}


function dialog_show(self, outstandingtype) {
	const dlg = self.dialog;

	self.outstandingType = outstandingtype

	self.cboCoa.clear()
	self.cboCoa.setSelected(null)

	self.cboCurr.clear()
	self.cboCurr.setSelected(null)	

	self.txtSearch.value = ''
	
	if (outstandingtype=='AR') {
		self.setTitle('Receivable Outstanding')
		self.agingtypeId = 1
	} else {
		self.setTitle('Payable Outstanding')
		self.agingtypeId = 2
	}

	


	const frm = Context.program.Modules.jurnalHeaderEdit.getForm()
	// const data = frm.getData()

	const obj_partner = frm.Inputs['jurnalHeaderEdit-obj_partner_id']
	if (obj_partner.value!=null) {
		self.cboPartner.clear()
		self.cboPartner.setSelected(obj_partner.value, obj_partner.text)
		self.cboPartner.disabled = true

		dialog_loaddata(self, outstandingtype)
	} else {
		self.cboPartner.clear()
		self.cboPartner.setSelected(null)
		self.cboPartner.disabled = false
		self.tableBody.innerHTML = ''
	}


	const obj_curr = frm.Inputs['jurnalHeaderEdit-obj_curr_id']
	if (obj_curr.value!=null) {
		self.cboCurr.clear()
		self.cboCurr.setSelected(obj_curr.value, obj_curr.text)
		self.cboCurr.disabled = true
	} else {
		self.cboCurr.clear()
		self.cboCurr.setSelected(null)
		self.cboCurr.disabled = false
	}

	dlg.showModal()
}




function btnLoad_click(self) {
	dialog_loaddata(self, self.outstandingType)
}


function formatNumber(num) {
  return new Intl.NumberFormat("en-EN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
}


async function dialog_loaddata(self, outstandingtype) {
	self.tableBody.innerHTML = ''


	const frm = Context.program.Modules.jurnalHeaderEdit.getForm()
	

	const jurnal_id = frm.Inputs['jurnalHeaderEdit-obj_jurnal_id'].value
	const partner_id = self.cboPartner.value;
	const coa_id = self.cboCoa.value;
	const curr_id = self.cboCurr.value;
	const paymdate = frm.Inputs['jurnalHeaderEdit-obj_jurnal_date'].value
	const searchtext = self.txtSearch.value	


	if (partner_id==null) {
		$fgta5.MessageBox.warning('Partner harus diisi')
		return; // harus pilih dulu partnernya
	}


	let mask = $fgta5.Modal.createMask()
	try {
		const url = `/jurnal-outstanding/list-${outstandingtype}`
		const apiParam = { 
			jurnal_id,
			partner_id, 
			coa_id, 
			curr_id, 
			paymdate, 
			searchtext 
		}
		const rows = await Module.apiCall(url, apiParam)




		for (let row of rows) {
			let renderedHtml = self.rowTemplate.cloneNode(true).outerHTML.trim()
			for (const key in row) {
				if (row.hasOwnProperty(key)) {
					const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');  // Buat placeholder yang dicari: {{key}}
					let value = row[key]
					renderedHtml = renderedHtml.replace(placeholder, value);  // Ganti placeholder dengan nilai data
				}
			}

			const tempContainer = document.createElement('tbody');
			tempContainer.innerHTML = renderedHtml; 
			const tr = tempContainer.firstChild; 

			tr.addEventListener('dblclick', (evt)=>{
				dialog_rowselected(self, tr)
			})

			// format angka decimal
			const colsDecimals = tr.querySelectorAll("td[data-format=\"decimal\"]")
			for (let col of colsDecimals) {
				const text = col.innerHTML
				const value = Number(text)
				if (!isNaN(value)) {
					col.innerHTML = formatNumber(value)
				}
				col.style.textAlign = 'right'
			}

			// format tanggal
			const colsDate = tr.querySelectorAll("td[data-format=\"date\"]")
			for (let col of colsDate) {
				const text = col.innerHTML
				const date = new Date(text);
				const dd = String(date.getDate()).padStart(2, '0');
				const mm = String(date.getMonth() + 1).padStart(2, '0'); // bulan 0–11
				const yyyy = date.getFullYear();
				const result = `${dd}/${mm}/${yyyy}`;
				col.innerHTML = result
			}


			self.tableBody.appendChild(tr)
		}

	} catch (err) {
		$fgta5.MessageBox.error(err.message)
	} finally {
		mask.close()
		mask = null
	}
}

async function cboPartner_selecting(self, evt) {
	const cbo = evt.detail.sender
	const dialog = evt.detail.dialog
	const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
	const url = `${Context.appsUrls.ent.url}/partner/header-list`
	const sort = {}
	const criteria = {
		searchtext: searchtext,
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
			evt.detail.addRow(row.partner_id, row.partner_name, row)
		}

		dialog.setNext(result.nextoffset, result.limit)
	} catch (err) {
		$fgta5.MessageBox.error(err.message)
	} finally {
		cbo.wait(false)
	}
}


async function cboCoa_selecting(self, evt) {
const cbo = evt.detail.sender
	const dialog = evt.detail.dialog
	const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
	const url = 'coa/header-list'
	const sort = {}
	const criteria = {
		searchtext: searchtext,
		agingtype_id: self.agingtypeId,
		coa_isdisabled: false
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
			evt.detail.addRow(row.coa_id, row.coa_name, row)
		}

		dialog.setNext(result.nextoffset, result.limit)
	} catch (err) {
		$fgta5.MessageBox.error(err.message)
	} finally {
		cbo.wait(false)
	}

}


async function cboCurr_selecting(self, evt) {
	const cbo = evt.detail.sender
	const dialog = evt.detail.dialog
	const searchtext = evt.detail.searchtext!=null ? evt.detail.searchtext : ''
	const url = `${Context.appsUrls.ent.url}/curr/header-list`
	const sort = {}
	const criteria = {
		searchtext: searchtext,
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
			evt.detail.addRow(row.curr_id, row.curr_code, row)
		}

		dialog.setNext(result.nextoffset, result.limit)
	} catch (err) {
		$fgta5.MessageBox.error(err.message)
	} finally {
		cbo.wait(false)
	}
}


async function dialog_rowselected(self, tr) {
	const dlg = self.dialog;
	const jurnaldetil_id = tr.getAttribute('data-value')

	// ambil data 
	try {
		const url = '/jurnal/detil-open'
		const apiParam = {
			id: jurnaldetil_id
		}

		const data = await Module.apiCall(url, apiParam)
		
		const detail = { data, cancelSelect:false}
		self.eventListener.dispatchEvent(SelectedEvent({
			detail: detail
		}))

	} catch (err) {
		$fgta5.MessageBox.error(err.message)
	} 
}