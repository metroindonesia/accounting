import Context from './rptlapkeu-context.mjs'  // todo: sesuaikan
import * as reportPage from './rptlapkeuPage.mjs'  // todo: sesuaikan
import * as rptselector from '../../lib/rptselector.mjs'


const app = Context.app
const Crsl = Context.Crsl

const btnLoad = document.getElementById('btnLoad')
const btnPrint = document.getElementById('btnPrint')
const btnDownload = document.getElementById('btnDownload')

const obj_reporttype = new $fgta5.Combobox('obj_reporttype')
const obj_date = new $fgta5.Datepicker('obj_date')
const obj_unit = new $fgta5.Combobox('obj_unit')
const obj_struct = new $fgta5.Combobox('obj_struct')
const obj_site = new $fgta5.Combobox('obj_site')
const obj_project = new $fgta5.Combobox('obj_project')

let obj_coalevel

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
				Context.setting = result.setting
				Context.maxCoaLevel = result.maxCoaLevel

				console.log(Context)



				const obj_coalevelData = document.getElementById('obj_coalevel-data')
				for (let level = 0; level <= Context.maxCoaLevel; level++) {
					const opt = document.createElement('option')
					opt.innerHTML = level
					opt.setAttribute('value', level)
					obj_coalevelData.appendChild(opt)
				}
				obj_coalevel = new $fgta5.Combobox('obj_coalevel')
				obj_coalevel.maxValue = Context.maxCoaLevel

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


			const today = new Date().toISOString().split("T")[0];
			obj_date.value = today
			obj_unit.isVisible = (scope) => { return ['unit', 'unitstruct', 'unitsite', 'unitproject'].includes(scope) }
			obj_unit.addEventListener('selecting', (evt) => obj_unit_selecting(evt))
			obj_struct.isVisible = (scope) => { return ['struct', 'unitstruct'].includes(scope) }
			obj_struct.addEventListener('selecting', (evt) => obj_struct_selecting(evt))
			obj_site.isVisible = (scope) => { return ['site', 'unitsite'].includes(scope) }
			obj_site.addEventListener('selecting', (evt) => obj_site_selecting(evt))
			obj_project.isVisible = (scope) => { return ['project', 'unitproject'].includes(scope) }
			obj_project.addEventListener('selecting', (evt) => obj_project_selecting(evt))


			obj_reporttype.addEventListener('selected', (evt) => {
				const param = getParams()
				setVisibility(param.scope, [obj_unit, obj_struct, obj_site, obj_project])
			})

		} catch (err) {
			throw err
		}

	}


}



function getParams() {
	const reporttype = obj_reporttype.value
	const [report, scope, range] = reporttype.split('|')

	return {
		isytd: range == 'ytd' ? true : false,
		report: report,
		scope: scope,
		unit_id: obj_unit.value,
		struct_id: obj_struct.value,
		site_id: obj_site.value,
		project_id: obj_project.value,
		coalevel: obj_coalevel.value ?? obj_coalevel.maxValue,
		date: obj_date.value
	}
}

function setVisibility(scope, selectors) {
	for (let selector of selectors) {
		const container = selector.Element.closest('.fgta5-entry-container');
		if (selector.isVisible(scope)) {
			container.classList.remove('hidden')
		} else {
			container.classList.add('hidden')
		}
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

	try {
		const param = getParams()
		let subtitles = []

		console.log(param)

		// cek data
		for (let selector of [obj_unit, obj_site, obj_struct, obj_project]) {
			const el = selector.Element
			const binding = el.getAttribute('binding')
			const errormessage = el.getAttribute('data-unselected-error')
			if (selector.isVisible(param.scope)) {
				subtitles.push(selector.text)
				if (param[binding] == null) {
					throw new Error(errormessage)
				}
			}
		}

		if (subtitles.length == 0) {
			subtitles.push('Consolidated')
		}

		btnLoad.disabled = true
		btnPrint.disabled = true
		btnDownload.disabled = true

		mask.setText('Requesting report data')
		const res = await loadData(self, param)
		const cache = {
			id: res.info.cache_id,
			rowCount: res.info.rowCount,
		}




		await loadReport(self, cache, mask)

		reportPage.setTitle(reportPage.TITLE)
		reportPage.setReportDate(param.date)
		if (param.isytd) {
			reportPage.setSubTitle('YTD - ' + subtitles.join(', '))
		} else {
			reportPage.setSubTitle('MTD - ' + subtitles.join(', '))
		}

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

	reportPage.setTitle(reportPage.TITLE)
	reportPage.setSubTitle('downloading report ...')
	reportPage.setReportDate('')

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




async function obj_unit_selecting(evt) {
	const cbo = evt.detail.sender
	const dialog = evt.detail.dialog
	const url = 'unit/header-list'
	const sort = { unit_name: 'asc' }
	const criteria = {}
	cbo.wait()
	try {
		const result = await Module.apiCall(url, {
			sort,
			criteria,
			offset: evt.detail.offset,
			limit: evt.detail.limit,
		})

		for (var row of result.data) {
			evt.detail.addRow(row.unit_id, row.unit_name, row)
		}

		dialog.setNext(result.nextoffset, result.limit)
	} catch (err) {
		$fgta5.MessageBox.error(err.message)
	} finally {
		cbo.wait(false)
	}
}

async function obj_struct_selecting(evt) {
	const cbo = evt.detail.sender
	const dialog = evt.detail.dialog
	const url = 'struct/header-list'
	const sort = { struct_name: 'asc' }
	const criteria = {}
	cbo.wait()
	try {
		const result = await Module.apiCall(url, {
			sort,
			criteria,
			offset: evt.detail.offset,
			limit: evt.detail.limit,
		})

		for (var row of result.data) {
			evt.detail.addRow(row.struct_id, row.struct_name, row)
		}

		dialog.setNext(result.nextoffset, result.limit)
	} catch (err) {
		$fgta5.MessageBox.error(err.message)
	} finally {
		cbo.wait(false)
	}
}

async function obj_site_selecting(evt) {
	const cbo = evt.detail.sender
	const dialog = evt.detail.dialog
	const url = 'site/header-list'
	const sort = { site_name: 'asc' }
	const criteria = {}
	cbo.wait()
	try {
		const result = await Module.apiCall(url, {
			sort,
			criteria,
			offset: evt.detail.offset,
			limit: evt.detail.limit,
		})

		for (var row of result.data) {
			evt.detail.addRow(row.site_id, row.site_name, row)
		}

		dialog.setNext(result.nextoffset, result.limit)
	} catch (err) {
		$fgta5.MessageBox.error(err.message)
	} finally {
		cbo.wait(false)
	}
}

async function obj_project_selecting(evt) {
	const cbo = evt.detail.sender
	const dialog = evt.detail.dialog
	const url = 'project/header-list'
	const sort = { project_name: 'asc' }
	const criteria = {}
	cbo.wait()
	try {
		const result = await Module.apiCall(url, {
			sort,
			criteria,
			offset: evt.detail.offset,
			limit: evt.detail.limit,
		})

		for (var row of result.data) {
			evt.detail.addRow(row.project_id, row.project_name, row)
		}

		dialog.setNext(result.nextoffset, result.limit)
	} catch (err) {
		$fgta5.MessageBox.error(err.message)
	} finally {
		cbo.wait(false)
	}
}
