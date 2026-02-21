const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/jurnalmodel'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'jurnalmodel',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		jurnalmodelHeaderList: 'jurnalmodelHeaderList-section', 
		jurnalmodelHeaderEdit: 'jurnalmodelHeaderEdit-section', 
	},
	SectionMap: { 
		'jurnalmodelHeaderList-section' : 'jurnalmodelHeaderList', 
		'jurnalmodelHeaderEdit-section' : 'jurnalmodelHeaderEdit', 
	}
}
