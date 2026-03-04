const _ishead = 'itemclassStructEdit-obj_ishead'
const _struct_id = 'itemclassStructEdit-obj_struct_id'
const _itemclass_id = 'itemclassStructEdit-obj_itemclass_id'


export async function init_struct(self, args) {

}


export function obj_struct_id_selecting_criteria(self, obj_struct_id, frm, criteria, sort, evt) {
	const itemclassHeaderEdit = self.Modules.itemclassHeaderEdit
	const frmHeader = itemclassHeaderEdit.getForm()
	const obj_owner_struct_id = frmHeader.Inputs['itemclassHeaderEdit-obj_owner_struct_id']
	const owner_struct_id = obj_owner_struct_id.value

	criteria.selectForItemclassMember = true
	criteria.exclude_struct_id = owner_struct_id
	criteria.include_struct_id = frm.Inputs[_struct_id].value
	criteria.itemclass_id = frm.Inputs[_itemclass_id].value
}

export function itemclassStructEdit_formOpened(self, frm, CurrentState) {
}