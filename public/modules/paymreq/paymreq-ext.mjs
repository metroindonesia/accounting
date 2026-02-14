import Context from './paymreq-context.mjs'
import * as ExtHeader from './paymreq-ext-header.mjs'
import * as ExtDetil from './paymreq-ext-detil.mjs'


export const extenderHeader = ExtHeader;
export const extenderDetil = ExtDetil;


export async function init(self, args) {
	console.log('initializing paymreqExtender ...')
	ExtHeader.init_header(self, args)
	ExtDetil.init_detil(self, args)


	const doctitle = document.getElementById('application-title')
	const variance = Context.variance

	if (variance == 'approval') {
		document.title = 'Payment Request Approval'
		doctitle.innerHTML = document.title
	} else if (variance == 'reject') {
		document.title = 'Payment Request Reject'
		doctitle.innerHTML = document.title
	} else {
	}
}



