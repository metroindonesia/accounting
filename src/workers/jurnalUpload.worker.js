import { workerData, parentPort } from 'worker_threads';
import path from 'path';
import pgp from 'pg-promise'
import db from '@agung_dhewe/webapps/src/db.js'
import { createSequencerLine } from '@agung_dhewe/webapps/src/sequencerline.js'

const { user_id, user_name, ipaddress, jurnal_id } = workerData;


main(jurnal_id)

async function main(jurnal_id) {
	try {

		console.log(jurnal_id)

		// dapatkan rowcount dari data yang diupload
		const rowCount = await getRowCount(db, jurnal_id)


		// dapatkan doc_id
		const doc_id = await getDocId(db, jurnal_id)


		// reserver counter
		const args = {
			section: 'detil',
			prefix: doc_id
		}

		// buat sequencer
		const sequencer = createSequencerLine(db, {})
		const seqdata = await sequencer.increment(args.prefix, rowCount)
		const endLineCode = Number(seqdata.id)
		const startLineCode = endLineCode - rowCount + 1

		// update jurnaldetil_id
		await updateLineId(db, jurnal_id, startLineCode)

		// copy jurnal
		await copyJurnal(db, jurnal_id)

		parentPort.postMessage({ done: true })
	} catch (err) {
		err.message = `Jurnal Upload Worker: ${err.message}`
		throw err
	}
}

async function copyJurnal(db, jurnal_id) {
	try {
		const sql = `
			insert into public.jurnaldetil 
			(
				jurnal_id, jurnaldetil_id, jurnaldetil_descr
				, coa_id, partner_id, struct_id, site_id, unit_id, project_id
				, curr_id, jurnaldetil_value, curr_rate, jurnaldetil_idr
				, jurnaltype_id, jurnal_date, jurnal_datedue, periode_id, jurnal_doc, _createby
				, agingtype_id, coacurr, iscurradj
				, isdebet, iskredit
			)

			select 
				A.jurnal_id, A.jurnaldetil_id, A.jurnaldetil_descr
				, A.coa_id, A.partner_id, A.struct_id, A.site_id, A.unit_id, A.project_id
				, A.curr_id, A.jurnaldetil_value, A.curr_rate, A.jurnaldetil_idr
				, B.jurnaltype_id, B.jurnal_date, B.jurnal_datedue, B.periode_id, B.jurnal_doc, B._createby
				, C.agingtype_id, C.curr_id as coacurr, C.iscurradj
				, coalesce(D.jurnaltypecoa_isdr, false) as isdebet, coalesce(D.jurnaltypecoa_iscr, false) as iskredit
			from temp.jurnalupload A left join public.jurnal B on B.jurnal_id=A.jurnal_id
									left join public.coa C on C.coa_id=A.coa_id
									left join public.jurnaltypecoa D on D.jurnaltype_id=B.jurnaltype_id and D.coa_id=A.coa_id 
			where 
			A.jurnal_id=\${jurnal_id}`

		await db.none(sql, { jurnal_id })

	} catch (err) {
		throw err
	}
}


async function updateLineId(db, jurnal_id, startLineCode) {
	try {
		const updateStmt = new pgp.PreparedStatement({
			name: 'update-jurnalupload-lineid',
			text: 'update temp.jurnalupload set jurnaldetil_id = $1 where jurnal_id = $2 and row_index = $3'
		})

		const sql = 'select jurnal_id, row_index from temp.jurnalupload where jurnal_id=${jurnal_id} order by row_index asc'
		await db.each(sql, { jurnal_id }, async (row, index) => {
			const currentLineCode = startLineCode + index
			await db.none(updateStmt, [currentLineCode, row.jurnal_id, row.row_index])
		})

	} catch (err) {
		throw err
	}
}


async function getRowCount(db, jurnal_id) {
	// ambil jumlah baris yang akan diimmport
	try {
		const sql = "select count(*) as rowcount from temp.jurnalupload where jurnal_id=${jurnal_id}"
		const row = await db.one(sql, { jurnal_id })
		const { rowcount } = row
		return rowcount

	} catch (err) {
		throw err
	}
}

async function getDocId(db, jurnal_id) {
	try {
		const sql = `
			select 
			B.doc_id
			from public.jurnal A inner join public.jurnaltype B on B.jurnaltype_id=A.jurnaltype_id
			where
			A.jurnal_id = \${jurnal_id}`

		const row = await db.one(sql, { jurnal_id })
		const { doc_id } = row
		return doc_id

	} catch (err) {
		throw err
	}
}

async function sleep(s) {
	if (s == 0) {
		return
	}
	return new Promise(lanjut => {
		setTimeout(() => {
			lanjut()
		}, s * 1000)
	})
}