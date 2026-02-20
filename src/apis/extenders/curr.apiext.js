const TABLE = {
	currrate: "public.currrate"
}

export async function headerListCriteria(self, db, searchMap, criteria, sort, columns, args) {
	// pindahkan curr_date ke argumen, kemudian hapus sebagai criteria, karena curr_date tidak ada di field ent.curr
	// ini untuk keperluan mengambil rate berdasarkan tanggal dari table ent.currrate di ext function headerListRow
	args.curr_date = criteria.curr_date

	const coa_iscurradj = criteria.coa_iscurradj

	delete criteria.curr_date
	delete criteria.coa_iscurradj

	if (coa_iscurradj) {
		// jika ada request untuk adjustment currency, munculkan IDR dan currency foreign
		searchMap.curr_id = '(curr_id = ${curr_id} or curr_id=1)'
	} else {
		searchMap.curr_id = 'curr_id = ${curr_id}'
	}
}


export async function headerListRow(self, row, args) {
	const db = args.db
	const curr_id = row.curr_id
	const curr_date = args.curr_date ?? new Date().toISOString().split('T')[0];
	const sql = `select * from ${TABLE.currrate} where curr_id=\${curr_id} and currrate_date<=\${curr_date} order by currrate_date desc limit 1`
	const data = await db.oneOrNone(sql, { curr_id, curr_date })

	row.curr_rate = data.currrate_value
	row.curr_date = data.currrate_date
}