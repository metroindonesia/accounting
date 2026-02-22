import Context from './rptaging-context.mjs'  // todo: sesuaikan



const app = Context.app

const reportTable = document.getElementById('tbl-report')
const reportBody = reportTable.querySelector('tbody')
const reportInfo = document.getElementById('tbl-infoloader');
const rowTemplate = document.querySelector('template[name="template-report-row"]')
const rowTemplateString = rowTemplate.innerHTML.trim()

export async function init(self, args) {
	console.log('initializing report ...')

	const pageTitle = 'Laporan Aging AR/AP'  // judul halaman
	Context.setTitle(pageTitle);  // set judul di browser

	// set datebox tanggal otomatis jadi today
	let today = new Date().toISOString().split("T")[0];
	document.getElementById("rptaging_tgl").value = today;

	if (rowTemplate == null) {
		throw new Error('template report tidak ditemukan');
	}

	const docLogo = document.getElementById('report-logo')
	const logoUrl = new URL(Context.setting.COMPANY_PRINTLOGO, origin).href;
	docLogo.style.backgroundImage = `url(${logoUrl})`
}

export function getParams() {
	const tgl = document.getElementById('rptaging_tgl').value
	const typelap = document.getElementById('typelap').value

	return {
		// date: '2023-10-31',  // TODO Ganti ini
		date: tgl,
		// typelap: 'ar_sum'
		typelap

	}
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

	// data-a-indent="{{indent}}"

	// isi descr
	const tdDescr = trElement.querySelector('td[data-colname="descr"]')

	if (row.block == 0) {
		tdDescr.innerHTML = row.partner_name

	} else {
		// tdDescr.innerHTML = row.jurnaldetil_descr
		// tdDescr.setAttribute('data-a-indent', 2)

		if (row.jurnaldetil_descr != null) {
			tdDescr.innerHTML = row.jurnaldetil_descr
			tdDescr.setAttribute('data-a-indent', 2)
		} else {
			tdDescr.innerHTML = row.coa_name
			tdDescr.setAttribute('data-a-indent', 2)
		}
	}

	//ubah format tulisan block 0 jadi plan
	// let typelap = document.getElementById("typelap").value
	// // console.log(typelap)

	// if (typelap == 'ar_part' || typelap == 'ap_part') {
	// 	// tdDescr.setAttribute('data-rowblock', 1)
	// 	row.block = '1'
	// }

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

