export async function headerListCriteria(self, db, searchMap, criteria, sort, columns, args) {
	searchMap.partner_isdisabled = 'partner_isdisabled = ${partner_isdisabled}'
}


export async function bankListCriteria(self, db, searchMap, criteria, sort, columns, args) {
	searchMap.partnerbank_isdisabled = 'partnerbank_isdisabled = ${partnerbank_isdisabled}'
}


export async function contactListCriteria(self, db, searchMap, criteria, sort, columns, args) {
	searchMap.partnercontact_isdisabled = 'partnercontact_isdisabled = ${partnercontact_isdisabled}'
}