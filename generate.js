// generate program dengan parameter
// generator_id : untuk generate 1 program
// all: generate semua program

import { spawn } from 'node:child_process';
import db from '@agung_dhewe/webapps/src/db.js'

// 1. Validasi Input dari CLI
const scriptPath = './node_modules/@agung_dhewe/webapps/src/generator/trygenerate.js';
const inputParam = process.argv[2];

if (!inputParam) {
	console.error('❌ Error: Input argumen belum diisi!');
	console.log('Penggunaan: npm generate <argumen>');
	console.log('            <argumen> bisa berupa generator_id number, atau \'all\'');
	console.log('            gunakan all untuk re-generate seluruh project\n\n')
	process.exit(1);
}

console.log(`🚀 Menjalankan generator dengan input: ${inputParam}\n`);


if (inputParam == 'all') {
	const args = []

	// query database
	const sqlGen = "select generator_id from core.generator order by generator_id"
	const rowsGen = await db.any(sqlGen)
	for (let row of rowsGen) {
		const generator_id = row.generator_id
		args.push(generator_id)
	}

	for (const arg of args) {
		console.log(`\n--- Generating program id: ${arg} ---`);

		// Membungkus spawn agar bisa di-await
		await new Promise((resolve) => {
			const child = spawn('node', [scriptPath, arg], {
				stdio: 'inherit',
				shell: true
			});

			child.on('close', (code) => {
				console.log(`--- Selesai dengan kode: ${code} ---\n`);
				resolve(); // Lanjut ke iterasi loop berikutnya
			});
		});
	}
	console.log('Semua antrean selesai!');
	process.exit(0)

} else {
	const child = spawn('node', [scriptPath, inputParam], {
		stdio: 'inherit',
		shell: true // Gunakan shell: true jika Anda berjalan di Windows agar lebih stabil
	});

	// 4. Menangani ketika proses selesai
	child.on('close', (code) => {
		if (code === 0) {
			console.log('\n✅ Proses selesai dengan sukses.');
		} else {
			console.log(`\n❌ Proses berhenti dengan error code: ${code}`);
		}
	});

	child.on('error', (err) => {
		console.error(`❌ Gagal menjalankan proses: ${err.message}`);
	});
}


