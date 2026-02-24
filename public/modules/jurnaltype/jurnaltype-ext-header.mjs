const _jurnaltype_headcopyto = 'jurnaltypeHeaderEdit-obj_jurnaltype_headcopyto'
const _jurnaltype_printout = 'jurnaltypeHeaderEdit-obj_jurnaltype_printout'
const _jurnaltype_printtitle = 'jurnaltypeHeaderEdit-obj_jurnaltype_printtitle'



export function init_header(self, args) {
	// Tambahkan informasi di header form
	const elfrm = document.getElementById('jurnaltypeHeaderEdit-frm')

	const spcHead = document.createElement('div')
	spcHead.id = 'spcHead'
	spcHead.classList.add('row-gap')
	elfrm.appendChild(spcHead)


	const spcDetil = document.createElement('div')
	spcDetil.id = 'spcDetil'
	spcDetil.classList.add('row-gap')
	elfrm.appendChild(spcDetil)

	const lblHead = document.createElement('div')
	lblHead.id = 'lblHead'
	lblHead.innerHTML = 'Header'
	lblHead.classList.add('row-label')
	elfrm.appendChild(lblHead)

	const lblDetil = document.createElement('div')
	lblDetil.id = 'lblDetil'
	lblDetil.innerHTML = 'Detil'
	lblDetil.classList.add('row-label')
	elfrm.appendChild(lblDetil)

}


export async function obj_jurnalmodel_id_selected(self, obj_jurnalmodel_id, frm, evt) {
	if (!obj_jurnalmodel_id.isSelectedChanged()) {
		return
	}
	const jurnalmodel = evt.detail.data
	jurnalmodel_changed(jurnalmodel, frm)
}




function jurnalmodel_changed(jurnalmodel, frm) {
	console.log(jurnalmodel)


	const obj_jurnaltype_headcopyto = frm.Inputs[_jurnaltype_headcopyto]
	const obj_jurnaltype_printout = frm.Inputs[_jurnaltype_printout]
	const obj_jurnaltype_printtitle = frm.Inputs[_jurnaltype_printtitle]

	obj_jurnaltype_headcopyto.value = jurnalmodel.jurnalmodel_copyto
	obj_jurnaltype_printout.value = jurnalmodel.jurnalmodel_printout
	obj_jurnaltype_printtitle.value = jurnalmodel.jurnalmodel_title
}

