const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/curr'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'curr',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		currHeaderList: 'currHeaderList-section', 
		currHeaderEdit: 'currHeaderEdit-section', 
		currRateList: 'currRateList-section', 
		currRateEdit: 'currRateEdit-section', 
	},
	SectionMap: { 
		'currHeaderList-section' : 'currHeaderList', 
		'currHeaderEdit-section' : 'currHeaderEdit', 
		'currRateList-section' : 'currRateList', 
		'currRateEdit-section' : 'currRateEdit', 
	}
}
