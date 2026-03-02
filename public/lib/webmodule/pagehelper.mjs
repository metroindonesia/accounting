
export async function openSection(self, sectionName, params, fnOpened) {
	const context = params.Context
	const Crsl = context.Crsl
	const section = Crsl.Items[sectionName]
	section.setSectionReturn(params.sectionReturn)
	section.show({}, fnOpened)
}


export function renderLog(tbody, data) {
	tbody.innerHTML = ''

	for (var row of data) {
		const tr = document.createElement('tr')

		const tdTime = document.createElement('td')
		tdTime.innerHTML = row.log_time
		tdTime.classList.add('logcell')

		const tdUser = document.createElement('td')
		tdUser.innerHTML = row.log_user_name
		tdUser.classList.add('logcell')

		const tdAction = document.createElement('td')
		tdAction.innerHTML = row.log_action
		tdAction.classList.add('logcell')

		const tdIP = document.createElement('td')
		tdIP.innerHTML = row.log_ipaddress
		tdIP.classList.add('logcell')

		const tdRemark = document.createElement('td')
		tdRemark.innerHTML = row.log_remark
		tdRemark.classList.add('logcell')


		tr.appendChild(tdTime)
		tr.appendChild(tdUser)
		tr.appendChild(tdAction)
		tr.appendChild(tdIP)
		tr.appendChild(tdRemark)
		tbody.appendChild(tr)
	}
}


export async function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve()
		}, ms)
	})
}


export function setCssRule(selector, properties) {
	let found = false;

	for (const sheet of document.styleSheets) {
		for (let i = 0; i < sheet.cssRules.length; i++) {
			const rule = sheet.cssRules[i];

			if (rule.selectorText === selector) {
				for (const [prop, val] of Object.entries(properties)) {
					rule.style[prop] = val;
				}
				found = true;
			}
		}
	}

	// jika rule belum ada, tambahkan
	if (!found) {
		const firstSheet = document.styleSheets[0];
		const props = Object.entries(properties)
			.map(([p, v]) => `${p}: ${v}`)
			.join('; ');
		firstSheet.insertRule(`${selector} { ${props} }`, firstSheet.cssRules.length);
	}
}


export function formatDecimal(num, prec) {
	return new Intl.NumberFormat("en-EN", {
		minimumFractionDigits: prec,
		maximumFractionDigits: prec
	}).format(num);
}

export function formatISODate(isoString, format) {
	const date = new Date(isoString);

	// Mengambil komponen waktu dalam UTC
	const day = String(date.getUTCDate()).padStart(2, '0');
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const year = String(date.getUTCFullYear());

	// Mapping pola format ke nilai asli
	const map = {
		'dd': day,
		'mm': month,
		'yyyy': year,
		'yy': year.slice(-2) // Mengambil 2 angka terakhir tahun
	};

	// Mengganti pola dalam string format berdasarkan map di atas
	return format.replace(/dd|mm|yyyy|yy/gi, matched => map[matched.toLowerCase()]);
}

export function formatNumber(num, decimalPrecision = 0) {
	return new Intl.NumberFormat("en-EN", {
		minimumFractionDigits: decimalPrecision,
		maximumFractionDigits: decimalPrecision
	}).format(num);
}

export function setVisibility(el_name, visible) {
	const el = document.getElementById(el_name)
	if (el == null) {
		return
	}

	if (visible == true) {
		el.classList.remove('hidden')
	} else {
		el.classList.add('hidden')
	}
}