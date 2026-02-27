import sqlUtil from '@agung_dhewe/pgsqlc'

const TABLE = {
	paymreq_paid: "public.paymreq_paid"
}



export async function processApPayment(self, tx, doc_id, jurnalHeader) {
	const { jurnal_id, paymreq_id, jurnaldetil_id_link } = jurnalHeader


	// buat data di paymreq_paid
	const paid = {
		paymreq_id: paymreq_id,
		paid_jurnal_id: jurnal_id,
		paid_jurnaldetil_id: jurnaldetil_id_link,
		paid_value: jurnalHeader.jurnal_value,
		paid_idr: jurnalHeader.jurnal_idr,
		curr_id: jurnalHeader.curr_id,
		curr_rate: jurnalHeader.curr_rate
	}

	const cmd = sqlUtil.createInsertCommand(TABLE.paymreq_paid, paid)
	await cmd.execute(paid)


	// cek outstanding


}