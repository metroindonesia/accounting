const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/bc'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'bc',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		bcHeaderList: 'bcHeaderList-section', 
		bcHeaderEdit: 'bcHeaderEdit-section', 
	},
	SectionMap: { 
		'bcHeaderList-section' : 'bcHeaderList', 
		'bcHeaderEdit-section' : 'bcHeaderEdit', 
	}
}
