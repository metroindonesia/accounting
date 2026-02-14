const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/paymreq'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'paymreq',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		paymreqHeaderList: 'paymreqHeaderList-section', 
		paymreqHeaderEdit: 'paymreqHeaderEdit-section', 
		paymreqDetilList: 'paymreqDetilList-section', 
		paymreqDetilEdit: 'paymreqDetilEdit-section', 
	},
	SectionMap: { 
		'paymreqHeaderList-section' : 'paymreqHeaderList', 
		'paymreqHeaderEdit-section' : 'paymreqHeaderEdit', 
		'paymreqDetilList-section' : 'paymreqDetilList', 
		'paymreqDetilEdit-section' : 'paymreqDetilEdit', 
	}
}
