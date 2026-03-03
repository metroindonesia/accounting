import Context from './paymreq-context.mjs'
const origin = (new URL(import.meta.url)).origin;

export async function printDocument(self, printArea, paymreq_id) {
	console.log(`print ${paymreq_id}`)


	let mask = $fgta5.Modal.createMask()

	try {




		mask.setText('preparing document...')
		const currentUrl = import.meta.url;
		const directory = new URL('.', currentUrl).href;
		const fileUrl = new URL('paymreq-print.html', directory).href;
		const response = await fetch(fileUrl);
		printArea.innerHTML = await response.text()

		//set logo
		const docTitle = document.getElementById('doc-title')
		const docLogo = document.getElementById('doc-logo')
		const logoUrl = new URL(Context.setting.COMPANY_PRINTLOGO, origin).href;
		docLogo.style.backgroundImage = `url(${logoUrl})`


		mask.setText('preparing document...')
		const url = 'paymreq/execute'
		const data = await Module.apiCall(url, {
			fnName: 'getPrintData',
			paymreq_id: paymreq_id,
		})


		docTitle.innerHTML = data.title

		await renderData(data, printArea)
	} catch (err) {
		console.error(err)
		$fgta5.error(err.message)
	} finally {
		mask.close()
		mask = null
	}
}


async function renderData(data) {
	let headerHtml
	let detilFooterHtml
	let footerHtml


	document.title = data.header.paymreq_doc + ' - ' + data.header.paymreq_descr

	// render Header
	const docHeader = document.getElementById('doc-header')
	const docFooter = document.getElementById('doc-footer')
	headerHtml = docHeader.innerHTML
	footerHtml = docFooter.innerHTML
	for (const key in data.header) {
		const varPlaceholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');  // Buat placeholder yang dicari: {{key}}
		let value = data.header[key]
		headerHtml = headerHtml.replace(varPlaceholder, value);
		footerHtml = footerHtml.replace(varPlaceholder, value);
	}
	docHeader.innerHTML = headerHtml
	docFooter.innerHTML = footerHtml


	// render Detil
	let renderedHtml
	const docDetilBody = document.getElementById('doc-detil-body')
	const rowTemplate = docDetilBody.innerHTML
	docDetilBody.innerHTML = '' // kosongkan dulu body sebelum di render
	for (const row of data.detil) {
		renderedHtml = rowTemplate
		for (const key in row) {
			const varPlaceholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');  // Buat placeholder yang dicari: {{key}}
			let value = row[key]
			renderedHtml = renderedHtml.replace(varPlaceholder, value);
		}
		docDetilBody.insertAdjacentHTML('beforeend', renderedHtml);
	}


}