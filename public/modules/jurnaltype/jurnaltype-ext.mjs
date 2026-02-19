import Context from './jurnaltype-context.mjs'

export async function init(self, args) {
	console.log('initializing jurnaltypeExtender ...')


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



