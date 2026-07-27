import Context from './rptledger-context.mjs'  // todo: sesuaikan
import * as rptselector from '../../lib/rptselector.mjs'



const app = Context.app

const reportTable = document.getElementById('tbl-report')
const reportBody = reportTable.querySelector('tbody')
const reportInfo = document.getElementById('tbl-infoloader');
const rowTemplate = document.querySelector('template[name="template-report-row"]')
const rowTemplateString = rowTemplate.innerHTML.trim()

export async function init(self, args) {
	console.log('initializing report ...')

	const pageTitle = 'Buku Besar'  // judul halaman
	Context.setTitle(pageTitle);  // set judul di browser

	// set datebox tanggal otomatis jadi today
	let today = new Date().toISOString().split("T")[0];
	document.getElementById("rptLedger_tgl").value = today;


	if (rowTemplate == null) {
		throw new Error('template report tidak ditemukan');
	}
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

	// set padding dari coa_name
	const colCoaName = trElement.querySelector("[data-colname=\"coa_name\"]");
	colCoaName.style.paddingLeft = `${15 * row.coa_level}px`

	// format angka decimal
	const colsDecimals = trElement.querySelectorAll("td[format=\"decimal\"]")
	for (let col of colsDecimals) {
		const text = col.innerHTML
		const value = Number(text)

		if (!isNaN(value)) {
			col.innerHTML = formatNumber(value)
		}
	}


	return trElement
}

