const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/unit'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'unit',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		unitHeaderList: 'unitHeaderList-section', 
		unitHeaderEdit: 'unitHeaderEdit-section', 
	},
	SectionMap: { 
		'unitHeaderList-section' : 'unitHeaderList', 
		'unitHeaderEdit-section' : 'unitHeaderEdit', 
	}
}
