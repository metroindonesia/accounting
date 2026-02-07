import Context from './paymreq-context.mjs'
import * as ExtHeader from './paymreq-ext-header.mjs'


export const extenderHeader = ExtHeader;


export async function init(self, args) {
	console.log('initializing paymreqExtender ...')
	ExtHeader.init_header(self, args)
}
