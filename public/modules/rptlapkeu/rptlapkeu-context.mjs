const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/rptlapkeuMain'  // todo: sesuaikan
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main)




export default {
	moduleName: 'rptlapkeu',  // todo: sesuaikan
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: {
		reportviewerMain: `reportviewerMain-section`,
	},
	SectionMap: {
		'reportviewerMain-section': 'reportviewerMain',
	},

	setTitle: (title) => {
		const mainSection = document.getElementById('reportviewerMain-section')

		app.setTitle(title)
		const elTitle = mainSection.querySelector('[data-title]')
		elTitle.setAttribute('data-title', title)
		elTitle.innerHTML = title

	}
}