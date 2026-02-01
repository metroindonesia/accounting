const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/interface'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'interface',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		interfaceHeaderList: 'interfaceHeaderList-section', 
		interfaceHeaderEdit: 'interfaceHeaderEdit-section', 
	},
	SectionMap: { 
		'interfaceHeaderList-section' : 'interfaceHeaderList', 
		'interfaceHeaderEdit-section' : 'interfaceHeaderEdit', 
	}
}
