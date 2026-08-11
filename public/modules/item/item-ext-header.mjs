import Context from './item-context.mjs'


const _itemclass_id = 'itemHeaderEdit-obj_itemclass_id'
const _struct_id = 'itemHeaderEdit-obj_struct_id'


export function init_header(self, args) {

}

export function headerList_initSearchParams(self, SearchParams) {

	// Structure
	SearchParams['struct_id'].addEventListener('selecting', async (evt) => {
		const cbo = evt.detail.sender
		const dialog = evt.detail.dialog
		const url = 'struct/header-list'
		const sort = { struct_name: 'desc' }
		const criteria = {
			user_id: Context.userId,
			allow_all_structure: Context.setting.allow_all_structure
		}

		cbo.wait()
		try {
			// cek apakah user punya role PAYMREQ
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

	})
}


export function headerList_dataLoad(self, criteria, sort, evt) {
	criteria.user_id = Context.userId
	criteria.allow_all_structure = Context.setting.allow_all_structure
}


export function obj_struct_id_selecting_criteria(self, obj_struct_id, frm, criteria, sort, evt) {
	criteria.user_id = Context.userId
	criteria.allow_all_structure = Context.setting.allow_all_structure
}






// form

export async function obj_struct_id_selected(self, obj_struct_id, frm, evt) {
	if (!obj_struct_id.isSelectedChanged()) {
		return
	}

	// jika ada perubahan struct, reset itemclass
	frm.Inputs[_itemclass_id].clear()
	frm.Inputs[_itemclass_id].setSelected(null)

}



export function obj_itemclass_id_selecting_criteria(self, obj_itemclass_id, frm, criteria, sort, evt) {
	const struct_id = frm.Inputs[_struct_id].value

	criteria.visible_by_struct_id = struct_id
}


export async function itemHeaderEdit_newData(self, datainit, frm) {
	const SearchParams = self.Modules.itemHeaderList.SearchParams
	const obj_search_struct_id = SearchParams.struct_id

	datainit.struct_id = { value: obj_search_struct_id.value, text: obj_search_struct_id.text }
}