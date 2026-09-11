import Context from './rptacst-context.mjs'  // todo: sesuaikan



const app = Context.app

const reportTable = document.getElementById('tbl-report')
const reportBody = reportTable.querySelector('tbody')
const reportInfo = document.getElementById('tbl-infoloader');
const rowTemplate = document.querySelector('template[name="template-report-row"]')
const rowTemplateString = rowTemplate.innerHTML.trim()

const rowTemplateSum = document.querySelector('template[name="template-report-sum"]')
const rowTemplateSumString = rowTemplateSum.innerHTML.trim()

const rowTemplateSection = document.querySelector('template[name="template-report-section"]')
const rowTemplateSectionString = rowTemplateSection.innerHTML.trim()




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
	let renderedHtml

	const isSectionTitle = !row.isrow && !row.issubtotal && !row.istotal
	const isSummary = !row.isrow && (row.issubtotal || row.istotal)
	const isRow = row.isrow

	if (isSectionTitle) {
		renderedHtml = rowTemplateSectionString
	} else if (isSummary) {
		renderedHtml = rowTemplateSumString
	} else {
		renderedHtml = rowTemplateString
	}

	if (row.jurnaldetil_descr == 'CONSOLIDATED') {
		row.jurnaldetil_descr = 'CONSOLIDATED AR(AP)'
		row.addclass = 'report-row-consolidated'
	}

	console.log(row)
	for (const key in row) {
		if (row.hasOwnProperty(key)) {
			const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');  // Buat placeholder yang dicari: {{key}}
			let value = row[key]
			renderedHtml = renderedHtml.replace(placeholder, value);  // Ganti placeholder dengan nilai data
		}
	}

	const tempContainer = document.createElement('tbody');
	tempContainer.innerHTML = renderedHtml;

	const rowsElement = tempContainer.rows;
	return rowsElement
}

export function formatRowFields(tr) {
	// format decimal
	const colsDecimals = tr.querySelectorAll("td[data-format=\"decimal\"]")
	for (let col of colsDecimals) {
		const text = col.innerHTML
		const value = Number(text)

		if (!isNaN(value)) {
			col.innerHTML = formatNumber(value)
		}
	}
}