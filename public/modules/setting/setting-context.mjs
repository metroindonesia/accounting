const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/setting'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'setting',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		settingHeaderList: 'settingHeaderList-section', 
		settingHeaderEdit: 'settingHeaderEdit-section', 
	},
	SectionMap: { 
		'settingHeaderList-section' : 'settingHeaderList', 
		'settingHeaderEdit-section' : 'settingHeaderEdit', 
	}
}
