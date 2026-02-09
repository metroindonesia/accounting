const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/taxtype'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'taxtype',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		taxtypeHeaderList: 'taxtypeHeaderList-section', 
		taxtypeHeaderEdit: 'taxtypeHeaderEdit-section', 
	},
	SectionMap: { 
		'taxtypeHeaderList-section' : 'taxtypeHeaderList', 
		'taxtypeHeaderEdit-section' : 'taxtypeHeaderEdit', 
	}
}
