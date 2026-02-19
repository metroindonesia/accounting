import Context from './jurnal-context.mjs'
import * as ExtHeader from './jurnal-ext-header.mjs'
import * as ExtDetil from './jurnal-ext-detil.mjs'


export const extenderHeader = ExtHeader;
export const extenderDetil = ExtDetil;


export async function init(self, args) {
	console.log('initializing jurnalExtender ...')
	ExtHeader.init_header(self, args)
	ExtDetil.init_detil(self, args)


}


