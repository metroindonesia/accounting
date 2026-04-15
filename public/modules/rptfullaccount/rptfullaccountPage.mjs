import Context from './rptfullaccount-context.mjs'  // todo: sesuaikan



const app = Context.app

const reportTable = document.getElementById('tbl-report')
const reportBody = reportTable.querySelector('tbody')
const reportInfo = document.getElementById('tbl-infoloader');
const rowTemplate = document.querySelector('template[name="template-report-row"]')
const rowTemplateString = rowTemplate.innerHTML.trim()

export async function init(self, args) {
	console.log('initializing report ...')

	const pageTitle = 'Laporan FullAccount'  // judul halaman
	Context.setTitle(pageTitle);  // set judul di browser

	// set datebox tanggal otomatis jadi today
	let today = new Date().toISOString().split("T")[0];
	document.getElementById("rptfullaccount_enddate").value = today;

	if (rowTemplate == null) {
		throw new Error('template report tidak ditemukan');
	}

	const docLogo = document.getElementById('report-logo')
	const logoUrl = new URL(Context.setting.COMPANY_PRINTLOGO, origin).href;
	docLogo.style.backgroundImage = `url(${logoUrl})`
}

export function getParams() {
	const tgl = document.getElementById('rptfullaccount_enddate').value
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

	// set tampilan untuk kolom yang null jadi '-'
	trElement.querySelectorAll(`
	td[data-colname="jurnal_doc"],
	td[data-colname="jurnal_datedue"],
	td[data-colname="site_name"],
	td[data-colname="struct_name"],
	td[data-colname="unit_name"],
	td[data-colname="project_name"],
	td[data-colname="partner_name"]`).forEach(td => {
		if (td.innerHTML.trim() === 'null') {
			td.innerHTML = '-';
			td.style.textAlign = 'center';
		}
	});


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

