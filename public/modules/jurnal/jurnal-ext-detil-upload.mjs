import { generateUploadId, uploadSpreadsheet } from '../../lib/excelreaderwasm/uploadSpreadsheet.js';


export async function uploadData(uploadUi) {
	const { dataFile, progress, button } = uploadUi
	const file = dataFile.files[0];
	if (!file) return;


	const rowChunk = 10
	const validHeader = "id | jurnaldetil_descr | coa_id | partner_id | struct_id | site_id | unit_id | project_id | curr_id | jurnaldetil_value | curr_rate | jurnaldetil_idr"
	const mappingHeader = {
		id: "id",
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


	// create upload id dulu
	const uploadId = generateUploadId()


	// ambil data jurnal_id yang akan diupload datanya
	const jurnal_id = 'xxxx'

	// upload
	uploadSpreadsheet(file, validHeader, mappingHeader, rowChunk, {
		uploadId: uploadId,
		meta: {
			jurnal_id
		},


		onInit: async (uploadId) => {
			await uploadDataFile_onInit(uploadId)
		},

		onUploading: async (chunk, meta) => {
			await uploadDataFile_onUploading(chunk, meta)
		},

		verifyServer: async (finalSummary) => {
			await uploadDataFile_verifyServer(finalSummary)
		},


		onProgress: (meta) => {
			const { progressPercent } = meta
			progress.value = progressPercent
		},

		onCompleted: (finalSummary) => {
			$fgta5.MessageBox.info('Upload selesai.')
			progress.classList.add('hidden')
			button.classList.add('hidden')
			dataFile.value = null
		}
	})

}


async function uploadDataFile_onInit(uploadId) {
	try {
		const url = 'jurnal/execute'
		const result = await Module.apiCall(url, {
			fnName: 'uploadJurnalInit',
			uploadId: uploadId
		})
	} catch (err) {
		throw err
	}
}




async function uploadDataFile_onUploading(chunk, meta) {
	try {
		const url = 'jurnal/execute'
		const result = await Module.apiCall(url, {
			fnName: 'uploadJurnalChunk',
			meta: meta,
			chunk: chunk
		})
	} catch (err) {
		throw err
	}

}



async function uploadDataFile_verifyServer(finalSummary) {
	try {
		const url = 'jurnal/execute'
		const result = await Module.apiCall(url, {
			fnName: 'verifyJurnalChunk',
			uploadId: finalSummary.uploadId,
			totalRows: finalSummary.totalRows,
		})

		return {
			isComplete: true,
			message: ''
		}
	} catch (err) {
		throw err
	}
}


