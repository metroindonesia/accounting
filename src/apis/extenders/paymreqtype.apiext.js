export async function headerListCriteria(self, db, searchMap, criteria, sort, columns, args) {
	searchMap.paymreqtype_isdisabled = `paymreqtype_isdisabled = \${paymreqtype_isdisabled}`
}

