import sqlUtil from '@agung_dhewe/pgsqlc'
import { createSequencerLine } from '@agung_dhewe/webapps/src/sequencerline.js'


const TABLE = {
	paymreq_paid: "public.paymreq_paid",
	paymreq_bill: "public.paymreq_bill",
	jurnaldetil: "public.jurnaldetil",
	curr: "public.curr"
}



export async function processApPayment(self, tx, doc_id, jurnalHeader) {
	const { jurnal_id, paymreq_id, jurnaldetil_id_link } = jurnalHeader


	sqlUtil.connect(tx)

	// cek dulu apakah yang dibayarkan melebihi total outstanding
	const sqlCekOutstanding = `
		select
		curr_id, outstanding_value
		from ${TABLE.paymreq_bill}
		where paymreq_id=\${paymreq_id}`
	const rowCekOutstanding = await tx.one(sqlCekOutstanding, { paymreq_id })
	const { curr_id, outstanding_value } = rowCekOutstanding

	if (curr_id != jurnalHeader.curr_id) {
		throw new Error('currency antara AP dan pembayaran berbeda')
	}


	const bayar = Number(jurnalHeader.jurnal_value)
	let sisa = Number(outstanding_value)

	// exclude payment yang berasal dari jurnal ini
	const sqlExclude = `
		select
		paid_value, paid_idr
		from ${TABLE.paymreq_paid}
		where paid_jurnaldetil_id = \${jurnaldetil_id_link}`
	const rowExclude = await tx.oneOrNone(sqlExclude, {
		jurnaldetil_id_link
	})

	if (rowExclude != null) {
		sisa = sisa + Number(rowExclude.paid_value)
	}

	const selisih = bayar - sisa



	if (bayar > sisa) {
		// pembayaran melebihi total outstanding
		// batalkan
		const curr = await sqlUtil.lookupdb(tx, TABLE.curr, 'curr_id', jurnalHeader.curr_id)
		const formatter = new Intl.NumberFormat('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
		const value = formatter.format(sisa)
		throw new Error(`nilai pembayaran melebihi total outstanding (${curr.curr_name} ${value})`)
	}




	await tagLinePayment(self, tx, doc_id, jurnalHeader)
	await insertAPjurnalDetil(self, tx, doc_id, jurnalHeader)
	await insertPaymreqPaid(self, tx, jurnalHeader)
	await updatePaymreqBillOutstanding(self, tx, jurnalHeader)


}

async function tagLinePayment(self, tx, doc_id, jurnalHeader) {
	const tag_paymreq_data = 'payment'
	const jurnaldetil_id = jurnalHeader.jurnaldetil_id_link
	const sqlUpdateTag = `
		update ${TABLE.jurnaldetil}
		set
		tag_paymreq_data=\${tag_paymreq_data}
		where jurnaldetil_id=\${jurnaldetil_id}`

	await tx.none(sqlUpdateTag, {
		tag_paymreq_data,
		jurnaldetil_id
	})
}

async function insertAPjurnalDetil(self, tx, doc_id, jurnalHeader) {
	const { jurnal_id, paymreq_id } = jurnalHeader
	const req = self.req
	const user_id = req.session.user.userId
	const _timestamp = (new Date()).toISOString()
	const tag_paymreq_data = 'tarikan AP'

	// ambil jurnaldetil_id dari paymreq_bill, 
	// untuk ditarik menjadi baris jurnal kredit
	const sqlPaymreqbill = `
		select * from ${TABLE.paymreq_bill} where paymreq_id=\${paymreq_id}
	`
	const rowPaymreqbill = await tx.one(sqlPaymreqbill, { paymreq_id })
	const ap_value = jurnalHeader.jurnal_value   // ambil value AP senilai dengan value pembayaran
	const ap_curr_rate = rowPaymreqbill.curr_rate // rate yang digunakan adalah rate pada saat jurnal AP
	const ap_idr = ap_value * ap_curr_rate
	const ap_ref = rowPaymreqbill.jurnaldetil_id
	const ap_descr = rowPaymreqbill.jurnal_descr
	const ap_curr_id = rowPaymreqbill.curr_id



	// ambil data hutang dari jurnaldetil berdasar ap_ref  (jurnaldetil_id=ap_ref)
	const sqlAP = `
		select * from ${TABLE.jurnaldetil} 
		where 
			jurnaldetil_id=\${jurnaldetil_id}`

	const rowAP = await tx.one(sqlAP, {
		jurnaldetil_id: ap_ref
	})


	// cek dulu bookdate di AP vs pembayaran
	const dateAP = new Date(rowAP.jurnal_date)
	const datePV = new Date(jurnalHeader.jurnal_date)
	if (datePV < dateAP) {
		throw new Error(`tanggal jurnal PV tidak boleh lebih lampau dari ${rowAP.jurnal_doc} (${dateAP.toLocaleDateString('en-GB')})`)
	}


	const jurnalDetil = {
		jurnaldetil_id_ref: ap_ref,
		jurnaldetil_ishead: true,  // agar tidak bisa edit dan modifikasi
		jurnaldetil_descr: ap_descr,
		jurnaldetil_value: ap_value,
		jurnaldetil_idr: ap_idr,

		coa_id: rowAP.coa_id,
		partner_id: rowAP.partner_id,
		unit_id: rowAP.unit_id,
		site_id: rowAP.site_id,
		struct_id: rowAP.struct_id,
		project_id: rowAP.project_id,
		curr_id: rowAP.curr_id,
		curr_rate: rowAP.curr_rate,
		agingtype_id: rowAP.agingtype_id,
		coacurr: rowAP.coacurr,
		paymreq_id: paymreq_id,


		periode_id: jurnalHeader.periode_id,
		jurnal_date: jurnalHeader.jurnal_date,
		jurnaltype_id: jurnalHeader.jurnaltype_id,
		jurnal_doc: jurnalHeader.jurnal_doc,
		jurnal_id: jurnalHeader.jurnal_id,

	}




	// cek apakah detil ini sudah dibuat
	const sqlCek = `
		select * from ${TABLE.jurnaldetil} 
		where 
			jurnal_id=\${jurnal_id} 
		and paymreq_id=\${paymreq_id}
		and tag_paymreq_data=\${tag_paymreq_data}`

	const rowCek = await tx.oneOrNone(sqlCek, {
		jurnal_id,
		paymreq_id,
		tag_paymreq_data
	})

	if (rowCek != null) {
		// baris tarikan AP sudah ada
		// update data
		const { jurnaldetil_id, _createdate, _modifydate } = rowCek

		const lastmodify = _modifydate == null ? new Date(_createdate) : new Date(_modifydate)
		const currentTimestamp = new Date(_timestamp)
		const diffInMs = currentTimestamp - lastmodify;
		const diffInMinutes = Math.abs(Math.floor(diffInMs / (1000 * 60)));
		if (diffInMinutes > 5) {
			jurnalDetil._modifyby = user_id
			jurnalDetil._modifydate = _timestamp
		}
		jurnalDetil.jurnaldetil_id = jurnaldetil_id

		const cmd = sqlUtil.createUpdateCommand(TABLE.jurnaldetil, jurnalDetil, ['jurnaldetil_id'])
		await cmd.execute(jurnalDetil)

	} else {
		// baris tarikan AP belum ada, buat baru
		const sequencer = createSequencerLine(tx, {})
		const seqdata = await sequencer.increment(doc_id)

		jurnalDetil.jurnaldetil_id = seqdata.id
		jurnalDetil.tag_paymreq_data = tag_paymreq_data
		jurnalDetil._createby = user_id
		jurnalDetil._createdate = _timestamp

		const cmd = sqlUtil.createInsertCommand(TABLE.jurnaldetil, jurnalDetil)
		await cmd.execute(jurnalDetil)

	}



}


async function insertPaymreqPaid(self, tx, jurnalHeader) {
	const { jurnal_id, paymreq_id, jurnaldetil_id_link } = jurnalHeader


	const sqlPaid = `
		insert into ${TABLE.paymreq_paid}
		(paid_jurnaldetil_id, paid_jurnal_id, paymreq_id, paid_value, paid_idr, curr_id, curr_rate)
		values 
		(\${paid_jurnaldetil_id}, \${paid_jurnal_id}, \${paymreq_id}, \${paid_value}, \${paid_idr}, \${curr_id}, \${curr_rate})
		on conflict (paid_jurnaldetil_id)
		do update set
			paid_value = EXCLUDED.paid_value,
			paid_idr = EXCLUDED.paid_idr,
			curr_id = EXCLUDED.curr_id,
			curr_rate = EXCLUDED.curr_rate;`
	await tx.none(sqlPaid, {
		paymreq_id: paymreq_id,
		paid_jurnal_id: jurnal_id,
		paid_jurnaldetil_id: jurnaldetil_id_link,
		paid_value: jurnalHeader.jurnal_value,
		paid_idr: jurnalHeader.jurnal_idr,
		curr_id: jurnalHeader.curr_id,
		curr_rate: jurnalHeader.curr_rate
	})

}

async function updatePaymreqBillOutstanding(self, tx, jurnalHeader) {
	const { jurnal_id, paymreq_id, jurnaldetil_id_link } = jurnalHeader

	// cek outstanding
	const sqlBilledOutstanding = `
		select 
			sum(outstanding_value) as outstanding_value,
			sum(outstanding_idr) as outstanding_idr	
		from (
			select 
				paymreq_id, 
				jurnaldetil_value as outstanding_value, 
				jurnaldetil_idr as outstanding_idr 
			from ${TABLE.paymreq_bill}
			where 
				paymreq_id=\${paymreq_id}
			
			union all
	
			select 
				paymreq_id, -sum(paid_value), -sum(paid_idr) 
			from ${TABLE.paymreq_paid}
			where
				paymreq_id=\${paymreq_id}
			group by paymreq_id	
		) A
		group by A.paymreq_id
	`


	const rowBilledOutstanding = await tx.one(sqlBilledOutstanding, { paymreq_id })
	const { outstanding_value, outstanding_idr } = rowBilledOutstanding

	// update kembali nilai outstanding paymreq_bill
	const outstd = { paymreq_id, outstanding_value, outstanding_idr }

	const cmdUpdate = sqlUtil.createUpdateCommand(TABLE.paymreq_bill, outstd, ['paymreq_id'])
	await cmdUpdate.execute(outstd)

}