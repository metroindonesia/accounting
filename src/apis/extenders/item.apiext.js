import { getUserPermission } from '@agung_dhewe/webapps/src/permission.js'
import db from '@agung_dhewe/webapps/src/db.js'
import * as permission from '../../../public/modules/item/item.permission.mjs'


export async function item_init(self, initialData) {
	const req = self.req
	const user_id = req.session.user.userId

	initialData.setting.allow_all_structure = await getUserPermission(db, user_id, permission.MANAGE_ALLSTRUCT)
}


export async function headerListCriteria(self, db, searchMap, criteria, sort, columns, args) {
	const req = self.req
	const user_id = req.session.user.userId


	// ambil data criteria
	const allow_all_structure = criteria.allow_all_structure;

	// hapus parameter di criteria, karena tidak diapakai di query
	delete criteria.allow_all_structure


	if (!allow_all_structure) {
		// tidak diperbolehkan query semua structure
		// batasi structure berdasarkan user_id
		searchMap.user_id = 'struct_id IN (select struct_id from public.structmember where user_id=${user_id})'
	} else {
		// user_id tidak digunakan di query, hapus dari criteria
		delete criteria.user_id
	}


	searchMap.struct_id = 'struct_id = ${struct_id}'
}