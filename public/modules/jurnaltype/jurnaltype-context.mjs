const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/jurnaltype'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'jurnaltype',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		jurnaltypeHeaderList: 'jurnaltypeHeaderList-section', 
		jurnaltypeHeaderEdit: 'jurnaltypeHeaderEdit-section', 
		jurnaltypeCoaList: 'jurnaltypeCoaList-section', 
		jurnaltypeCoaEdit: 'jurnaltypeCoaEdit-section', 
		jurnaltypeUserList: 'jurnaltypeUserList-section', 
		jurnaltypeUserEdit: 'jurnaltypeUserEdit-section', 
	},
	SectionMap: { 
		'jurnaltypeHeaderList-section' : 'jurnaltypeHeaderList', 
		'jurnaltypeHeaderEdit-section' : 'jurnaltypeHeaderEdit', 
		'jurnaltypeCoaList-section' : 'jurnaltypeCoaList', 
		'jurnaltypeCoaEdit-section' : 'jurnaltypeCoaEdit', 
		'jurnaltypeUserList-section' : 'jurnaltypeUserList', 
		'jurnaltypeUserEdit-section' : 'jurnaltypeUserEdit', 
	}
}
