const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/project'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'project',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		projectHeaderList: 'projectHeaderList-section', 
		projectHeaderEdit: 'projectHeaderEdit-section', 
	},
	SectionMap: { 
		'projectHeaderList-section' : 'projectHeaderList', 
		'projectHeaderEdit-section' : 'projectHeaderEdit', 
	}
}
