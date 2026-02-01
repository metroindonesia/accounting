const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/group'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'group',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		groupHeaderList: 'groupHeaderList-section', 
		groupHeaderEdit: 'groupHeaderEdit-section', 
		groupProgramList: 'groupProgramList-section', 
		groupProgramEdit: 'groupProgramEdit-section', 
	},
	SectionMap: { 
		'groupHeaderList-section' : 'groupHeaderList', 
		'groupHeaderEdit-section' : 'groupHeaderEdit', 
		'groupProgramList-section' : 'groupProgramList', 
		'groupProgramEdit-section' : 'groupProgramEdit', 
	}
}
