const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/coarpt'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'coarpt',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		coarptHeaderList: 'coarptHeaderList-section', 
		coarptHeaderEdit: 'coarptHeaderEdit-section', 
	},
	SectionMap: { 
		'coarptHeaderList-section' : 'coarptHeaderList', 
		'coarptHeaderEdit-section' : 'coarptHeaderEdit', 
	}
}
