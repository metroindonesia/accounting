const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/txrowtype'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'txrowtype',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		txrowtypeHeaderList: 'txrowtypeHeaderList-section', 
		txrowtypeHeaderEdit: 'txrowtypeHeaderEdit-section', 
	},
	SectionMap: { 
		'txrowtypeHeaderList-section' : 'txrowtypeHeaderList', 
		'txrowtypeHeaderEdit-section' : 'txrowtypeHeaderEdit', 
	}
}
