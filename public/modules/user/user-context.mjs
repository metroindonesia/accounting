const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/user'
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main) 

export default {
	moduleName: 'user',
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: { 
		userHeaderList: 'userHeaderList-section', 
		userHeaderEdit: 'userHeaderEdit-section', 
		userLoginList: 'userLoginList-section', 
		userLoginEdit: 'userLoginEdit-section', 
		userPropList: 'userPropList-section', 
		userPropEdit: 'userPropEdit-section', 
		userGroupList: 'userGroupList-section', 
		userGroupEdit: 'userGroupEdit-section', 
		userFavouriteList: 'userFavouriteList-section', 
		userFavouriteEdit: 'userFavouriteEdit-section', 
	},
	SectionMap: { 
		'userHeaderList-section' : 'userHeaderList', 
		'userHeaderEdit-section' : 'userHeaderEdit', 
		'userLoginList-section' : 'userLoginList', 
		'userLoginEdit-section' : 'userLoginEdit', 
		'userPropList-section' : 'userPropList', 
		'userPropEdit-section' : 'userPropEdit', 
		'userGroupList-section' : 'userGroupList', 
		'userGroupEdit-section' : 'userGroupEdit', 
		'userFavouriteList-section' : 'userFavouriteList', 
		'userFavouriteEdit-section' : 'userFavouriteEdit', 
	}
}
