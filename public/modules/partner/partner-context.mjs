const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/partner'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'partner',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		partnerHeaderList: 'partnerHeaderList-section', 
		partnerHeaderEdit: 'partnerHeaderEdit-section', 
	},
	SectionMap: { 
		'partnerHeaderList-section' : 'partnerHeaderList', 
		'partnerHeaderEdit-section' : 'partnerHeaderEdit', 
	}
}
