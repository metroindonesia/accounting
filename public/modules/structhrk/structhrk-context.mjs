const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/structhrk'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'structhrk',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		structhrkHeaderList: 'structhrkHeaderList-section', 
		structhrkHeaderEdit: 'structhrkHeaderEdit-section', 
	},
	SectionMap: { 
		'structhrkHeaderList-section' : 'structhrkHeaderList', 
		'structhrkHeaderEdit-section' : 'structhrkHeaderEdit', 
	}
}
