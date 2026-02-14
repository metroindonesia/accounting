import Context from './paymreq-context.mjs'
import * as pageHelper from '/public/libs/webmodule/pagehelper.mjs'
import * as ExtHeader from './paymreq-ext-header.mjs'

export function init_detil(self, args) {
}


export async function paymreqDetilEdit_dataSaved(self, data, frm) {
	const paymreq_id = data.paymreq_id
	await updateHeaderValues(self, paymreq_id)
}

export async function paymreqDetilEdit_dataDeleted(self, data) {
	const paymreq_id = data.paymreq_id
	await updateHeaderValues(self, paymreq_id)
}

export async function paymreqDetilList_rowsDeleted(self, data) {
	const paymreq_id = data.paymreq_id
	await updateHeaderValues(self, paymreq_id)
}




async function updateHeaderValues(self, paymreq_id) {
	try {
		const url = 'paymreq/execute'
		const result = await Module.apiCall(url, {
			fnName: 'getTotalValue',
			fnParams: {
				paymreq_id
			}
		})

		// update ke headerEdit
		ExtHeader.updateValues(self, result)
	} catch (err) {
		throw err
	}
}