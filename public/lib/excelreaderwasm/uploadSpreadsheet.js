import init, { ExcelReader } from './pkg/excelreaderwasm.js';

let wasmInitialized = false;
let wasmInitPromise = null;

/**
 * Generate unique session/upload ID
 * @returns {string}
 */
export function generateUploadId() {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}
	return 'up_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Ensures the WebAssembly module is initialized.
 * @param {string | URL | Request | BufferSource | WebAssembly.Module | { module_or_path?: any }} [wasmSource]
 * @returns {Promise<void>}
 */
export async function initWasm(wasmSource) {
	if (wasmInitialized) return;
	if (!wasmInitPromise) {
		wasmInitPromise = (async () => {
			try {
				if (wasmSource) {
					if (wasmSource && typeof wasmSource === 'object' && 'module_or_path' in wasmSource) {
						await init(wasmSource);
					} else {
						await init({ module_or_path: wasmSource });
					}
				} else {
					const wasmUrl = new URL('./pkg/excelreaderwasm_bg.wasm', import.meta.url);
					await init({ module_or_path: wasmUrl });
				}
				wasmInitialized = true;
			} catch (err) {
				wasmInitPromise = null;
				throw err;
			}
		})();
	}
	return wasmInitPromise;
}

/**
 * Converts various file types (File, Blob, ArrayBuffer, Uint8Array) into Uint8Array.
 * @param {File | Blob | ArrayBuffer | Uint8Array} fileInput
 * @returns {Promise<Uint8Array>}
 */
async function toUint8Array(fileInput) {
	if (fileInput instanceof Uint8Array) {
		return fileInput;
	}
	if (fileInput instanceof ArrayBuffer) {
		return new Uint8Array(fileInput);
	}
	if (typeof Blob !== 'undefined' && fileInput instanceof Blob) {
		const buffer = await fileInput.arrayBuffer();
		return new Uint8Array(buffer);
	}
	if (fileInput && typeof fileInput === 'object' && fileInput.buffer instanceof ArrayBuffer) {
		return new Uint8Array(fileInput.buffer);
	}
	throw new TypeError('File harus berupa File, Blob, ArrayBuffer, atau Uint8Array.');
}

/**
 * Formats validHeader input into string.
 * @param {string | string[]} validHeader
 * @returns {string}
 */
function normalizeValidHeader(validHeader) {
	if (!validHeader) return '';
	if (Array.isArray(validHeader)) {
		return JSON.stringify(validHeader);
	}
	return String(validHeader);
}

/**
 * Formats mappingHeader input into string.
 * @param {Record<string, string> | string} mappingHeader
 * @returns {string}
 */
function normalizeMappingHeader(mappingHeader) {
	if (!mappingHeader) return '';
	if (typeof mappingHeader === 'object') {
		return JSON.stringify(mappingHeader);
	}
	return String(mappingHeader);
}


/**
 * Upload & parse spreadsheet with WebAssembly and complete verification support.
 *
 * @param {File | Blob | ArrayBuffer | Uint8Array | object} fileOrOptions
 * @param {string | string[]} [validHeader] - Header validation string (e.g. "No|Nama|Alamat|Kota")
 * @param {Record<string, string> | string} [mappingHeader] - Field mapping (e.g. { no: "No", alamat: "Alamat" })
 * @param {number} [rowChunk=1000] - Rows per chunk (e.g. 10)
 * @param {object} [options] - Additional options
 * @param {(chunk: any[], meta: ChunkMeta) => Promise<void> | void} [options.onUploading] - Callback called per chunk
 * @param {(summary: ProcessSummary) => Promise<any> | any} [options.onCompleted] - Callback called when all chunks finish
 * @param {(manifest: ProcessSummary) => Promise<any>} [options.verifyServer] - Server verification function
 * @param {(meta: ChunkMeta) => void} [options.onProgress] - Callback called per progress update
 * @param {string} [options.uploadId] - Custom upload/session ID
 * @param {number} [options.sheetIndex=0] - Worksheet index (0-based)
 * @param {string | URL} [options.wasmUrl] - Custom WebAssembly module path
 * @returns {Promise<UploadResult>}
 */
export async function uploadSpreadsheet(fileOrOptions, validHeader, mappingHeader, rowChunk, options = {}) {
	let file;
	let vHeader;
	let mHeader;
	let rChunk;
	let opts = {};

	if (
		fileOrOptions &&
		typeof fileOrOptions === 'object' &&
		!(fileOrOptions instanceof Uint8Array) &&
		!(typeof Blob !== 'undefined' && fileOrOptions instanceof Blob) &&
		!(fileOrOptions instanceof ArrayBuffer) &&
		'file' in fileOrOptions
	) {
		file = fileOrOptions.file;
		vHeader = fileOrOptions.validHeader;
		mHeader = fileOrOptions.mappingHeader;
		rChunk = fileOrOptions.rowChunk;
		opts = fileOrOptions;
	} else {
		file = fileOrOptions;
		vHeader = validHeader;
		mHeader = mappingHeader;
		rChunk = rowChunk;
		opts = options || {};
	}

	const chunkNum = Number(rChunk) || 1000;
	const vHeaderStr = normalizeValidHeader(vHeader);
	const mHeaderStr = normalizeMappingHeader(mHeader);
	const sheetIndex = typeof opts.sheetIndex === 'number' ? opts.sheetIndex : 0;
	const onInit = opts.onInit || null;
	const onUploading = opts.onUploading || (typeof opts.onChunk === 'function' ? opts.onChunk : null);
	const onCompleted = opts.onCompleted || null;
	const verifyServer = opts.verifyServer || null;
	const onProgress = opts.onProgress || null;
	const uploadId = opts.uploadId || generateUploadId();

	// Initialize WASM
	await initWasm(opts.wasmUrl);

	// Convert file to Uint8Array
	const bytes = await toUint8Array(file);

	// Use ExcelReader
	const reader = new ExcelReader(bytes);

	try {
		const result = reader.parseSpreadsheet(vHeaderStr, mHeaderStr, chunkNum, sheetIndex, null);
		const chunks = result.chunks || [];
		const summary = result.summary;

		summary.upload_id = uploadId;
		summary.uploadId = uploadId;
		summary.totalRows = summary.total_rows;
		summary.totalChunks = summary.total_chunks;
		summary.chunkSize = summary.chunk_size;
		summary.sheetName = summary.sheet_name;
		summary.totalChecksum = summary.total_checksum;
		summary.chunkManifest = summary.chunk_manifest;

		const successfulChunks = [];


		if (typeof onInit === 'function') {
			await onInit(uploadId)
		}


		// If onUploading handler is provided, process chunks sequentially
		if (typeof onUploading === 'function') {
			for (let i = 0; i < chunks.length; i++) {
				const chunkData = chunks[i];
				const manifestItem = summary.chunk_manifest[i] || {};
				const startRow = manifestItem.start_row || (i * chunkNum + 1);
				const endRow = manifestItem.end_row || Math.min((i + 1) * chunkNum, summary.total_rows);

				const meta = {
					...opts.meta,
					uploadId,
					chunkIndex: i + 1,
					totalChunks: summary.total_chunks,
					chunkSize: chunkData.length,
					startRow,
					endRow,
					totalRows: summary.total_rows,
					isLastChunk: i + 1 === summary.total_chunks,
					progressPercent: summary.total_rows === 0 ? 100 : Number(((endRow / summary.total_rows) * 100).toFixed(2)),
					checksum: manifestItem.checksum || ''
				};

				if (typeof onProgress === 'function') {
					onProgress(meta);
				}

				// Call onUploading and await async handler
				await onUploading(chunkData, meta);
				successfulChunks.push(meta.chunkIndex);
			}
		}

		const finalSummary = {
			uploadId,
			totalRows: summary.total_rows,
			totalChunks: summary.total_chunks,
			chunkSize: summary.chunk_size,
			sheetName: summary.sheet_name,
			headers: summary.headers,
			totalChecksum: summary.total_checksum,
			chunkManifest: summary.chunk_manifest,
			uploadedChunks: successfulChunks,
			chunks: onUploading ? undefined : chunks
		};

		// Check server verification if verifyServer is provided
		if (typeof verifyServer === 'function') {
			const serverResponse = await verifyServer(finalSummary);
			const verification = {
				... {
					isComplete: true,
					message: ''
				},
				...serverResponse
			}

			if (!verification.isComplete) {
				const err = new Error(verification.message);
				throw err;
			}
		}

		// Call onCompleted hook if provided
		if (typeof onCompleted === 'function') {
			await onCompleted(finalSummary);
		}

		return finalSummary;
	} catch (err) {
		if (err instanceof Error) {
			throw err;
		}
		throw new Error(typeof err === 'object' && err !== null && err.message ? err.message : String(err));
	} finally {
		if (reader && typeof reader.free === 'function') {
			reader.free();
		}
	}
}


export default uploadSpreadsheet;