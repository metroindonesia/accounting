const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/paymtype'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'paymtype',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		paymtypeHeaderList: 'paymtypeHeaderList-section', 
		paymtypeHeaderEdit: 'paymtypeHeaderEdit-section', 
	},
	SectionMap: { 
		'paymtypeHeaderList-section' : 'paymtypeHeaderList', 
		'paymtypeHeaderEdit-section' : 'paymtypeHeaderEdit', 
	}
}
