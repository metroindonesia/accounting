import Context from './coa-context.mjs'

export async function init(self, args) {
	console.log('initializing coaExtender ...')


	const frm = self.Modules.coaHeaderEdit.getHeaderForm()
	const obj_coa_id = frm.Inputs['coaHeaderEdit-obj_coa_id']

	const COA_LENGTH = Context.setting.COA_LENGTH
	if (COA_LENGTH != null) {
		obj_coa_id.Nodes.Input.setAttribute('maxlength', COA_LENGTH)
		obj_coa_id.Nodes.Input.setAttribute('minlength', COA_LENGTH)
		obj_coa_id.setInvalidMessage('minlength', `panjang coa harus ${COA_LENGTH} digit`)
		obj_coa_id.readValidators()
	}



}


