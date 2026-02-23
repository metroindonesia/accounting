import sqlUtil from '@agung_dhewe/pgsqlc'
import db from '@agung_dhewe/webapps/src/db.js'

const TABLE = {
	periode: 'public.periode',
}


export async function headerListCriteria(self, db, searchMap, criteria, sort, columns, args) {
	searchMap.periode_isclosed = 'periode_isclosed = ${periode_isclosed}'
	searchMap.periode_isactive = 'periode_isactive = ${periode_isactive}'

}



export async function close(self, db, body, periode_log) {
	const { periode_id } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()

	try {
		const sqlCurent = `
			select periode_isclosed 
			from ${TABLE.periode}
			where periode_id=\${periode_id}`
		const rowCurrent = await db.one(sqlCurent, { periode_id: periode_id })
		const periode_isclosed = rowCurrent.periode_isclosed


		if (periode_isclosed) {
			// tidak ada perubahan
			return {
				unchanged: true
			}
		}



		const result = await db.tx(async tx => {
			sqlUtil.connect(tx)

			// main proses
			// closing periode
			const sqlClose = 'call public.periode_close(${periode_id})'
			await db.none(sqlClose, {
				periode_id: periode_id
			})


			// update user yang melakukan closing
			const data = {
				periode_id,
				periode_closeby: user_id,
				periode_closedate: (new Date()).toISOString()
			}

			const cmd = sqlUtil.createUpdateCommand(TABLE.periode, data, ['periode_id'])
			const ret = await cmd.execute(data)
		})

		// cek hasil approval
		const sql = `
			select periode_isclosed, periode_closeby, periode_closedate 
			from ${TABLE.periode}
			where periode_id=\${periode_id}`

		const row = await db.one(sql, { periode_id: periode_id })
		periode_log(self, body, startTime, TABLE.periode, periode_id, 'CLOSED')

		return {
			periode_isclosed: row.periode_isclosed,
			periode_closeby: row.periode_closeby,
			periode_closedate: row.periode_closedate,
			message: ''
		}
	} catch (err) {
		throw err

	}
}


export async function reopen(self, db, body, periode_log) {
	const { periode_id, reopenMessage } = body
	const req = self.req
	const user_id = req.session.user.userId
	const startTime = process.hrtime.bigint()

	try {

		const sqlCurent = `
			select periode_isclosed
			from ${TABLE.periode}
			where periode_id=\${periode_id}`
		const rowCurrent = await db.one(sqlCurent, { periode_id: periode_id })
		const periode_isclosed = rowCurrent.periode_isclosed

		if (!periode_isclosed) {
			// tidak ada perubahan
			return {
				unchanged: true
			}
		}

		// cek apakah dokument sudah di tarik ke jurnal
		// jika sudah ditarik ke jurnal tidak bisa direject
		// ???


		const result = await db.tx(async tx => {
			sqlUtil.connect(tx)

			// main proses
			// reopen periode
			const sqlClose = 'call public.periode_reopen(${periode_id})'
			await db.none(sqlClose, {
				periode_id: periode_id
			})


			const data = {
				periode_id,
				periode_isclosed: false,
				periode_closeby: null,
				periode_closedate: null
			}

			const cmd = sqlUtil.createUpdateCommand(TABLE.periode, data, ['periode_id'])
			const ret = await cmd.execute(data)
		})

		// cek hasil approval
		const sql = `
			select periode_isclosed, periode_closeby, periode_closedate 
			from ${TABLE.periode}
			where periode_id=\${periode_id}`

		const row = await db.one(sql, { periode_id: periode_id })

		periode_log(self, body, startTime, TABLE.periode, periode_id, 'REOPEN', {}, reopenMessage)

		return {
			periode_isclosed: row.periode_isclosed,
			message: ''
		}
	} catch (err) {
		throw err

	}
}
