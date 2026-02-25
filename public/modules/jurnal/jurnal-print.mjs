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

		console.log(printArea.innerHTML)

		// set logo
		const docLogo = document.getElementById('doc-logo')
		const logoUrl = new URL(Context.setting.COMPANY_PRINTLOGO, origin).href;
		docLogo.style.backgroundImage = `url(${logoUrl})`


		const doc = {
			title: 'Judul Dokumen',
			headertext: 'header document',
			items: []
		}

		// mask.setText('preparing document...')
		// const url = 'paymreq/execute'
		// const data = await Module.apiCall(url, {
		// 	fnName: 'getPrintData',
		// 	paymreq_id: paymreq_id,
		// })


		document.title = doc.headertext
		// await renderData(data, printArea)
	} catch (err) {
		console.error(err)
		$fgta5.error(err.message)
	} finally {
		mask.close()
		mask = null
	}
}


async function renderData(doc) {


}