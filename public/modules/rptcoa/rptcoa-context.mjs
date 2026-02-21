const app = new $fgta5.Application('mainapp')
const urlDir = 'public/modules/rptledgerMain'  // todo: sesuaikan
const Crsl = new $fgta5.SectionCarousell(app.Nodes.Main)


export default {
	moduleName: 'rptcoa',  // todo: sesuaikan
	app: app,
	urlDir: urlDir,
	Crsl: Crsl,
	Sections: {
		reportviewerMain: `reportviewerMain-section`,  // todo: sesuaikan
	},
	SectionMap: {
		'reportviewerMain-section': 'reportviewerMain',  // todo: sesuaikan
	},

	setTitle: (title) => {
		const mainSection = document.getElementById('reportviewerMain-section')  // todo: sesuaikan

		app.setTitle(title)
		const elTitle = mainSection.querySelector('[data-title]')
		elTitle.setAttribute('data-title', title)
		elTitle.innerHTML = title

	}
}