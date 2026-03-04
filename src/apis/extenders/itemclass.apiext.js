import { createSequencerLine } from '@agung_dhewe/webapps/src/sequencerline.js'
import sqlUtil from '@agung_dhewe/pgsqlc'


const TABLE = {
	itemclassstruct: 'public.itemclassstruct'
}

export async function headerListCriteria(self, db, searchMap, criteria, sort, columns, args) {
	searchMap.struct_id = 'struct_id = ${struct_id}'
	searchMap.visible_by_struct_id = `(owner_struct_id=\${visible_by_struct_id} or itemclass_id IN (select struct_id from ${TABLE.itemclassstruct} where struct_id=\${visible_by_struct_id}))`
}

export async function headerCreated(self, tx, ret, data, logMetadata, args) {
	// await updateStruc(self, tx, ret)
	// visible_by_struct_id
}


export async function headerUpdated(self, tx, ret, data, logMetadata) {
	// await updateStruc(self, tx, ret)
}

// async function updateStruc(self, tx, data) {
// 	const req = self.req
// 	const user_id = req.session.user.userId
// 	const { itemclass_id, owner_struct_id } = data
// 	const _timestamp = (new Date()).toISOString()

// 	sqlUtil.connect(tx)

// 	// buang dulu yang autocreate
// 	const sqlClearAutoinserted = `
// 		delete from ${TABLE.itemclassstruct}  where itemclass_id=\${itemclass_id} and isautocreate=true
// 	`
// 	await tx.none(sqlClearAutoinserted)


// 	// cek data di detil, apakah sudah ada data ishead
// 	const sqlDetilCek = `
// 		select itemclassstruct_id, struct_id, ishead 
// 		from ${TABLE.itemclassstruct} 
// 		where itemclass_id=\${itemclass_id} and struct_id=\${struct_id}`
// 	const rowCek = await tx.oneOrNone(sqlDetilCek, {
// 		itemclass_id,
// 		struct_id: owner_struct_id
// 	})

// 	// tarik status head dari semua detil
// 	const sqlRevokeHead = `update ${TABLE.itemclassstruct} set ishead=false where itemclass_id=\${itemclass_id}`
// 	await tx.none(sqlRevokeHead, { itemclass_id })


// 	if (rowCek != null) {
// 		// structure sudah ada di detil, cek apakah head
// 		// jika bukan head, update jadi head
// 		const sqlSetHead = `update ${TABLE.itemclassstruct} set ishead=true where itemclassstruct_id=\${itemclassstruct_id}`
// 		await tx.none(sqlSetHead, { itemclassstruct_id: rowCek.itemclassstruct_id })
// 	} else {
// 		// insert
// 		const args = {
// 			section: 'struct',
// 			prefix: ''
// 		}
// 		const sequencer = createSequencerLine(tx, {})
// 		const seqdata = await sequencer.increment(args.prefix)
// 		const itemclassstruct_id = seqdata.id
// 		const ins = {
// 			itemclass_id: itemclass_id,
// 			itemclassstruct_id: itemclassstruct_id,
// 			struct_id: owner_struct_id,
// 			itemclassstruct_isdisabled: false,
// 			isautocreate: true,
// 			ishead: true,
// 			_createby: user_id,
// 			_createdate: _timestamp
// 		}

// 		const cmd = sqlUtil.createInsertCommand(TABLE.itemclassstruct, ins)
// 		await cmd.execute(ins)
// 	}
// }