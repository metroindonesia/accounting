const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/partnertype'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'partnertype',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		partnertypeHeaderList: 'partnertypeHeaderList-section', 
		partnertypeHeaderEdit: 'partnertypeHeaderEdit-section', 
	},
	SectionMap: { 
		'partnertypeHeaderList-section' : 'partnertypeHeaderList', 
		'partnertypeHeaderEdit-section' : 'partnertypeHeaderEdit', 
	}
}
