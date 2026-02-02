const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/coa'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'coa',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		coaHeaderList: 'coaHeaderList-section', 
		coaHeaderEdit: 'coaHeaderEdit-section', 
	},
	SectionMap: { 
		'coaHeaderList-section' : 'coaHeaderList', 
		'coaHeaderEdit-section' : 'coaHeaderEdit', 
	}
}
