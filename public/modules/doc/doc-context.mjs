const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/doc'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'doc',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		docHeaderList: 'docHeaderList-section', 
		docHeaderEdit: 'docHeaderEdit-section', 
	},
	SectionMap: { 
		'docHeaderList-section' : 'docHeaderList', 
		'docHeaderEdit-section' : 'docHeaderEdit', 
	}
}
