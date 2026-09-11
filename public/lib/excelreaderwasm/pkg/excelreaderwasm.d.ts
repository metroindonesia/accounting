/* tslint:disable */
/* eslint-disable */

export class ExcelReader {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Retrieve headers for a given sheet index
     */
    getHeaders(sheet_index?: number | null): any;
    getSheetNames(): any;
    constructor(bytes: Uint8Array);
    /**
     * Process spreadsheet in chunks and either trigger callback or return all chunks.
     */
    parseSpreadsheet(valid_header: string, mapping_header: string, row_chunk: number, sheet_index?: number | null, callback?: Function | null): any;
    /**
     * Validates the sheet header against valid_header specification
     */
    validateHeaders(valid_header: string, sheet_index?: number | null): any;
}

/**
 * Standalone helper to parse spreadsheet directly from bytes
 */
export function parseSpreadsheetDirect(bytes: Uint8Array, valid_header: string, mapping_header: string, row_chunk: number, sheet_index?: number | null, callback?: Function | null): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_excelreader_free: (a: number, b: number) => void;
    readonly excelreader_getHeaders: (a: number, b: number) => [number, number, number];
    readonly excelreader_getSheetNames: (a: number) => [number, number, number];
    readonly excelreader_new: (a: number, b: number) => [number, number, number];
    readonly excelreader_parseSpreadsheet: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number, number];
    readonly excelreader_validateHeaders: (a: number, b: number, c: number, d: number) => [number, number, number];
    readonly parseSpreadsheetDirect: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => [number, number, number];
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
