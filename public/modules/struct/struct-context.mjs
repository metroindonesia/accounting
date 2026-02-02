const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/struct'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'struct',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		structHeaderList: 'structHeaderList-section', 
		structHeaderEdit: 'structHeaderEdit-section', 
	},
	SectionMap: { 
		'structHeaderList-section' : 'structHeaderList', 
		'structHeaderEdit-section' : 'structHeaderEdit', 
	}
}
