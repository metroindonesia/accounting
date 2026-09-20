export async function headerDeleted(self, tx, deletedRow, logMetadata) {
	/* buat table log.deleteduser
	create table log.deleteduser (
		user_id int4 not null,
		_timestamp timestamptz default now() not null,
		constraint deleteduser_pk primary key (user_id)
	);
	*/

	try {
		const sql = `
			insert into log.deleteduser (
				user_id, _timestamp
			) values (
				$[user_id], now()
			)
			ON CONFLICT (user_id) DO UPDATE SET
				_timestamp = now()`

		const { user_id } = deletedRow
		await tx.none(sql, { user_id })
	} catch (err) {
		throw err
	}

}


