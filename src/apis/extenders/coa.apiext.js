const TABLE = {
	jurnaltypecoa: 'public.jurnaltypecoa'
}

export async function coa_init(self, initialData) {
	const req = self.req
	initialData.setting.COA_LENGTH = req.app.locals.appConfig.COA_LENGTH
}

export async function headerListCriteria(self, db, searchMap, criteria, sort, columns) {


	searchMap.coa_isdisabled = 'coa_isdisabled=${coa_isdisabled}'
	searchMap.agingtype_id = 'agingtype_id=${agingtype_id}'

	if (criteria.current_coa_id_selected != null) {
		const current_coa_id_selected = criteria.current_coa_id_selected
		delete criteria.current_coa_id_selected
		searchMap.exclude_jurnaltype_id = `(coa_id=${current_coa_id_selected} or coa_id not in (select coa_id from ${TABLE.jurnaltypecoa} where jurnaltype_id=\${exclude_jurnaltype_id}))`

	} else {
		searchMap.exclude_jurnaltype_id = `coa_id not in (select coa_id from ${TABLE.jurnaltypecoa} where jurnaltype_id=\${exclude_jurnaltype_id})`

	}
}