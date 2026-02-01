const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/apps'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'apps',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		appsHeaderList: 'appsHeaderList-section', 
		appsHeaderEdit: 'appsHeaderEdit-section', 
	},
	SectionMap: { 
		'appsHeaderList-section' : 'appsHeaderList', 
		'appsHeaderEdit-section' : 'appsHeaderEdit', 
	}
}
