export async function headerListCriteria(self, db, searchMap, criteria, sort, columns, args) {
	searchMap.taxtype_model = `taxtype_model = \${taxtype_model}`
	searchMap.taxtype_isdisabled = `taxtype_isdisabled = \${taxtype_isdisabled}`
}