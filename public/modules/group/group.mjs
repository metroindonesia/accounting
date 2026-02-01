import Context from './group-context.mjs'  
import * as groupHeaderList from './groupHeaderList.mjs' 
import * as groupHeaderEdit from './groupHeaderEdit.mjs' 
import * as groupProgramList from './groupProgramList.mjs' 
import * as groupProgramEdit from './groupProgramEdit.mjs' 
import * as Extender from './group-ext.mjs'

const app = Context.app
const Crsl = Context.Crsl


export default class extends Module {
	constructor() {
		super()
	}

	async main(args={}) {
		
		console.log('initializing module...')
		app.setTitle('Group')
		app.showFooter(true)
		
		args.autoLoadGridData = true

		const self = this
		Context.program = self

		// module-module yang di load perlu di pack dulu ke dalam variable
		// jangan import lagi module-module ini di dalam mjs tersebut
		// karena akan terjadi cyclic redudancy pada saat di rollup
		self.Modules = { 
			groupHeaderList, 
			groupHeaderEdit, 
			groupProgramList, 
			groupProgramEdit, 
		}

		try {

			// inisiasi sisi server
			try {
				const result = await Module.apiCall(`/${Context.moduleName}/init`, { })
				Context.notifierId = result.notifierId
				Context.notifierSocket = result.notifierSocket
				Context.userId = result.userId
				Context.userFullname = result.userFullname
				Context.sid = result.sid
				Context.appName = result.appName
				Context.appsUrls = result.appsUrls
				Context.setting = result.setting
			} catch (err) {
				throw err
			} 

			await Promise.all([ 
				groupHeaderList.init(self, args), 
				groupHeaderEdit.init(self, args), 
				groupProgramList.init(self, args), 
				groupProgramEdit.init(self, args), 
				Extender.init(self, args)
			])

			// render dan setup halaman
			await render(self)

			// listen keyboard action
			listenUserKeys(self)
			

			// kalau user melakukan reload, konfirm dulu
			const modNameList = ['groupHeaderEdit', 'groupProgramEdit']
			window.onbeforeunload = (evt)=>{ 
				// cek dulu semua form
				let isFormDirty = false
				for (var modname of modNameList) {
					const module = self.Modules[modname]
					const frm = module.getForm(self)
					if (frm.isChanged()) {
						isFormDirty = isFormDirty || true
					}
				}
				if (isFormDirty) {
					evt.preventDefault();
					return  "Changes you made may not be saved."
				}
			};


		} catch (err) {
			throw err
		}
	}

}

async function render(self) {
	try {
		const footerButtonsContainer =  document.getElementsByClassName('footer-buttons-container')
		Module.renderFooterButtons(footerButtonsContainer)
	
		// Setup Icon
		Crsl.setIconUrl('public/modules/group/group.svg')


		// Set listener untuk section carousel
		Crsl.addEventListener($fgta5.SectionCarousell.EVT_SECTIONSHOWING, (evt)=>{
			var sectionId = evt.detail.commingSection.Id
			for (let cont of footerButtonsContainer) {
				var currContainerSectionId = cont.getAttribute('data-section')
				if (currContainerSectionId==sectionId) {
					setTimeout(()=>{
						cont.classList.remove('hidden')
						cont.style.animation = 'dropped 0.3s forwards'
						setTimeout(()=>{
							cont.style.animation = 'unset'	
						}, 300)
					}, 500)
				} else {
					cont.classList.add('hidden')
				}
			}
		})
		
		Crsl.Items['fRecord-section'].addEventListener($fgta5.Section.EVT_BACKBUTTONCLICK, async (evt)=>{
			evt.detail.fn_ShowNextSection()
		})

		Crsl.Items['fLogs-section'].addEventListener($fgta5.Section.EVT_BACKBUTTONCLICK, async (evt)=>{
			evt.detail.fn_ShowNextSection()
		})

		Crsl.Items['fAbout-section'].addEventListener($fgta5.Section.EVT_BACKBUTTONCLICK, async (evt)=>{
			evt.detail.fn_ShowNextSection()
		})
		

		// Set panel detil saat hover di detil item
		const detilpanel = document.getElementById('panel-detil-selector')
		detilpanel.querySelectorAll('.panel-detil-row a').forEach(link => {
			link.addEventListener('mouseenter', () => {
				link.closest('.panel-detil-row').classList.add('panel-detil-row-highligted');
			});

			link.addEventListener('mouseleave', () => {
				link.closest('.panel-detil-row').classList.remove('panel-detil-row-highligted');
			});


			const sectionTargetName = link.getAttribute('data-target-section')
			const sectionCurrentName = link.getAttribute('data-current-section')
			
			// Detil bisa dibuka apabila data sudah di save
			link.addEventListener('click', (evt)=>{
				const moduleHeaderEdit = self.Modules[sectionCurrentName]
				const form = moduleHeaderEdit.getForm()
				if (form.isNew()) {
					console.warn('tidak bisa buka detil jika data baru')	
					$fgta5.MessageBox.warning('Detil bisa dibuka setelah data disimpan')
					return;
				}

				openDetilSection(self, sectionTargetName, sectionCurrentName)
			})

			// jika ada event-event yang khusus untuk mobile device
			// if (Module.isMobileDevice()) {
			// }
		});

		
		// group-ext.mjs, export function extendPage(self) {} 
		const fn_name = 'extendPage'
		const fn_extendPage = Extender[fn_name]
		if (typeof fn_extendPage === 'function') {
			fn_extendPage(self)
		} else {
			console.warn(`'extendPage' tidak diimplementasikan di extender`)
		}

	} catch (err) {
		throw err
	}
}


function openDetilSection(self, sectionTargetName, sectionCurrentName) {
	const sectionCurrentId = Context.Sections[sectionCurrentName]
	const sectionCurrent =   Crsl.Items[sectionCurrentId]

	const sectionId = Context.Sections[sectionTargetName]
	const section = Crsl.Items[sectionId]

	section.setSectionReturn(sectionCurrent)
	section.show({}, ()=>{
		const moduleTarget = self.Modules[sectionTargetName]
		const moduleHeaderEdit = self.Modules[sectionCurrentName]
		moduleTarget.openList(self, {
			moduleHeaderEdit
		})
	})
}


function listenUserKeys(self) {

	// capture tombol
	const allowedKeys = /^[a-zA-Z0-9 ]$/; // huruf, angka, spasi
	document.addEventListener('keydown', (evt) => {
		if (evt.ctrlKey || evt.metaKey || evt.altKey) {
			// bebaskan jika tekan Ctrl / alt
		} else if (allowedKeys.test(evt.key) || evt.key === 'Backspace' || evt.key === 'Delete') {
			// Tangani huruf, angka, spasi, backspace dan delete
			const id = Crsl.CurrentSection.Id
			const moduleId = Context.SectionMap[id]
			const module = self.Modules[moduleId]
			keyboardAction(self, module, 'typing', evt)
		}
	}, true)

	// handle keyboard event	
	document.addEventListener('keydown', (evt) => {
		const id = Crsl.CurrentSection.Id
		const moduleId = Context.SectionMap[id]
		const module = self.Modules[moduleId]

		// jika ada dialog yang terbuka, semua event keyboard abaikan dulu, keculai tombol escape
		const dialogs = [...document.querySelectorAll('dialog[open]')];
		const dialog = dialogs.pop() || null;
		// const dialog = document.querySelector('dialog[open]');
		if (dialog) {
			if (evt.key.toLowerCase()=='escape') {
				dialog.close()
				evt.preventDefault()
				evt.stopPropagation()
			} else if ((evt.ctrlKey || evt.metaKey) && evt.key.toLowerCase() === 's') {
				evt.preventDefault(); 
			}
			return
		}

		// Cek apakah tombol Ctrl (atau Cmd di Mac) ditekan bersamaan dengan huruf 'S'
		const key = evt.key.toLowerCase()
		if ((evt.ctrlKey || evt.metaKey) && key === 's') {
			evt.preventDefault(); // Mencegah aksi default (save page)
			keyboardAction(self, module, 'save', evt)
		} else if (((evt.ctrlKey || evt.metaKey) && key === 'n') || (evt.ctrlKey && key==='f2')) {
			evt.preventDefault(); // Mencegah aksi default
			keyboardAction(self, module, 'new', evt)
		} else if ( key ==='escape') {
			evt.preventDefault();
			keyboardAction(self, module, 'escape', evt)
		} else if ( key === 'f2' ) {
			keyboardAction(self, module, 'togleEdit', evt)
		} else if ( key === 'arrowup' ) {
			keyboardAction(self, module, 'up', evt)
		} else if ( key === 'arrowdown' ) {	
			keyboardAction(self, module, 'down', evt)
		} else if ( key === 'arrowright' ) {
			keyboardAction(self, module, 'right', evt)
		} else if ( key === 'arrowleft' ) {	
			keyboardAction(self, module, 'left', evt)
		} else if ( key === 'enter' ) {	
			keyboardAction(self, module, 'enter', evt)
		}
	});
}


function keyboardAction(self, module, actionName, evt) {

	if (module!=null) {
		module.keyboardAction(self,  actionName, evt)
	} else {
		// untuk keperluan log dan about, saat escape: back
		if (actionName=='escape') {
			Crsl.CurrentSection.back()
		}
	}

}