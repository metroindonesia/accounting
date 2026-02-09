const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/ffl'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'ffl',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		fflHeaderList: 'fflHeaderList-section', 
		fflHeaderEdit: 'fflHeaderEdit-section', 
	},
	SectionMap: { 
		'fflHeaderList-section' : 'fflHeaderList', 
		'fflHeaderEdit-section' : 'fflHeaderEdit', 
	}
}
