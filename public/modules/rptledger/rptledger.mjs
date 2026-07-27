import Context from './rptledger-context.mjs'  // todo: sesuaikan
import * as reportPage from './rptledgerPage.mjs'  // todo: sesuaikan

const app = Context.app
const Crsl = Context.Crsl

const btnLoad = document.getElementById('btnLoad')
const btnPrint = document.getElementById('btnPrint')
const btnDownload = document.getElementById('btnDownload')


export default class extends Module {
	constructor() {
		super()
	}

	async main(args = {}) {
		console.log('initializing viewer...')

		app.showFooter(false)

		const self = this

		try {

			// inisiasi sisi server
			try {
				const result = await Module.apiCall(`/${Context.moduleName}/init`, {})
				Context.notifierId = result.notifierId
				Context.notifierSocket = result.notifierSocket
				Context.userId = result.userId
				Context.userFullname = result.userFullname
				Context.sid = result.sid
				Context.targetDirectory = result.targetDirectory
				Context.appsUrls = result.appsUrls



			} catch (err) {
				throw err
			}


			await Promise.all([
				reportPage.init(self, args),

			])

			// render dan setup halaman
			await render(self)


			btnPrint.addEventListener('click', (evt) => {
				btnPrint_click(self)
			})

			btnLoad.addEventListener('click', (evt) => {
				btnLoad_click(self)
			})

			btnDownload.addEventListener('click', (evt) => {
				btnDownload_click(self)
			})



			// parameter event
			const reporttype = document.getElementById('reporttype')

			const unitselect = document.getElementById('unitselect')
			const structselect = document.getElementById('structselect')
			const siteselect = document.getElementById('siteselect')
			const projectselect = document.getElementById('projectselect')


			unitselect.hide = (hidden) => { hideSelector(unitselect, hidden) }
			structselect.hide = (hidden) => { hideSelector(structselect, hidden) }
			siteselect.hide = (hidden) => { hideSelector(siteselect, hidden) }
			projectselect.hide = (hidden) => { hideSelector(projectselect, hidden) }


			reporttype.addEventListener('change', (evt) => {
				const param = reportPage.getParams()
				if (param.scope == 'unitsite') {
					unitselect.hide(false)
					structselect.hide()
					siteselect.hide(false)
					projectselect.hide()

				} else if (param.scope == 'unitstruct') {
					unitselect.hide(false)
					structselect.hide(false)
					siteselect.hide()
					projectselect.hide()

				} else if (param.scope == 'unitproject') {
					unitselect.hide(false)
					structselect.hide()
					siteselect.hide()
					projectselect.hide(false)


				} else if (param.scope == 'site') {
					unitselect.hide()
					structselect.hide()
					siteselect.hide(false)
					projectselect.hide()

				} else if (param.scope == 'unit') {
					unitselect.hide(false)
					structselect.hide()
					siteselect.hide()
					projectselect.hide()

				} else if (param.scope == 'struct') {
					unitselect.hide()
					structselect.hide(false)
					siteselect.hide()
					projectselect.hide()

				} else if (param.scope == 'project') {
					unitselect.hide()
					structselect.hide()
					siteselect.hide()
					projectselect.hide(false)

				} else {
					unitselect.hide()
					structselect.hide()
					siteselect.hide()
					projectselect.hide()
				}
			})

			populateUnit(unitselect)
			populateStruct(structselect)
			populateSite(siteselect)


		} catch (err) {
			throw err
		}

	}





}



function hideSelector(selector, hidden = true) {
	if (hidden) {
		selector.setAttribute('disabled', '')
		selector.classList.add('hidden')
	} else {
		selector.removeAttribute('disabled')
		selector.classList.remove('hidden')
	}
}

async function render(self) {
	try {

		// Crsl.setIconUrl('/generator/generator.png')

		Crsl.addEventListener($fgta5.SectionCarousell.EVT_SECTIONSHOWING, (evt) => {
			var sectionId = evt.detail.commingSection.Id
			for (let cont of footerButtonsContainer) {
				var currContainerSectionId = cont.getAttribute('data-section')
				if (currContainerSectionId == sectionId) {
					setTimeout(() => {
						cont.classList.remove('hidden')
						cont.style.animation = 'dropped 0.3s forwards'
						setTimeout(() => {
							cont.style.animation = 'unset'
						}, 300)
					}, 500)
				} else {
					cont.classList.add('hidden')
				}
			}
		})


	} catch (err) {
		throw err
	}
}



async function btnPrint_click(self) {
	console.log('cetak laporan')
	window.print(self)
}

async function btnLoad_click(self) {
	let mask = $fgta5.Modal.createMask()
	// let reporttype = document.getElementById('reporttype').value
	// let tgl = document.getElementById('rptLedger_tgl').value
	// const [scope, range] = reporttype.split('|')

	try {
		btnLoad.disabled = true
		btnPrint.disabled = true
		btnDownload.disabled = true

		mask.setText('Requesting report data')
		const param = reportPage.getParams()
		const res = await loadData(self, param)

		const cache = {
			id: res.info.cache_id,
			rowCount: res.info.rowCount,
		}


		document.getElementById('judul-laporan').innerHTML = "BUKU BESAR"
		document.getElementById('tgl_cetak').innerHTML = "Per tanggal: <b>" + param.date + "</b>"


		if (param.isytd) {
			document.getElementById('subjudul-laporan').innerHTML = param.scope + ' - YTD'
		} else {
			document.getElementById('subjudul-laporan').innerHTML = param.scope + ' - MTD'
		}


		await loadReport(self, cache, mask)

	} catch (err) {
		console.error(err)
		$fgta5.MessageBox.error(err.message)

	} finally {
		btnLoad.disabled = false
		btnPrint.disabled = false
		btnDownload.disabled = false
		mask.close()
		mask = null
	}
}



async function btnDownload_click(self) {
	const { reportTable } = reportPage.getReportObjects()

	// console.log(TableToExcel)

	const table = reportTable.cloneNode(true)
	const tds = table.querySelectorAll('td[data-t="n"]') // patch data-t="n", default type data number
	for (let td of tds) {
		td.innerHTML = td.innerHTML.replace(/,/g, '')
		td.innerHTML = td.innerHTML.replace(/>-</g, '><')
	}

	TableToExcel.convert(table, {
		name: 'namafile.xlsx',
		sheet: {
			name: 'Sheet1'
		},
		subject: 'judul report',
		title: 'judul report',
		creator: '',
		company: '',
		description: '',
		keywords: ''
	})


}





async function loadData(self, param) {
	// siapkan untuk keperluan proses multi thread di server
	return new Promise(async (resolve, reject) => {
		const jobId = Date.now()
		const clientId = `${Context.notifierId}-${jobId}`
		const notifierSocket = Context.notifierSocket
		const ws = new WebSocket(`${notifierSocket}/?clientId=${clientId}`);



		// siapkan listener socket
		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.status === 'done') {
				ws.close();
				resolve(data);
			} else if (data.status == 'error') {
				ws.close();
				reject(new Error(data.info.message))
			} else if (data.status === 'timeout') {
				ws.close();
				reject(new Error('generate timeout'));
			}
		};


		// ada error di server
		ws.onerror = (err) => {
			ws.close();
			console.error(err)
			reject(err);
		};



		const apiReport = new $fgta5.ApiEndpoint(`/${Context.moduleName}/generate`)
		try {
			await apiReport.execute({ param, clientId })
			// menampilkan data report akan di handle di ws.onmessage
		} catch (err) {
			reject(err)
		} finally {
			apiReport.dispose()
		}

	})
}

async function loadReport(self, cache, mask) {
	const { reportBody, reportInfo } = reportPage.getReportObjects()


	reportInfo.innerHTML = `downloading data ${cache.id} ...`;
	mask.setText(reportInfo.innerHTML)




	// table untuk menampilkan hasil report

	// kosongkan table
	reportBody.innerHTML = ''



	// ambil total Rows
	const totalRows = cache.rowCount; // dari query ke cache, dapatkan totalRows



	// render records
	const rowLimit = 10  // maksimal 10 baris sekali fetch
	let rowOffset = 0
	let doFetch = true
	let line = 0
	while (doFetch) {
		// eksekusi api, akan menghasilkan rows
		const toOffsetInfo = rowOffset + rowLimit < totalRows ? rowOffset + rowLimit : totalRows
		mask.setText(`rendering row ${rowOffset} to ${toOffsetInfo} of <b>${totalRows}</b>`)
		reportInfo.innerHTML = `downloading data from ${rowOffset} to ${toOffsetInfo} of <b>${totalRows}</b>`;


		// ambil dari api
		let rows = null
		const apiFetch = new $fgta5.ApiEndpoint(`/${Context.moduleName}/fetch`)
		try {

			const apiParam = {
				cache_id: cache.id,
				rowOffset: rowOffset,
				rowLimit: rowLimit
			}

			rows = await apiFetch.execute(apiParam)
			const fragment = document.createDocumentFragment();
			for (let row of rows) {
				line++;
				rowOffset++
				const tr = reportPage.renderRow(self, row)
				fragment.appendChild(tr);
			}
			reportBody.appendChild(fragment)
		} catch (err) {
			throw err
		} finally {
			apiFetch.dispose()
		}

		// jika rows sudah tidak berisi data, hentikan loop
		if (rows.length == 0) {
			reportInfo.innerHTML = `${line} rows fetched from ${cache.id}`;
			doFetch = false
		}
	}
}


async function populateUnit(unitselect) {
	try {
		const result = await Module.apiCall(`/${Context.moduleName}/get-unit-list`, {})
		result.forEach(item => {
			const option = document.createElement('option');
			option.value = item.unit_id;       // Nilai yang dikirim saat form di-submit
			option.textContent = item.unit_name; // Teks yang muncul di layar
			unitselect.appendChild(option);
		});
	} catch (err) {
		console.error(err)
	}
}

async function populateStruct(structselect) {
	try {
		const result = await Module.apiCall(`/${Context.moduleName}/get-struct-list`, {})
		result.forEach(item => {
			const option = document.createElement('option');
			option.value = item.struct_id;       // Nilai yang dikirim saat form di-submit
			option.textContent = item.struct_name; // Teks yang muncul di layar
			structselect.appendChild(option);
		});
	} catch (err) {
		console.error(err)
	}
}


async function populateSite(siteselect) {
	try {
		const result = await Module.apiCall(`/${Context.moduleName}/get-site-list`, {})
		result.forEach(item => {
			const option = document.createElement('option');
			option.value = item.site_id;       // Nilai yang dikirim saat form di-submit
			option.textContent = item.site_name; // Teks yang muncul di layar
			siteselect.appendChild(option);
		});
	} catch (err) {
		console.error(err)
	}
}