const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/auth'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'auth',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		authHeaderList: 'authHeaderList-section', 
		authHeaderEdit: 'authHeaderEdit-section', 
	},
	SectionMap: { 
		'authHeaderList-section' : 'authHeaderList', 
		'authHeaderEdit-section' : 'authHeaderEdit', 
	}
}
