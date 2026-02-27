import sqlUtil from '@agung_dhewe/pgsqlc'
import { createSequencerLine } from '@agung_dhewe/webapps/src/sequencerline.js'
import serveFavicon from 'serve-favicon'


const TABLE = {
	paymreq: "public.paymreq",
	paymreqdetil: "public.paymreqdetil",
	jurnaldetil: "public.jurnaldetil",
	taxtype: "public.taxtype",
	paymreq_bill: "public.paymreq_bill"
}




export async function processApBill(self, tx, doc_id, jurnalHeader) {
	const { jurnal_id, paymreq_id } = jurnalHeader
	const req = self.req
	const user_id = req.session.user.userId
	const company_partner_id = 260500003

	sqlUtil.connect(tx)
	try {
		const paymreq = await sqlUtil.lookupdb(tx, TABLE.paymreq, "paymreq_id", paymreq_id)

		// jika paymreq sebelumnya diganti, hapus dulu data lama
		const sqlRemovePrev = `delete from ${TABLE.jurnaldetil} where jurnal_id=\${jurnal_id} and tag_paymreq_id is not null and tag_paymreq_id<>\${paymreq_id}`
		await tx.none(sqlRemovePrev, { jurnal_id, paymreq_id })


		// masukkan item di paymentrequest
		const _createdate = (new Date()).toISOString()
		const sqlPaymreqDetil = `select * from ${TABLE.paymreqdetil} where paymreq_id=\${paymreq_id}`
		const rows = await tx.any(sqlPaymreqDetil, { paymreq_id })

		await setPPN(self, tx, paymreq, rows, jurnalHeader) // tambahkan PPN kalau ada
		await setPPh(self, tx, paymreq, rows, jurnalHeader) // tambahkan PPh kalau ada

		for (let row of rows) {
			const paymreqdetil_id = row.paymreqdetil_id
			// cek apakah baris sudah ada
			const sqlCek = `select jurnaldetil_id from ${TABLE.jurnaldetil} where jurnal_id=\${jurnal_id} and paymreqdetil_id=\${paymreqdetil_id}`
			const rowExists = await tx.oneOrNone(sqlCek, { jurnal_id, paymreqdetil_id })
			if (rowExists != null) {
				// skip, lanjutkan baris berikut
				// data yang sudah ada tidak perlu diubah lagi, karna bisa jadi sudah dimodif user
				continue
			}

			const sequencer = createSequencerLine(tx, {})
			const seqdata = await sequencer.increment(doc_id)

			const jurnalDetil = {
				jurnaldetil_id: seqdata.id,
				tag_paymreq_id: paymreq_id,
				paymreqdetil_id: row.paymreqdetil_id, // untuk mengunci value, namun bisa edit entity, coa, descr
				jurnaldetil_ishead: false,
				jurnaldetil_descr: row.paymreqdetil_descr,
				jurnaldetil_value: row.paymreqdetil_value,
				jurnaldetil_idr: row.paymreqdetil_value * jurnalHeader.curr_rate,
				coa_id: row.coa_id ?? null,
				partner_id: row.partner_id ?? company_partner_id,
				unit_id: row.unit_id,
				site_id: row.site_id,
				struct_id: row.struct_id,
				project_id: row.project_id,
				curr_id: jurnalHeader.curr_id,
				curr_rate: jurnalHeader.curr_rate,
				periode_id: jurnalHeader.periode_id,
				jurnal_date: jurnalHeader.jurnal_date,
				jurnal_datedue: jurnalHeader.jurnal_datedue,
				jurnaltype_id: jurnalHeader.jurnaltype_id,
				jurnal_doc: jurnalHeader.jurnal_doc,
				jurnal_id: jurnalHeader.jurnal_id,
				_createby: user_id,
				_createdate: _createdate
			}



			const cmd = sqlUtil.createInsertCommand(TABLE.jurnaldetil, jurnalDetil)
			await cmd.execute(jurnalDetil)

		}


		// masukkan data ke paymreq_bill
		await insertPaymreqBill(self, tx, paymreq, rows, jurnalHeader)



	} catch (err) {
		throw err
	}

}


async function setPPN(self, tx, paymreq, rows, jurnalHeader) {
	if (paymreq.ppn_id == null) {
		return
	}

	const taxtype = await sqlUtil.lookupdb(tx, TABLE.taxtype, "taxtype_id", paymreq.ppn_id)
	rows.push({
		paymreqdetil_id: null,
		paymreqdetil_descr: taxtype.taxtype_name,
		paymreqdetil_value: paymreq.paymreq_ppn,
		coa_id: taxtype.bill_coa_id,
		unit_id: jurnalHeader.unit_id,
		site_id: jurnalHeader.site_id,
		struct_id: jurnalHeader.struct_id,
		project_id: jurnalHeader.project_id,
		partner_id: jurnalHeader.partner_id, // partner pajak,
		taxmodel: 'PPN'
	})
}

async function setPPh(self, tx, paymreq, rows, jurnalHeader) {
	if (paymreq.pph_id == null) {
		return
	}

	const req = self.req
	const partner_id = req.app.locals.appConfig.TAX_PARTNER_ID
	if (partner_id == null) {
		throw new Error('TAX_PARTNER_ID belum di set di setting')
	}

	const taxtype = await sqlUtil.lookupdb(tx, TABLE.taxtype, "taxtype_id", paymreq.pph_id)
	rows.push({
		paymreqdetil_id: null,
		paymreqdetil_descr: taxtype.taxtype_name,
		paymreqdetil_value: -paymreq.paymreq_pph,
		coa_id: taxtype.bill_coa_id,
		unit_id: jurnalHeader.unit_id,
		site_id: jurnalHeader.site_id,
		struct_id: jurnalHeader.struct_id,
		project_id: jurnalHeader.project_id,
		partner_id: partner_id,
		taxmodel: 'PPh'
	})
}


async function insertPaymreqBill(self, tx, paymreq, rows, jurnalHeader) {
	const bill = {
		paymreq_id: paymreq.paymreq_id,
		paymreqtype_id: paymreq.paymreqtype_id,
		jurnal_id: jurnalHeader.jurnal_id,
		jurnaldetil_id: jurnalHeader.jurnaldetil_id_link,
		jurnaltype_id: jurnalHeader.jurnaltype_id,
		jurnal_date: jurnalHeader.jurnal_date,
		jurnal_datedue: jurnalHeader.jurnal_datedue,
		jurnaldetil_value: jurnalHeader.jurnal_value,
		jurnaldetil_idr: jurnalHeader.jurnal_idr,
		outstanding_value: jurnalHeader.jurnal_value,
		outstanding_idr: jurnalHeader.jurnal_idr,
		curr_id: jurnalHeader.curr_id,
		curr_rate: jurnalHeader.curr_rate,
		coa_id: jurnalHeader.coa_id,
		struct_id: jurnalHeader.struct_id,
		site_id: jurnalHeader.site_id,
		unit_id: jurnalHeader.unit_id,
		project_id: jurnalHeader.project_id,
		partner_id: jurnalHeader.partner_id
	}

	const cmd = sqlUtil.createInsertCommand(TABLE.paymreq_bill, bill)
	await cmd.execute(bill)
}