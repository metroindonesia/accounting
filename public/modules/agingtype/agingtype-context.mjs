const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/agingtype'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'agingtype',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		agingtypeHeaderList: 'agingtypeHeaderList-section', 
		agingtypeHeaderEdit: 'agingtypeHeaderEdit-section', 
	},
	SectionMap: { 
		'agingtypeHeaderList-section' : 'agingtypeHeaderList', 
		'agingtypeHeaderEdit-section' : 'agingtypeHeaderEdit', 
	}
}
