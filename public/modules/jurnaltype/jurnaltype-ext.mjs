import Context from './jurnaltype-context.mjs'

export async function init(self, args) {
	console.log('initializing jurnaltypeExtender ...')

	// tambahkan extender inisiasi module jurnaltype


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


	// Tambahkan informasi di header form
	const elfrm = document.getElementById('jurnaltypeHeaderEdit-frm')

	const lblHead = document.createElement('div')
	const lblDetil = document.createElement('div')
	const lblDetilAllow = document.createElement('div')


	lblHead.innerHTML = "Header Prop"
	lblHead.classList.add('lbl-head-prop')
	elfrm.appendChild(lblHead)


	lblDetil.innerHTML = "Detil Props"
	lblDetil.classList.add('chk-opt-detil')
	lblDetil.classList.add('lbl-detil-prop')
	elfrm.appendChild(lblDetil)


	lblDetilAllow.innerHTML = "Detil Allow Select"
	lblDetilAllow.classList.add('chk-opt-detil')
	lblDetilAllow.classList.add('lbl-detil-allowselect')
	elfrm.appendChild(lblDetilAllow)

}



