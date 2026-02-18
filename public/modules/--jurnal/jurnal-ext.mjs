import Context from './jurnal-context.mjs'
import * as ExtHeader from './jurnal-ext-header.mjs'
import * as ExtDetil from './jurnal-ext-detil.mjs'
import outstandingDialog from './jurnal-outstandingdialog.mjs'


const elDetilEditHead = document.getElementById('jurnalDetilEdit-head')



const obj = {}

const ICON_UNBALANCE = `<svg version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
<g stroke-width="2">
<circle cx="16" cy="16" r="16" fill="#800000" style="font-variation-settings:'wght' 700"/>
<path d="m13.665 3.3275h4.8618l-1.3399 12.672h-2.3735z" fill="#fff" style="font-variation-settings:'wght' 700"/>
<circle cx="15.948" cy="23.52" r="3.5151" fill="#fff" style="font-variation-settings:'wght' 700"/>
</g>
</svg>`


export const extenderHeader = ExtHeader;
export const extenderDetil = ExtDetil;



export async function init(self, args) {
	console.log('initializing jurnalExtender ...')
	
	const btnOutstandingPayable = document.createElement('button')
	btnOutstandingPayable.id = 'jurnalDetilEdit-btn_payable'
	btnOutstandingPayable.classList.add('outstanding-button')
	btnOutstandingPayable.innerHTML = 'Payable'

	const btnOutstandingReceivable = document.createElement('button')
	btnOutstandingReceivable.id = 'jurnalDetilEdit-btn_receivable'
	btnOutstandingReceivable.classList.add('outstanding-button')
	btnOutstandingReceivable.innerHTML = 'Receivable'

	args.btnOutstandingPayable = btnOutstandingPayable
	args.btnOutstandingReceivable = btnOutstandingReceivable
	elDetilEditHead.appendChild(btnOutstandingPayable)
	elDetilEditHead.appendChild(btnOutstandingReceivable)


	obj.btnPayable = new $fgta5.ActionButton('jurnalDetilEdit-btn_payable')
	obj.btnReceivable = new $fgta5.ActionButton('jurnalDetilEdit-btn_receivable')


	args.btnPayable = obj.btnPayable
	args.btnReceivable = obj.btnReceivable
	args.ICON_UNBALANCE = ICON_UNBALANCE

	ExtHeader.init_header(self, args)
	ExtDetil.init_detil(self, args)


	Context.sourceName = 'non-modul'

	// form header
	const elFrmHeaderEdit = document.getElementById('jurnalHeaderEdit-frm')
	
	// tambahkan 1 div ke form headerEdit
	const blockDivValue = document.createElement('div')
	blockDivValue.id = 'jurnalHeaderEdit-div_value'
	blockDivValue.classList.add('hidden')
	elFrmHeaderEdit.appendChild(blockDivValue)


	// for detil
	const elFrmDetilEdit = document.getElementById('jurnalDetilEdit-frm')


	// tambahkan div untuk blocking entrian
	const blockDivDetilEntry = document.createElement('div')
	blockDivDetilEntry.id = 'jurnalDetilEdit-div_entry'
	elFrmDetilEdit.appendChild(blockDivDetilEntry)


	// tambahkan div untuk blocking value di detil
	const blockDivDetilValue = document.createElement('div')
	blockDivDetilValue.id = 'jurnalDetilEdit-div_value'
	elFrmDetilEdit.appendChild(blockDivDetilValue)


	//  tambahkan div untuk blocking info di detil
	const blockDivDetilInfo = document.createElement('div')
	blockDivDetilInfo.id = 'jurnalDetilEdit-div_info'
	elFrmDetilEdit.appendChild(blockDivDetilInfo)


	// tambahkan tombol untuk tarik outstanding AR/AP
	const dlg = new outstandingDialog()
	dlg.addEventListener('selected', async evt=>{
		await ExtDetil.outstandingSelected(self, evt.detail.data, evt)
		if (evt.detail.cancelSelect) {
			return
		}
		dlg.close()
	})
	
	obj.btnPayable.addEventListener('click', (evt)=>{
		if (dlg==null) {
			console.error('Template dialog-outstanding belum dibuat')
			return
		}
		dlg.show('AP')
	})


	obj.btnReceivable.addEventListener('click', (evt)=>{
		if (dlg==null) {
			console.error('Template dialog-outstanding belum dibuat')
			return
		}
		dlg.show('AR')
	})
	
}






