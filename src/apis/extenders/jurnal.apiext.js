import sqlUtil from '@agung_dhewe/pgsqlc'
import db from '@agung_dhewe/webapps/src/db.js'

const TABLE = {
	jurnaltype: 'public.jurnaltype',
	paymtype: 'public.paymtype',
	periode: 'public.periode',
	jurnaltypeuser: 'public.jurnaltypeuser',
	jurnaldetil: 'public.jurnaldetil',
	doc: 'core.doc',
	user: 'core.user'
}

export async function jurnal_init(self, initialData) {
	const req = self.req
	initialData.setting.defaultCurr = req.app.locals.appConfig.defaultCurr
	initialData.setting.COMPANY_PRINTLOGO = req.app.locals.appConfig.COMPANY_PRINTLOGO


	/* ambil data paymtype */
	try {
		const sql = `
		select 
			paymtype_id, 
			ishaspartnercontact, ishaspartnerbankselector , ishasbankaccount, 
			ishasbankaccountname, ishasbankname, ishasgiro
		from ${TABLE.paymtype}
		`
		const rows = await db.any(sql)
		const paymtype = {}
		for (let row of rows) {
			paymtype[row.paymtype_id] = row
		}
		initialData.setting.paymtype = paymtype
	} catch (err) {
		throw err
	}


}

export async function sequencerSetup(self, tx, sequencer, data, args) {
	sqlUtil.connect(tx)
	try {
		// ambil document
		const { doc_id } = await sqlUtil.lookupdb(tx, TABLE.jurnaltype, 'jurnaltype_id', data.jurnaltype_id)
		args.doc_id = doc_id
	} catch (err) {
		throw err
	}
}


export async function headerCreating(self, tx, data, seqdata) {
	excludeNonEditableHeader(data)  // buang data yang tidak boleh dimodif user
	data.jurnal_doc = seqdata.doc;
}

export async function headerUpdating(self, tx, data) {
	excludeNonEditableHeader(data) 	// buang data yang tidak boleh dimodif user
}


export async function headerOpen(self, db, data) {
	const { userId: user_id } = self.req.session.user;
	const { jurnaltype_id, paymtype_id, jurnal_id, periode_id, _postby, _commitby } = data;

	sqlUtil.connect(db);

	// Jalankan semua query secara paralel menggunakan Promise.all
	const [
		jurnaltype,
		paymtype,
		periode,
		postByUser,
		commitByUser,
		allowRow,
		totalRow
	] = await Promise.all([
		sqlUtil.lookupdb(db, TABLE.jurnaltype, 'jurnaltype_id', jurnaltype_id),
		sqlUtil.lookupdb(db, TABLE.paymtype, 'paymtype_id', paymtype_id),
		sqlUtil.lookupdb(db, TABLE.periode, 'periode_id', periode_id),
		sqlUtil.lookupdb(db, TABLE.user, 'user_id', _postby),
		sqlUtil.lookupdb(db, TABLE.user, 'user_id', _commitby),
		db.oneOrNone(`SELECT isallowposting, isallowunposting FROM ${TABLE.jurnaltypeuser} WHERE jurnaltype_id=\${jurnaltype_id} AND user_id=\${user_id}`, { jurnaltype_id, user_id }),
		db.oneOrNone(`SELECT SUM(jurnaldetil_value) as total_value, SUM(jurnaldetil_idr) as total_idr FROM ${TABLE.jurnaldetil} WHERE jurnal_id = \${jurnal_id}`, { jurnal_id })
	]);


	// Mapping hasil secara ringkas
	Object.assign(data, {
		jurnaltype,
		paymtype,
		periode,
		// periode_isclosed: periode?.periode_isclosed,
		_postby: postByUser?.user_fullname ?? '',
		_commitby: commitByUser?.user_fullname ?? '',
		isallowposting: allowRow?.isallowposting ?? false,
		isallowunposting: allowRow?.isallowunposting ?? false,
		total_value: totalRow?.total_value ?? 0,
		total_idr: totalRow?.total_idr ?? 0
	});
}



function excludeNonEditableHeader(data) {
	//  data ini tidak bisa diisi saat insert
	delete data.iscommit
	delete data.ispost
	delete data.jurnaldetil_id_link
	delete data._postby
	delete data._postdate
	delete data._commitby
	delete data._commitdate

}

function excludeNonEditableDetil(data) {
	delete data.jurnaldetil_id_ref
	delete data.jurnaldetil_ishead
}