import { getUserPermission } from '@agung_dhewe/webapps/src/permission.js'


const tablename = 'public.struct'
const entityname = 'struct'
const HIERARCHY_PARAM = {
	tablename,
	entityname,
	idlength: 9,
	field_id: `${entityname}_id`,
	field_parent: `${entityname}_parent`,
	field_pathid: `${entityname}_pathid`,
	field_path: `${entityname}_path`,
	field_level: `${entityname}_level`,
	field_isparent: `${entityname}_isparent`
}

const TABLE = {
	itemclassstruct: 'public.itemclassstruct'
}



export async function headerCreated(self, tx, ret, data, logMetadata) {
	await updateHierarchy(self, tx, ret, HIERARCHY_PARAM)
}

export async function headerUpdated(self, tx, ret, data, logMetadata) {
	await updateHierarchy(self, tx, ret, HIERARCHY_PARAM)
}

export async function headerListCriteria(self, db, searchMap, criteria, sort, columns) {
	searchMap.struct_isdisabled = 'struct_isdisabled=${struct_isdisabled}'
	searchMap.struct_isparent = 'struct_isparent=${struct_isparent}'
	searchMap.struct_istransaction = 'struct_istransaction=${struct_istransaction}'
	searchMap.exclude_self = 'struct_id<>${exclude_self}'


	// ambil data yang dikirimkan dari criteria
	const itemclass_id = criteria.itemclass_id
	const selectForItemclassMember = criteria.selectForItemclassMember
	const user_id = criteria.user_id
	const check_permission = criteria.check_permission;


	// hapus parameter di criteria, karena tidak diapakai di query
	delete criteria.itemclass_id
	delete criteria.selectForItemclassMember
	delete criteria.check_permission



	if (selectForItemclassMember) {

		searchMap.exclude_struct_id = 'struct_id <> ${exclude_struct_id}'
		searchMap.include_struct_id = `struct_id=\${include_struct_id} or struct_id not in (select struct_id from ${TABLE.itemclassstruct} where itemclass_id=${itemclass_id})`

	} else if (user_id) {

		// jika ada user yang dikirim, 
		// kemungkinan struct harus diquery sesuai dengan struct yang dimiliki oleh user 
		// kecuali jika ada permission yang membolehkan untuk mengambil semua

		// apakah ada permission khusus
		const allow_all_structure = await getUserPermission(db, user_id, check_permission)
		if (!allow_all_structure) {
			searchMap[`${entityname}_isparent`] = `${entityname}_isparent = \${${entityname}_isparent}`
			searchMap.exclude_self = `${entityname}_id<>\${exclude_self}`
			searchMap.user_id = 'struct_id IN (select struct_id from public.structmember where user_id=${user_id})'
			sort[`${entityname}_path`] = 'asc'

		} else {
			// user_id tidak digunakan, hapus dari criteria
			delete criteria.user_id
		}

	} else {
		sort[`${entityname}_path`] = 'asc'
	}
}


async function updateHierarchy(self, tx, data, param) {
	const { idlength, tablename, entityname, field_id, field_parent, field_pathid, field_path, field_level, field_isparent } = param

	const CurrentData = {}
	CurrentData.id = data[field_id]
	CurrentData.pathid = CurrentData.id.toString().padStart(idlength, '0')

	// kalau parent dipilih, set parent path
	let parent_path = ''
	// let parent_pathid = ''
	if (data[field_parent] != null) {
		const sql = `select ${field_path} as path, ${field_pathid} as pathid from ${tablename} where ${field_id}=\${parent}`
		const param = { parent: data[field_parent] }
		const res = await tx.one(sql, param)
		parent_path = res.path
		// parent_pathid = res.pathid
	}

	CurrentData.path = `${parent_path}${CurrentData.pathid}`
	CurrentData.level = CurrentData.path.length / idlength


	// cek apakah punya anak
	{
		const sql = `select count(*) as n from ${tablename} where ${field_parent}=\${id}`
		const param = { id: data[field_id] }
		const res = await tx.one(sql, param)
		if (res.n > 0) {
			CurrentData.isparent = true

			// cek anak-anaknya, apabila levelnya lebih tinggi. parentnya di set nul, biarr gak cyclic
			// TODO: buat querynya


		} else {
			CurrentData.isparent = data[field_isparent]
		}
	}

	// update kembali data
	{
		const sql = `
			update ${tablename} set
				${field_pathid} = \${pathid},
				${field_path} = \${path},
				${field_level} = \${level},
				${field_isparent} = \${isparent}
			where 
				${field_id} = \${id}
			returning *	
		`
		const param = {
			id: CurrentData.id,
			pathid: CurrentData.pathid,
			path: CurrentData.path,
			level: CurrentData.level,
			isparent: CurrentData.isparent
		}

		const res = await tx.one(sql, param)

	}

}