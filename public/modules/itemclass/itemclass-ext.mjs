import Context from './itemclass-context.mjs'
import * as ExtHeader from './itemclass-ext-header.mjs'
import * as ExtStruct from './itemclass-ext-struct.mjs'

export const extenderHeader = ExtHeader
export const extenderStruct = ExtStruct


export async function init(self, args) {
	console.log('initializing itemclassExtender ...')

	// tambahkan extender inisiasi module itemclass
	self.Modules.extenderHeader = extenderHeader
	self.Modules.extenderStruct = extenderStruct

	await Promise.all([
		ExtHeader.init_header(self, args),
		ExtStruct.init_struct(self, args),
	])



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


