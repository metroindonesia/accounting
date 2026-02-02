const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/site'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'site',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		siteHeaderList: 'siteHeaderList-section', 
		siteHeaderEdit: 'siteHeaderEdit-section', 
	},
	SectionMap: { 
		'siteHeaderList-section' : 'siteHeaderList', 
		'siteHeaderEdit-section' : 'siteHeaderEdit', 
	}
}
