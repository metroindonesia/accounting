import sqlUtil from '@agung_dhewe/pgsqlc'

export async function paymreq_init(self, initialData) {
	const req = self.req
	initialData.setting.defaultCurr = req.app.locals.appConfig.defaultCurr
}



export async function headerCreating(self, tx, data, seqdata) {
	// buang data yang tidak boleh dimodif user

	data.paymreq_doc = seqdata.doc;

}


export async function sequencerSetup(self, tx, sequencer, data, args) {
	// sqlUtil.connect(tx)
	try {
		args.doc_id = 'PREQ'
	} catch (err) {
		throw err
	}
}


export async function headerOpen(self, db, data) {
	sqlUtil.connect(db)

	// dapatkan info untuk paymtype dan paymreqtype
	data.paymtype = await sqlUtil.lookupdb(db, 'public.paymtype', 'paymtype_id', data.paymtype_id)
	data.paymreqtype = await sqlUtil.lookupdb(db, 'public.paymreqtype', 'paymreqtype_id', data.paymreqtype_id)


}