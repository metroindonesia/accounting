export async function coa_init(self, initialData) {
	const req = self.req
	initialData.setting.COA_LENGTH = req.app.locals.appConfig.COA_LENGTH
}

export async function headerListCriteria(self, db, searchMap, criteria, sort, columns) {
	searchMap.coa_isdisabled = 'coa_isdisabled=${coa_isdisabled}'
	searchMap.agingtype_id = 'agingtype_id=${agingtype_id}'
}