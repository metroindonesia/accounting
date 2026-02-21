import Context from './jurnaltype-context.mjs'
import * as ExtHeader from './jurnaltype-ext-header.mjs'

export const extenderHeader = ExtHeader



export async function init(self, args) {
	console.log('initializing jurnaltypeExtender ...')
	ExtHeader.init_header(self, args)



}



