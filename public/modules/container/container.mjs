const appElementId = 'mainapp'
const appmgr = new $fgta5.AppManager(appElementId)
const Context = {}

export default class extends Module {
	constructor() {
		super()
	}

	async main(args = {}) {
		await main(this, args)
	}
}


async function main(self, args) {
	const appmain = document.getElementById(appElementId)
	appmain.classList.add('hidden')

	try {
		// inisiasi sisi server
		try {
			const result = await Module.apiCall(`/container/init`, {})
			Context.notifierId = result.notifierId
			Context.notifierSocket = result.notifierSocket
			Context.userId = result.userId
			Context.userFullname = result.userFullname
			Context.sid = result.sid
			Context.title = result.title
			Context.programs = result.programs
			Context.favourites = result.favourites
		} catch (err) {
			throw err
		}

		// setup Application Manager
		appmgr.setTitle(Context.title)
		appmgr.setUser({ userid: Context.userId, displayname: Context.userFullname, profilepic: '' })
		appmgr.setMenu(Context.programs)
		appmgr.setMenuIcon('/public/icons/icon-logo-metro-32x32.svg')
		appmgr.setFavourite(Context.favourites)

		appmgr.addEventListener('logout', (evt) => {
			appmgr_logout(self, evt)
		})

		appmgr.addEventListener('addtofavourite', evt => {
			appmgr_addtofavourite(self, evt)
		})

		appmgr.addEventListener('removefavourite', evt => {
			appmgr_removefavourite(self, evt)
		})

		appmgr.addEventListener('openprofile', evt => {
			appmgr_openprofile(self, evt)
		})

		appmgr.addEventListener('openpreference', evt => {
			appmgr_openpreference(self, evt)
		})



		// const btnTestFetch = document.getElementById('btnTestFetch')
		// btnTestFetch.addEventListener('click', evt=>{
		// 	btnTestFetch_click()
		// })

	} catch (err) {
		throw err
	}
}

async function appmgr_logout(self, evt) {
	let mask = $fgta5.Modal.createMask()
	try {
		const result = await Module.apiCall(`login/do-logout`, {})
		if (result) {
			sessionStorage.removeItem('nextmodule');
			sessionStorage.removeItem('login_nexturl');
			sessionStorage.removeItem('login');
			location.href = '/login'
		}
	} catch (err) {
		console.log(err)
		$fgta5.MessageBox.error(err.message)
	} finally {
		mask.close()
		mask = null
	}
}

async function appmgr_addtofavourite(self, evt) {
	try {
		const program_id = evt.detail.modulename
		const param = { program_id }
		const result = await Module.apiCall(`/container/add-to-favourite`, param)
	} catch (err) {
		console.log(err)
		$fgta5.MessageBox.error(err.message)
	}

}

async function appmgr_removefavourite(self, evt) {
	try {
		const program_id = evt.detail.modulename
		const param = { program_id }
		const result = await Module.apiCall(`/container/remove-from-favourite`, param)
	} catch (err) {
		console.log(err)
		$fgta5.MessageBox.error(err.message)
	}
}

async function appmgr_openprofile(self, evt) {
	try {
		
		const currentUrl = new URL(window.location.href)

		// buka program profile
		const type = 'program'
		const name = 'profile'
		const title = 'Profile'
		const url = currentUrl.origin + '/profile'
		const icon = '/public/modules/profile/profile.svg'
		appmgr.openModule({
			type,
			name,
			title,
			url,
			icon
		})
	} catch (err) {
		console.log(err)
		$fgta5.MessageBox.error(err.message)
	}
}

async function appmgr_openpreference(self, evt) {
	try {

		const currentUrl = new URL(window.location.href)

		// buka program profile
		const type = 'program'
		const name = 'preference'
		const title = 'Preference'
		const url = currentUrl.origin + '/preference'
		appmgr.openModule({
			type,
			name,
			title,
			url
		})

	} catch (err) {
		console.log(err)
		$fgta5.MessageBox.error(err.message)
	}
}



// async function btnTestFetch_click() {
// 	console.log('fetch')

// 	const url = "https://act-dev.transfashion.id/jurnal"

// 	const result = await fetch(url, {
// 		method: 'GET',
// 		credentials: 'include'
// 	})

// 	console.log(result)

// }