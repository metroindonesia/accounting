import Context from './jurnal-context.mjs'
const origin = (new URL(import.meta.url)).origin;

export async function printDocument(self, printArea, jurnal_id, jurnaltype_printout) {
	console.log(`print ${jurnal_id}`)


	let mask = $fgta5.Modal.createMask()

	try {

		mask.setText('preparing document...')


		const currentUrl = import.meta.url;
		const directory = new URL('.', currentUrl).href;
		const fileUrl = new URL(jurnaltype_printout, directory).href;
		const response = await fetch(fileUrl);
		printArea.innerHTML = await response.text()




		const doc = {
			title: 'Judul Dokumen',
			headertext: 'header document',
			items: []
		}

		mask.setText('preparing document...')
		const url = 'jurnal/execute'
		const data = await Module.apiCall(url, {
			fnName: 'getPrintData',
			jurnal_id: jurnal_id
		})

		document.title = doc.headertext
		Object.assign(doc, data)


		// set document title
		const docTitle = document.getElementById('doc-title')
		docTitle.innerHTML = doc.title

		// set document logo
		const docLogo = document.getElementById('doc-logo')
		const logoUrl = new URL(Context.setting.COMPANY_PRINTLOGO, origin).href;
		docLogo.style.backgroundImage = `url(${logoUrl})`


		await renderData(doc, printArea)
	} catch (err) {
		console.error(err)
		$fgta5.error(err.message)
	} finally {
		mask.close()
		mask = null
	}
}


async function renderData(doc) {
	let docHeaderHtml
	let docFooterHtml

	// render data header
	const docHeader = document.getElementById('doc-header')
	const docFooter = document.getElementById('doc-footer')
	docHeaderHtml = docHeader.innerHTML
	docFooterHtml = docFooter.innerHTML
	for (const key in doc) {
		const varPlaceholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');  // Buat placeholder yang dicari: {{key}}
		let value = doc[key]
		docHeaderHtml = docHeaderHtml.replace(varPlaceholder, value);
		docFooterHtml = docFooterHtml.replace(varPlaceholder, value);
	}
	docHeader.innerHTML = docHeaderHtml
	docFooter.innerHTML = docFooterHtml

	// render data detil
	let renderedHtml
	const docTableBody = document.getElementById('doc-table-body')
	const rowTemplate = docTableBody.innerHTML
	docTableBody.innerHTML = '' // kosongkan dulu body sebelum di render
	for (const row of doc.items) {
		// if (row.tag_paymreq_data == 'payment' && doc.jurnaltype_printout == 'jurnal-print-payment.html') {
		// 	continue
		// }

		renderedHtml = rowTemplate
		console.log(row)
		for (const key in row) {
			const varPlaceholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');  // Buat placeholder yang dicari: {{key}}
			let value = row[key]
			renderedHtml = renderedHtml.replace(varPlaceholder, value);
		}
		docTableBody.insertAdjacentHTML('beforeend', renderedHtml);
	}

}