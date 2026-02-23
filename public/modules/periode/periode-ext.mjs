import Context from './periode-context.mjs'
import * as ExtHeader from './periode-ext-header.mjs'

export const extenderHeader = ExtHeader;

export async function init(self, args) {
	console.log('initializing periodeExtender ...')
	ExtHeader.init_header(self, args)


}


