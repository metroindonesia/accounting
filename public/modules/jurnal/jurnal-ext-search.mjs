import Context from './jurnal-context.mjs'

export function setupSearchPeriode(self, obj_search_periode) {
	obj_search_periode.addEventListener('selecting', async (evt) => {
		const cbo = evt.detail.sender
		const dialog = evt.detail.dialog
		const url = 'periode/header-list'
		const sort = { periode_name: 'desc' }
		const criteria = {
			periode_isactive: true
		}
		cbo.wait()
		try {
			const result = await Module.apiCall(url, {
				sort,
				criteria,
				offset: evt.detail.offset,
				limit: evt.detail.limit,
			})

			for (var row of result.data) {
				evt.detail.addRow(row.periode_id, row.periode_name, row)
			}

			dialog.setNext(result.nextoffset, result.limit)
		} catch (err) {
			$fgta5.MessageBox.error(err.message)
		} finally {
			cbo.wait(false)
		}

	})
}


export function setupSearchJurnaltype(self, obj_search_jurnaltype) {
	obj_search_jurnaltype.addEventListener('selecting', async (evt) => {
		const cbo = evt.detail.sender
		const dialog = evt.detail.dialog
		const url = 'jurnaltype-filtered/list-by-user'
		const sort = { jurnaltype_name: 'asc' }
		const criteria = {
			jurnaltype_isallowselect: true
		}
		cbo.wait()
		try {
			const result = await Module.apiCall(url, {
				sort,
				criteria,
				offset: evt.detail.offset,
				limit: evt.detail.limit,
			})

			for (var row of result.data) {
				evt.detail.addRow(row.jurnaltype_id, row.jurnaltype_name, row)
			}

			dialog.setNext(result.nextoffset, result.limit)
		} catch (err) {
			$fgta5.MessageBox.error(err.message)
		} finally {
			cbo.wait(false)
		}

	})
}