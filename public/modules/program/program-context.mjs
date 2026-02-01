const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/program'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'program',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		programHeaderList: 'programHeaderList-section', 
		programHeaderEdit: 'programHeaderEdit-section', 
	},
	SectionMap: { 
		'programHeaderList-section' : 'programHeaderList', 
		'programHeaderEdit-section' : 'programHeaderEdit', 
	}
}
