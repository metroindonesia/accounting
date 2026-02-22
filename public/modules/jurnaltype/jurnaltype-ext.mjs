import Context from './jurnaltype-context.mjs'
import * as ExtHeader from './jurnaltype-ext-header.mjs'
import * as ExtCoa from './jurnaltype-ext-coa.mjs'

export const extenderHeader = ExtHeader
export const extenderCoa = ExtCoa



export async function init(self, args) {
	console.log('initializing jurnaltypeExtender ...')
	ExtHeader.init_header(self, args)
	ExtCoa.init_coa(self, args)



}



