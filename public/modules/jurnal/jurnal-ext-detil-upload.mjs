import Context from './jurnal-context.mjs'
import { uploadSpreadsheet } from '../../lib/excelreaderwasm/uploadSpreadsheet.js';


export async function uploadData(self, jurnal_id, uploadUi) {
	const { dataFile, progress, button, errorMessage } = uploadUi
	const file = dataFile.files[0];
	if (!file) return;

	console.log('uploading ', jurnal_id)

	const rowChunk = 10
	const validHeader = "jurnaldetil_descr | coa_id | partner_id | struct_id | site_id | unit_id | project_id | curr_id | jurnaldetil_value | curr_rate | jurnaldetil_idr"
	const mappingHeader = {
		jurnaldetil_descr: "jurnaldetil_descr",
		coa_id: "coa_id",
		partner_id: "partner_id",
		struct_id: "struct_id",
		site_id: "site_id",
		unit_id: "unit_id",
		project_id: "project_id",
		curr_id: "curr_id",
		jurnaldetil_value: "jurnaldetil_value",
		curr_rate: "curr_rate",
		jurnaldetil_idr: "jurnaldetil_idr"
	}

	// tampilkan progress bar
	progress.classList.remove('hidden')

	const jobId = Date.now()
	const clientId = `${Context.notifierId}-${jobId}`
	const notifierSocket = Context.notifierSocket
	const ws = new WebSocket(`${notifierSocket}/?clientId=${clientId}`);


	return new Promise((resolve, reject) => {
		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.status === 'done') {
				console.log('DONE.')
				ws.close();
				resolve()
			} else if (data.status == 'error') {
				ws.close();
				console.error(event.data)

				try {
					if (typeof event.data === 'string') {
						const data = JSON.parse(event.data)
						reject(new Error(data.info.message))
					} else {
						reject(new Error('Worker error'))
					}
				} catch (err) {
					console.error(err)
					reject(new Error('Worker error'))
				}


			} else if (data.status === 'timeout') {
				ws.close();
				reject(new Error('Worker timeout'))

			}
		};

		// ada error di server
		ws.onerror = (err) => {
			ws.close();
			reject(err)
		};


		// upload
		uploadSpreadsheet(file, validHeader, mappingHeader, rowChunk, {
			uploadId: jurnal_id,

			onInit: async (uploadId) => {
				const url = 'jurnal/execute'
				await Module.apiCall(url, {
					fnName: 'uploadJurnalInit',
					uploadId: uploadId
				})
			},

			onUploading: async (chunk, meta) => {
				const url = 'jurnal/execute'
				await Module.apiCall(url, {
					fnName: 'uploadJurnalChunk',
					meta: meta,
					chunk: chunk
				})
			},

			verifyServer: async (finalSummary) => {
				const url = 'jurnal/execute'
				await Module.apiCall(url, {
					fnName: 'verifyJurnalChunk',
					jurnal_id: finalSummary.uploadId,
					totalRows: finalSummary.totalRows,
				})
				return {
					isComplete: true,
					message: ''
				}
			},


			onProgress: (meta) => {
				const { progressPercent } = meta
				progress.value = progressPercent
			},

			onCompleted: async (finalSummary) => {
				const url = 'jurnal/execute'
				await Module.apiCall(url, {
					fnName: 'finalizeJurnalUpload',
					jurnal_id: finalSummary.uploadId,
					clientId: clientId
				})
			}


		})

	})




}




