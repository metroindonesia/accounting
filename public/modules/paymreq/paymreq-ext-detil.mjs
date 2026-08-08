import Context from './paymreq-context.mjs'
import * as pageHelper from '/public/lib/fgta5app/pagehelper.mjs'
import * as ExtHeader from './paymreq-ext-header.mjs'


const _paymreqdetil_id = 'paymreqDetilEdit-obj_paymreqdetil_id'
const _itemclass_id = 'paymreqDetilEdit-obj_itemclass_id'
const _paymreqdetil_descr = 'paymreqDetilEdit-obj_paymreqdetil_descr'
const _struct_id = 'paymreqDetilEdit-obj_struct_id'
const _project_id = 'paymreqDetilEdit-obj_project_id'
const _site_id = 'paymreqDetilEdit-obj_site_id'
const _unit_id = 'paymreqDetilEdit-obj_unit_id'
const _paymreqdetil_value = 'paymreqDetilEdit-obj_paymreqdetil_value'
const _curr_id = 'paymreqDetilEdit-obj_curr_id'


export function init_detil(self, args) {
}

export async function paymreqDetilEdit_newData(self, datainit, frm, CurrentState) {
	const paymreqHeaderEdit = self.Modules.paymreqHeaderEdit
	const frmHeader = paymreqHeaderEdit.getForm()

	const obj_struct_id = frmHeader.Inputs['paymreqHeaderEdit-obj_struct_id']
	const obj_project_id = frmHeader.Inputs['paymreqHeaderEdit-obj_project_id']
	const obj_site_id = frmHeader.Inputs['paymreqHeaderEdit-obj_site_id']
	const obj_unit_id = frmHeader.Inputs['paymreqHeaderEdit-obj_unit_id']
	const obj_curr_id = frmHeader.Inputs['paymreqHeaderEdit-obj_curr_id']


	datainit.struct_id = { value: obj_struct_id.value, text: obj_struct_id.text }
	datainit.project_id = { value: obj_project_id.value, text: obj_project_id.text }
	datainit.site_id = { value: obj_site_id.value, text: obj_site_id.text }
	datainit.unit_id = { value: obj_unit_id.value, text: obj_unit_id.text }
	datainit.curr_id = { value: obj_curr_id.value, text: obj_curr_id.text }


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

export function obj_itemclass_id_selecting_criteria(self, obj_itemclass_id, frm, criteria, sort, evt) {
	const paymreqHeaderEdit = self.Modules.paymreqHeaderEdit
	const frmHeader = paymreqHeaderEdit.getForm()
	const obj_struct_id = frmHeader.Inputs['paymreqHeaderEdit-obj_struct_id']
	const struct_id = obj_struct_id.value

	criteria.visible_by_struct_id = struct_id
}

export function obj_struct_id_selecting_criteria(self, obj_struct_id, frm, criteria, sort, evt) {
	sort.struct_name = 'asc'
	criteria.struct_isdisabled = false
	criteria.struct_isparent = false
	criteria.struct_istransaction = true
}

export function obj_project_id_selecting_criteria(self, obj_project_id, frm, criteria, sort, evt) {
	sort.project_name = 'asc'
	criteria.project_isdisabled = false
}

export function obj_site_id_selecting_criteria(self, obj_site_id, frm, criteria, sort, evt) {
	sort.site_name = 'asc'
	criteria.site_isdisabled = false
}

export function obj_unit_id_selecting_criteria(self, obj_unit_id, frm, criteria, sort, evt) {
	sort.unit_name = 'asc'
	criteria.unit_isdisabled = false
}

async function updateHeaderValues(self, paymreq_id) {
	try {
		const url = 'paymreq/execute'
		const result = await Module.apiCall(url, {
			fnName: 'getTotalValue',
			paymreq_id: paymreq_id

		})

		// update ke headerEdit
		ExtHeader.updateValues(self, result)
	} catch (err) {
		throw err
	}
}