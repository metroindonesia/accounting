const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/jurnal'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'jurnal',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		jurnalHeaderList: 'jurnalHeaderList-section', 
		jurnalHeaderEdit: 'jurnalHeaderEdit-section', 
		jurnalDetilList: 'jurnalDetilList-section', 
		jurnalDetilEdit: 'jurnalDetilEdit-section', 
	},
	SectionMap: { 
		'jurnalHeaderList-section' : 'jurnalHeaderList', 
		'jurnalHeaderEdit-section' : 'jurnalHeaderEdit', 
		'jurnalDetilList-section' : 'jurnalDetilList', 
		'jurnalDetilEdit-section' : 'jurnalDetilEdit', 
	}
}
