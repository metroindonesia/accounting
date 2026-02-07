export async function headerCreating(self, tx, data, seqdata) {
	// buang data yang tidak boleh dimodif user

	data.paymreq_doc = seqdata.doc;

}