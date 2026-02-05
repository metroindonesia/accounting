const tablename = 'public.coagroup'
const entityname = 'coagroup'
const HIERARCHY_PARAM = {
	tablename,
	entityname,
	idlength: 9,
	field_id: `${entityname}_id`,
	field_parent: `${entityname}_parent`,
	field_pathid: `${entityname}_pathid`,
	field_path: `${entityname}_path`,
	field_level: `${entityname}_level`
}



export async function headerCreated(self, tx, ret, data, logMetadata) {
	await updateHierarchy(self, tx, ret, HIERARCHY_PARAM)
}

export async function headerUpdated(self, tx, ret, data, logMetadata) {
	await updateHierarchy(self, tx, ret, HIERARCHY_PARAM)
}

export function headerListCriteria(self, db, searchMap, criteria, sort, columns) {
	searchMap.exclude_self = `${entityname}_id<>\${exclude_self}`
	sort[`${entityname}_path`] = 'asc'
}


async function updateHierarchy(self, tx, data, param) {
	const { idlength, tablename, entityname, field_id, field_parent, field_pathid, field_path, field_level } = param

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

			// cek anak-anaknya, apabila levelnya lebih tinggi. parentnya di set nul, biarr gak cyclic
			// TODO: buat querynya


		}
	}

	// update kembali data
	{
		const sql = `
			update ${tablename} set
				${field_pathid} = \${pathid},
				${field_path} = \${path},
				${field_level} = \${level}
			where 
				${field_id} = \${id}
			returning *	
		`
		const param = {
			id: CurrentData.id,
			pathid: CurrentData.pathid,
			path: CurrentData.path,
			level: CurrentData.level,
		}

		const res = await tx.one(sql, param)

	}

}