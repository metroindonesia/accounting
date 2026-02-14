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

export async function detilUpdated(self, tx, ret, data, logMetadata) {
	await updateHeaderValue(self, tx, ret.paymreq_id)
}

export async function detilDeleted(self, tx, deletedRow, logMetadata) {
	await updateHeaderValue(self, tx, deletedRow.paymreq_id)
}

export async function detilCreated(self, tx, ret, data, logMetadata, args) {
	await updateHeaderValue(self, tx, data.paymreq_id)
}



async function updateHeaderValue(self, tx, paymreq_id) {
	sqlUtil.connect(tx)


	try {
		const sqlSum = 'select sum(paymreqdetil_value) as value from public.paymreqdetil where paymreq_id=${paymreq_id}'
		const rowSum = await tx.one(sqlSum, { paymreq_id: paymreq_id })
		const value = Number(rowSum.value)

		// ambil data header
		const sqlHead = 'select ppn_id, pph_id from public.paymreq where paymreq_id=${paymreq_id}'
		const rowHead = await tx.one(sqlHead, { paymreq_id: paymreq_id })
		const ppn_id = rowHead.ppn_id
		const pph_id = rowHead.pph_id

		// cek PPN
		let ppnPercent = 0
		if (ppn_id != null) {
			const sqlPPN = 'select taxtype_value from public.taxtype where taxtype_id=${taxtype_id}'
			const rowPPN = await tx.one(sqlPPN, { taxtype_id: ppn_id })
			ppnPercent = rowPPN.taxtype_value

		}

		// cek PPh
		let pphPercent = 0
		if (pph_id != null) {
			const sqlPPh = 'select taxtype_value from public.taxtype where taxtype_id=${taxtype_id}'
			const rowPPh = await tx.one(sqlPPh, { taxtype_id: pph_id })
			pphPercent = rowPPh.taxtype_value
		}


		// hitung 
		const ppnValue = (ppnPercent / 100) * value
		const pphValue = (pphPercent / 100) * value
		const bill = value + ppnValue
		const total = value + ppnValue - pphValue


		// update ke header
		const data = {
			paymreq_id: paymreq_id,
			paymreq_value: value,
			paymreq_ppn: ppnValue,
			paymreq_pph: pphValue,
			paymreq_bill: bill,
			paymreq_total: total
		}
		const cmd = sqlUtil.createUpdateCommand("public.paymreq", data, ['paymreq_id'])
		await cmd.execute(data)

	} catch (err) {
		throw err
	}
}


export async function getTotalValue(self, db, fnParams) {
	sqlUtil.connect(db)

	const paymreq_id = fnParams.paymreq_id

	try {
		const sql = 'select paymreq_value, paymreq_ppn, paymreq_pph, paymreq_bill, paymreq_total from public."paymreq" where paymreq_id=${paymreq_id}'
		const row = await db.one(sql, { paymreq_id: paymreq_id })
		return row
	} catch (err) {
		throw err
	}
}