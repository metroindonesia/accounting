const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/paymreqtype'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'paymreqtype',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		paymreqtypeHeaderList: 'paymreqtypeHeaderList-section', 
		paymreqtypeHeaderEdit: 'paymreqtypeHeaderEdit-section', 
	},
	SectionMap: { 
		'paymreqtypeHeaderList-section' : 'paymreqtypeHeaderList', 
		'paymreqtypeHeaderEdit-section' : 'paymreqtypeHeaderEdit', 
	}
}
