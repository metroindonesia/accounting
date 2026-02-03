const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/periode'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'periode',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		periodeHeaderList: 'periodeHeaderList-section', 
		periodeHeaderEdit: 'periodeHeaderEdit-section', 
	},
	SectionMap: { 
		'periodeHeaderList-section' : 'periodeHeaderList', 
		'periodeHeaderEdit-section' : 'periodeHeaderEdit', 
	}
}
