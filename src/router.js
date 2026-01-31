import express from 'express';
import context from '@agung_dhewe/webapps/src/context.js';
import { moduleApi } from '@agung_dhewe/webapps/src/routers/moduleApi.js';
import Api from '@agung_dhewe/webapps/src/api.js'
import * as helper from '@agung_dhewe/webapps/src/helper.js'
import * as path from 'path'
import { handleError } from '@agung_dhewe/webapps/src/routers/handleError.js';


export function createRouter() {
	const router = express.Router()
	router.get('/', containerPage)
	router.get('/login', loginPage)
	router.get('/login/:requestedAsset', loginAsset)
	router.post('/login/:method', (req, res, next) => {
		req.params.modulename = 'login'
		moduleApi(req, res, next)
	})

	return router
}



async function containerPage(req, res) {
	try {

		// cek login terlebih dahulu
		try {
			Api.cekLogin(req)
		} catch (err) {
			// belum login, redirect to login
			const variables = {}
			const tplFilePath = path.join(context.getRootDirectory(), 'templates', 'redirecttologin.page.ejs')
			const content = await helper.parseTemplate(tplFilePath, variables)
			res.status(200).send(content)
			return;
		}



		const rootPath = context.getRootDirectory()
		const variables = {
			...helper.createDefaultEjsVariable(req),
			...{
				rootPath
			}
		}

		const tplFilePath = path.join(context.getRootDirectory(), 'templates', 'container.page.ejs')
		const content = await helper.parseTemplate(tplFilePath, variables)
		res.status(200).send(content)
	} catch (err) {
		handleError(err, req, res)
	}
}


async function loginPage(req, res) {
	const rootPath = context.getRootDirectory()

	try {


		const loginPagePath = path.join(rootPath, 'public', 'modules', 'login', 'login.html')
		const variables = {
			...helper.createDefaultEjsVariable(req),
			...{
				rootPath,
				loginPagePath
			}
		}

		const tplFilePath = path.join(context.getRootDirectory(), 'templates', 'login.page.ejs')
		const content = await helper.parseTemplate(tplFilePath, variables)
		res.status(200).send(content)
	} catch (err) {
		handleError(err, req, res)
	}
}


async function loginAsset(req, res) {
	const rootPath = context.getRootDirectory()
	const requestedFile = req.params.requestedAsset;
	const filePath = path.join(rootPath, 'public', 'modules', 'login', requestedFile)

	const assetExists = await helper.isFileExists(filePath)
	if (assetExists) {
		res.sendFile(filePath)
	} else {
		res.status(404).send(`'${requestedFile}' is not found`)
	}
}