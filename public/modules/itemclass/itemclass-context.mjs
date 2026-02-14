const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/itemclass'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'itemclass',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		itemclassHeaderList: 'itemclassHeaderList-section', 
		itemclassHeaderEdit: 'itemclassHeaderEdit-section', 
	},
	SectionMap: { 
		'itemclassHeaderList-section' : 'itemclassHeaderList', 
		'itemclassHeaderEdit-section' : 'itemclassHeaderEdit', 
	}
}
