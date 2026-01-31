const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/programgroup'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'programgroup',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		programgroupHeaderList: 'programgroupHeaderList-section', 
		programgroupHeaderEdit: 'programgroupHeaderEdit-section', 
	},
	SectionMap: { 
		'programgroupHeaderList-section' : 'programgroupHeaderList', 
		'programgroupHeaderEdit-section' : 'programgroupHeaderEdit', 
	}
}
