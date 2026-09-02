import Context from './rptacst-context.mjs'  // todo: sesuaikan



const app = Context.app

const reportTable = document.getElementById('tbl-report')
const reportBody = reportTable.querySelector('tbody')
const reportInfo = document.getElementById('tbl-infoloader');
const rowTemplate = document.querySelector('template[name="template-report-row"]')
const rowTemplateString = rowTemplate.innerHTML.trim()


let reportType

export const TITLE = 'Account Statement'


export async function init(self, args) {
	console.log('initializing report ...')
	Context.setTitle(TITLE);  // set judul di browser

	if (rowTemplate == null) {
		throw new Error('template report tidak ditemukan');
	}

	const docLogo = document.getElementById('report-logo')
	const logoUrl = new URL(Context.setting.COMPANY_PRINTLOGO, origin).href;
	docLogo.style.backgroundImage = `url(${logoUrl})`
}


export function setTitle(text) {
	document.getElementById('judul-laporan').innerHTML = text
}

export function setSubTitle(text) {
	document.getElementById('subjudul-laporan').innerHTML = text
}

export function setReportDate(dt) {
	document.getElementById('tgl_cetak').innerHTML = "Per tanggal: <b>" + dt + "</b>"
}

export function setReportType(type) {
	reportType = type
}


export function getReportObjects() {
	return {
		reportTable: reportTable,
		reportBody: reportBody,
		reportInfo: reportInfo,
		rowTemplate: rowTemplate
	}
}


function formatNumber(num) {
	return new Intl.NumberFormat("en-EN", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(num);
}


export function renderRow(self, row) {
	let renderedHtml = rowTemplateString



	for (const key in row) {
		if (row.hasOwnProperty(key)) {

			const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');  // Buat placeholder yang dicari: {{key}}
			let value = row[key]
			renderedHtml = renderedHtml.replace(placeholder, value);  // Ganti placeholder dengan nilai data
		}
	}

	const tempContainer = document.createElement('tbody');
	tempContainer.innerHTML = renderedHtml;
	const trElement = tempContainer.firstChild;
	console.log(row)


	const table = document.getElementById("tbl-report");

	if (reportType === 'ap_detil' || reportType === 'ar_detil') {
		table.classList.remove('mode-summary');
	} else {
		table.classList.add('mode-summary');
	}

	// isi descr
	const tdDescr = trElement.querySelector('td[data-colname="descr"]')
	const tdJurnalDoc = trElement.querySelector('td[data-colname="jurnal_doc"]')
	const tdJurnalDate = trElement.querySelector('td[data-colname="jurnal_date"]')
	const tdJurnalDue = trElement.querySelector('td[data-colname="jurnal_datedue"]')
	if (row.block == 0) {
		tdDescr.innerHTML = row.partner_name
		// set isi agar kosong tidak muncul "null" di cell
		tdJurnalDoc.innerHTML = ''
		tdJurnalDate.innerHTML = ''
		tdJurnalDue.innerHTML = ''
	} else {

		if (row.jurnaldetil_descr != null) {
			tdDescr.innerHTML = row.jurnaldetil_descr
			tdDescr.setAttribute('data-a-indent', 3)

		} else {
			tdDescr.innerHTML = row.coa_name
			// set isi agar kosong tidak muncul "null" di cell
			tdJurnalDoc.innerHTML = ''
			tdJurnalDate.innerHTML = ''
			tdJurnalDue.innerHTML = ''
			tdDescr.setAttribute('data-a-indent', 2)
		}
	}

	//Atur tampilan berdasarkan flag istotal, issubtotal, isrow
	// reset class dulu biar tidak numpuk
	trElement.classList.remove('row-normal', 'row-subtotal', 'row-total')

	// kondisi styling berdasarkan flag database
	if (row.istotal == 1) {
		trElement.classList.add('row-total')
	} else if (row.issubtotal == 1) {
		trElement.classList.add('row-subtotal')
	} else if (row.isrow == 1) {
		trElement.classList.add('row-normal')
	}

	// format descimal
	const colsDecimals = trElement.querySelectorAll("td[data-format=\"decimal\"]")
	for (let col of colsDecimals) {
		const text = col.innerHTML
		const value = Number(text)

		if (!isNaN(value)) {
			col.innerHTML = formatNumber(value)
		}
	}


	return trElement
}

