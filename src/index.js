import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';
import { createWebApplication, createDefaultAppConfig } from '@agung_dhewe/webapps'
import { getApplicationSetting, requireSetting, authorizeRequest } from '@agung_dhewe/webapps/src/startup.js'
import { createRouter } from './router.js'
import db from '@agung_dhewe/webapps/src/db.js'
import bucket from '@agung_dhewe/webapps/src/bucket.js'


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webapp = createWebApplication()
const appName = process.env.APPNAME


main()


async function main() {
	const port = process.env.PORT || webapp.defaultPort;
	const startingMessage = `Starting \x1b[1m\x1b[93m${appName}\x1b[0m module on port \x1b[32m${port}\x1b[0m`

	// Baca Data Dari Konfigurasi
	const redisUrl = process.env.REDIS_URL
	const sessionName = process.env.SESSION_NAME
	const sessionSecret = process.env.SESSION_SECRET
	const sessionMaxAge = process.env.SESSION_MAXAGE
	const sessionDomain = process.env.SESSION_DOMAIN
	const sessionSecure = process.env.SESSION_SECURE
	const sessionHttpOnly = process.env.SESSION_HTTPONLY
	const notifierSocket = process.env.NOTIFIER_SOCKET
	const notifierServer = process.env.NOTIFIER_SERVER

	const disableApiCache = process.env.DISABLE_API_CACHE === 'true'

	const fgta5jsDebugMode = process.env.DEBUG_MODE_FGTA5JS === 'true'
	const fgta5jsVersion = process.env.FGTA5JS_VERSION || ''
	const appDebugMode = process.env.DEBUG_MODE_APP === 'true'

	const iconMenuUrl = process.env.ICON_MENU_URL || ''


	const router = createRouter()

	// ambil setting system
	const applicationSetting = await getApplicationSetting(db, 'core."setting"')
	await settingInit(db, applicationSetting)

	// variabel local konfigurasi yang bisa diakses dari api/router
	const appConfig = {
		...createDefaultAppConfig(),
		...applicationSetting,
		...{
			appName,
			fgta5jsDebugMode,
			fgta5jsVersion,
			appDebugMode,
			notifierSocket,
			notifierServer,

			redisUrl,

			sessionName,
			sessionSecret,
			sessionMaxAge: sessionMaxAge * 60 * 1000,
			sessionDomain,
			sessionSecure: sessionSecure.toLowerCase() === 'true' ? true : false,
			sessionHttpOnly: sessionHttpOnly.toLowerCase() === 'false' ? false : true,

			iconMenuUrl,

			defaultCurr: { id: 1, name: 'IDR' }
		}
	}


	const escapedDomain = sessionDomain.replace(/\./g, '\\.')
	const rootDir = path.join(__dirname, '..')
	webapp.setRootDirectory(rootDir)
	webapp.start({
		port,
		disableApiCache,
		startingMessage,
		redisUrl,
		appConfig,
		router,
		allowedOrigins: [
			// /^https:\/\/[a-z0-9.-]+\.transfashion\.id(:\d+)?$/,
			new RegExp(`^https?://[a-z0-9.-]*${escapedDomain}(:\\d+)?$`),
			/^http:\/\/localhost:3003(:\d+)?$/
		],
		fnParseModuleRequest: async (req) => {
			await authorizeRequest(db, req)
		}
	})
}




async function settingInit(db, setting) {
	const results = await Promise.allSettled([
		requireSetting(db, setting, 'COMPANY_CODE', 'kode perusahaan, 2 digit numerik, untuk keperluan konsolidasi bisa sistem dipakai di beberapa anak perusahaan'),
		requireSetting(db, setting, 'COMPANY_ADDR1', ''),
		requireSetting(db, setting, 'COMPANY_NAME', ''),
		requireSetting(db, setting, 'COMPANY_ADDR2', ''),
		requireSetting(db, setting, 'COMPANY_ADDR3', ''),
		requireSetting(db, setting, 'COMPANY_PHONE', ''),
		requireSetting(db, setting, 'COMPANY_PRINTLOGO', 'path url untuk logo yang dicetak di report, misalnya /public/images/logo.svg'),
		requireSetting(db, setting, 'COMPANY_PARTNER_ID', 'kode partner yang menunjuk ke diri sendiri '),
		requireSetting(db, setting, 'TAX_PARTNER_ID', 'kode partner untuk kas negara'),
		requireSetting(db, setting, 'RE_COA_ID', 'kode coa untuk retain earning'),
		requireSetting(db, setting, 'COA_LENGTH', 'panjang coa'),
	])

	const errors = results
		.filter(result => result.status === "rejected")
		.map((result, index) => `Setting ke-${index} gagal: ${result.reason}`);


	if (errors.length > 0) {
		// Gabungkan semua pesan error menjadi satu string
		throw new Error("Setting belum didefinisikan:\n" + errors.join("\n"));
	}
}


