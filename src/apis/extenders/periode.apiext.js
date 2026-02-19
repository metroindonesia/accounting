export async function headerListCriteria(self, db, searchMap, criteria, sort, columns, args) {
	searchMap.periode_isclosed = 'periode_isclosed = ${periode_isclosed}'
	searchMap.periode_isactive = 'periode_isactive = ${periode_isactive}'

}
