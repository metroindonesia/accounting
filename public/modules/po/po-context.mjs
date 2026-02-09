const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/po'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'po',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		poHeaderList: 'poHeaderList-section', 
		poHeaderEdit: 'poHeaderEdit-section', 
	},
	SectionMap: { 
		'poHeaderList-section' : 'poHeaderList', 
		'poHeaderEdit-section' : 'poHeaderEdit', 
	}
}
