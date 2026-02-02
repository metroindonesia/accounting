import Context from './auth-context.mjs'

export async function init(self, args) {
	console.log('initializing authExtender ...')

	// tambahkan extender inisiasi module auth


	/* // contoh menambahkan content dari template extender
	{
		const target = secRec.querySelector('#fRecord-section div[name="column"][exteder]')
		const tpl = document.getElementById('tpl-record-panel')
		if (tpl!=null) {
			const clone = tpl.content.cloneNode(true); // salin isi template
			target.prepend(clone)
		}
	}
	*/	


	
	/* // contoh menambahkan custom validator
	// pada html, tambahkan validator="cobaFunction:paramValue"
	const frm = self.Modules.coaHeaderEdit.getHeaderForm()
	const obj_coa_normal = frm.Inputs['coaHeaderEdit-obj_coa_normal']
	$validators.addCustomValidator('cobaFunction', (v, param)=>{
	 	console.log(v)
	 	setTimeout(()=>{
	 		obj_coa_normal.setError('ini error')
	 	}, 500)
	})	


	*/


}



export function authHeaderEdit_formOpened(self, frm, CurrentState) {
	const obj = frm.Inputs['authHeaderEdit-obj_auth_name']
	obj.disabled = true
}

export async function authHeaderEdit_newData(self, datainit, frm) {
	const obj = frm.Inputs['authHeaderEdit-obj_auth_name']
	obj.disabled = false
}

export async function authHeaderEdit_dataSaved(self, data, frm) {
	const obj = frm.Inputs['authHeaderEdit-obj_auth_name']
	obj.disabled = true
}