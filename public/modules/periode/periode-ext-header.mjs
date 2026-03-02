import Context from './periode-context.mjs'
import * as pageHelper from '/public/lib/webmodule/pagehelper.mjs'


const _periode_id = 'periodeHeaderEdit-obj_periode_id'
const _periode_name = 'periodeHeaderEdit-obj_periode_name'
const _periode_isclosed = 'periodeHeaderEdit-obj_periode_isclosed'


export function init_header(self, args) {
	// untuk keperluan cetak halaman

}

export function setupActionButtonEvent(self, frm, CurrentState, buttons) {
	CurrentState.Actions.close.addEventListener('click', (evt) => { btn_actionClose_click(self, frm, CurrentState, evt) })
	CurrentState.Actions.reopen.addEventListener('click', (evt) => { btn_actionReopen_click(self, frm, CurrentState, evt) })

}

export function headerList_dataLoad(self, criteria, sort, evt) {
	sort.periode_id = 'desc'
}



export async function periodeHeaderEdit_formOpened(self, frm, CurrentState) {
	const periode_isclosed = frm.Inputs[_periode_isclosed].value

	CurrentState.Actions.close.suspend(periode_isclosed)
	CurrentState.Actions.reopen.suspend(!periode_isclosed)
}





async function btn_actionClose_click(self, frm, CurrentState, evt) {
	const periode_id = frm.Inputs[_periode_id].value
	const periode_name = frm.Inputs[_periode_name].value

	// konfirmasi kommit
	const ret = await $fgta5.MessageBox.confirm(`anda mau <b>Closing</b> periode '${periode_name}'. lanjutkan?`)
	if (ret !== 'ok') {
		return;
	}

	const obj_periode_isclosed = frm.Inputs[_periode_isclosed]
	try {
		const url = 'periode/execute'
		const result = await Module.apiCall(url, {
			fnName: 'close',
			periode_id: periode_id
		})

		if (result.periode_isclosed == false) {
			throw new Error('<b>Gagal</b> saat proses closing')
		}

		// check unchanged status
		if (result.unchanged) {
			console.warn('already closed. Data unchanged')
			return
		}

		obj_periode_isclosed.value = result.periode_isclosed
		frm.acceptChanges()

		self.Modules.periodeHeaderList.updateCurrentRow(self, { periode_isclosed: result.periode_isclosed })


		CurrentState.Actions.close.suspend(true)
		CurrentState.Actions.reopen.suspend(false)

		$fgta5.MessageBox.info(`periode '${periode_name}' berhasil di close.`)
	} catch (err) {
		$fgta5.MessageBox.error(err.message)
		throw err
	}
}


async function btn_actionReopen_click(self, frm, CurrentState, evt) {
	const periode_id = frm.Inputs[_periode_id].value
	const periode_name = frm.Inputs[_periode_name].value

	// konfirmasi kommit
	const reopenMessage = await $fgta5.MessageBox.ask(`<div class="fgta5-messagebox-questdiv">anda mau <span style="font-weight:bold; color:red">re-Open</span> periode '${periode_name}'</div>Alasan reopen?`)
	if (reopenMessage == null) {
		return;
	}


	const obj_periode_isclosed = frm.Inputs[_periode_isclosed]
	try {
		const url = 'periode/execute'
		const result = await Module.apiCall(url, {
			fnName: 'reopen',
			periode_id: periode_id,
			reopenMessage: reopenMessage
		})

		if (result.periode_isclosed == true) {
			throw new Error('<b>Gagal</b> saat proses reopen periode')
		}

		// check unchanged status
		if (result.unchanged) {
			console.warn('periode is already in open status. Data unchanged')
			return
		}

		obj_periode_isclosed.value = result.periode_isclosed
		frm.acceptChanges()

		self.Modules.periodeHeaderList.updateCurrentRow(self, { periode_isclosed: result.periode_isclosed })

		CurrentState.Actions.close.suspend(false)
		CurrentState.Actions.reopen.suspend(true)

		$fgta5.MessageBox.info(`periode '${periode_name}' berhasil di buka kembali`)
	} catch (err) {
		$fgta5.MessageBox.error(err.message)
		throw err
	}
}
