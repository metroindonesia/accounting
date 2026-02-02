const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/coagroup'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'coagroup',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		coagroupHeaderList: 'coagroupHeaderList-section', 
		coagroupHeaderEdit: 'coagroupHeaderEdit-section', 
	},
	SectionMap: { 
		'coagroupHeaderList-section' : 'coagroupHeaderList', 
		'coagroupHeaderEdit-section' : 'coagroupHeaderEdit', 
	}
}
