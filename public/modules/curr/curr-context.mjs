const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/curr'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'curr',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		currHeaderList: 'currHeaderList-section', 
		currHeaderEdit: 'currHeaderEdit-section', 
	},
	SectionMap: { 
		'currHeaderList-section' : 'currHeaderList', 
		'currHeaderEdit-section' : 'currHeaderEdit', 
	}
}
