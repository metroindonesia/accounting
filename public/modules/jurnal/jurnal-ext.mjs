import Context from './jurnal-context.mjs'
import * as ExtHeader from './jurnal-ext-header.mjs'
import * as ExtDetil from './jurnal-ext-detil.mjs'


export const extenderHeader = ExtHeader;
export const extenderDetil = ExtDetil;


export async function init(self, args) {
	console.log('initializing jurnalExtender ...')

	// referensikan extender ke self
	self.Modules.extenderHeader = extenderHeader
	self.Modules.extenderDetil = extenderDetil

	await Promise.all([
		ExtHeader.init_header(self, args),
		ExtDetil.init_detil(self, args)
	])

	const variance = Context.variance
	if (variance == 'posting') {
		document.title = 'Jurnal Posting'
		Context.app.setTitle(document.title)
	} else if (variance == 'unposting') {
		document.title = 'Jurnal UnPosting'
		Context.app.setTitle(document.title)
	}

}


