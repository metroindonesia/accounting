let Selectors;
let searchproject_timeout = null;
let searchproject_endpoint


export function setSearchProjectEndpoint(endpoint) {
	searchproject_endpoint = endpoint
}

export async function populateUnit(unitselect, endpoint, apiparam) {
	try {
		// const result = await Module.apiCall(`/${Context.moduleName}/get-unit-list`, {})
		const result = await Module.apiCall(endpoint, apiparam)
		result.forEach(item => {
			const option = document.createElement('option');
			option.value = item.unit_id;       // Nilai yang dikirim saat form di-submit
			option.textContent = item.unit_name; // Teks yang muncul di layar
			unitselect.appendChild(option);
		});
	} catch (err) {
		console.error(err)
	}
}

export async function populateStruct(structselect, endpoint, apiparam) {
	try {
		const result = await Module.apiCall(endpoint, apiparam)
		result.forEach(item => {
			const option = document.createElement('option');
			option.value = item.struct_id;       // Nilai yang dikirim saat form di-submit
			option.textContent = item.struct_name; // Teks yang muncul di layar
			structselect.appendChild(option);
		});
	} catch (err) {
		console.error(err)
	}
}


export async function populateSite(siteselect, endpoint, apiparam) {
	try {
		const result = await Module.apiCall(endpoint, apiparam)
		result.forEach(item => {
			const option = document.createElement('option');
			option.value = item.site_id;       // Nilai yang dikirim saat form di-submit
			option.textContent = item.site_name; // Teks yang muncul di layar
			siteselect.appendChild(option);
		});
	} catch (err) {
		console.error(err)
	}
}


export function setupSelectors(selectors) {
	const { unitselect, structselect, siteselect, projectselect, projectlist } = selectors

	unitselect.hide = (hidden) => { hideSelector(unitselect, hidden) }
	structselect.hide = (hidden) => { hideSelector(structselect, hidden) }
	siteselect.hide = (hidden) => { hideSelector(siteselect, hidden) }
	projectselect.hide = (hidden) => { hideSelector(projectselect, hidden) }

	projectselect.addEventListener('input', function () {
		const query = this.value.trim();

		// Hapus timer sebelumnya agar server tidak terbebani setiap kali tombol ditekan
		clearTimeout(searchproject_timeout);

		// Jika ketikan kurang dari 1 karakter, kosongkan pilihan
		if (query.length < 1) {
			projectlist.innerHTML = '';
			return;
		}

		// Beri jeda 300ms sebelum mengirim request ke server (Throttling / Debouncing)
		searchproject_timeout = setTimeout(() => {
			fetchProjects(query, projectlist);
		}, 300);
	});



	Selectors = selectors
	return selectors
}


async function fetchProjects(searchText, projectlist) {
	try {
		// Panggil endpoint 
		const result = await Module.apiCall(searchproject_endpoint, { searchText })

		// Bersihkan opsi lama di datalist
		projectlist.innerHTML = '';

		// Masukkan data baru hasil pencarian ke datalist
		result.forEach(item => {
			const option = document.createElement('option');
			// 'value' akan muncul saat di-select, kita tampilkan Nama (dan ID jika perlu)
			option.value = item.project_name;
			option.setAttribute('data-id', item.project_id);

			projectlist.appendChild(option);
		});
	} catch (error) {
		console.error('Gagal mengambil data project:', error);
	}
}

export function getSelectors() {
	return Selectors
}

function hideSelector(selector, hidden = true) {
	if (hidden) {
		selector.setAttribute('disabled', '')
		selector.classList.add('hidden')
	} else {
		selector.removeAttribute('disabled')
		selector.classList.remove('hidden')
	}
}



export function setSelectorByScope(scope, selectors) {
	const { unitselect, structselect, siteselect, projectselect } = selectors

	if (scope == 'unitsite') {
		unitselect.hide(false)
		structselect.hide()
		siteselect.hide(false)
		projectselect.hide()

	} else if (scope == 'unitstruct') {
		unitselect.hide(false)
		structselect.hide(false)
		siteselect.hide()
		projectselect.hide()

	} else if (scope == 'unitproject') {
		unitselect.hide(false)
		structselect.hide()
		siteselect.hide()
		projectselect.hide(false)


	} else if (scope == 'site') {
		unitselect.hide()
		structselect.hide()
		siteselect.hide(false)
		projectselect.hide()

	} else if (scope == 'unit') {
		unitselect.hide(false)
		structselect.hide()
		siteselect.hide()
		projectselect.hide()

	} else if (scope == 'struct') {
		unitselect.hide()
		structselect.hide(false)
		siteselect.hide()
		projectselect.hide()

	} else if (scope == 'project') {
		unitselect.hide()
		structselect.hide()
		siteselect.hide()
		projectselect.hide(false)

	} else {
		unitselect.hide()
		structselect.hide()
		siteselect.hide()
		projectselect.hide()
	}
}

export function getSubtitle(param) {
	const scope = param.scope
	const project_id = param.project_id
	const { unitselect, structselect, siteselect, projectselect } = Selectors

	const unit_name = unitselect.options[unitselect.selectedIndex].text
	const struct_name = structselect.options[structselect.selectedIndex].text
	const site_name = siteselect.options[siteselect.selectedIndex].text
	const project_name = projectselect.value.trim()


	if (scope == 'unitsite') {
		if (unitselect.value == '0') { throw new Error('Unit belum dipilih') }
		if (siteselect.value == '0') { throw new Error('Site belum dipilih') }
		return `${unit_name}, ${site_name}`

	} else if (scope == 'unitstruct') {
		if (unitselect.value == '0') { throw new Error('Unit belum dipilih') }
		if (structselect.value == '0') { throw new Error('Structure belum dipilih') }
		return `${unit_name}, ${struct_name}`

	} else if (scope == 'unitproject') {
		if (unitselect.value == '0') { throw new Error('Unit belum dipilih') }
		if (project_name == '') { throw new Error('Project belum dipilih') }
		if (project_id == '') { throw new Error('project invalid') }
		return `${unit_name}, ${project_name}`

	} else if (scope == 'site') {
		if (siteselect.value == '0') { throw new Error('Site belum dipilih') }
		return site_name

	} else if (scope == 'unit') {
		if (unitselect.value == '0') { throw new Error('Unit belum dipilih') }
		return unit_name

	} else if (scope == 'struct') {
		if (structselect.value == '0') { throw new Error('Structure belum dipilih') }
		return struct_name

	} else if (scope == 'project') {
		if (project_name == '') { throw new Error('Project belum dipilih') }
		return project_name

	} else {
		return "Consolidated"
	}
}


export function getProjectId(projectselect, projectlist) {
	const projectname = projectselect.value

	// cari id dari projectname di projectlist
}