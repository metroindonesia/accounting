# Excel Reader Wasm ⚡

High-performance Excel spreadsheet reader and chunk uploader powered by **Rust** and **WebAssembly (WASM)**.

📦 **Repository:** [https://github.com/agungdhewe/excelreaderwasm](https://github.com/agungdhewe/excelreaderwasm)

Membaca dan memproses spreadsheet Excel (.xlsx, .xls, .ods, .csv) dengan jutaan baris langsung di browser / client secara super cepat dan efisien tanpa membebani server backend, serta mendukung streaming chunk upload dengan event `onUploading`.

---

## 🚀 Fitur Utama

- **Blazing Fast**: Ditenagai oleh engine Rust ([calamine](https://crates.io/crates/calamine)) yang dikompilasi ke WebAssembly.
- **Header Validation (`validHeader`)**: Memvalidasi baris pertama spreadsheet dengan format string pipa (`"No|Nama|Alamat|Kota"`), koma, atau array JSON.
- **Field Mapping (`mappingHeader`)**: Mapping kolom spesifik ke field JSON (misal `{"no": "No", "alamat": "Alamat"}`). Hanya kolom yang dipetakan yang akan diekstrak.
- **Row Chunking (`rowChunk`)**: Memecah baris data menjadi batch/chunk berukuran tetap (misal per 10 baris). Jika ada 105 baris, proses looping sebanyak 11 kali.
- **Streaming & Callback (`onUploading`)**: Mendukung callback async `onUploading(chunk, meta)` dan event emitter `SpreadsheetUploader` untuk mengupload chunk per chunk secara langsung ke API backend.
- **Type Safe**: Dilengkapi dengan TypeScript definitions (`index.d.ts`).

---


## 🛠️ Penggunaan & Contoh Kode

### 1. Basic Usage (Sesuai Spesifikasi)

```javascript
import { uploadSpreadsheet } from 'excelreaderwasm';

// 1. Ambil file dari input HTML (<input type="file" id="fileInput" />)
const file = document.getElementById('fileInput').files[0];

// 2. Jalankan uploadSpreadsheet
const result = await uploadSpreadsheet(
  file,
  'No|Nama|Alamat|Kota',               // validHeader
  { no: 'No', alamat: 'Alamat' },       // mappingHeader
  10,                                  // rowChunk (10 baris per chunk)
  {
    onUploading: async (chunk, meta) => {
      console.log(`Mengupload chunk ${meta.chunkIndex}/${meta.totalChunks}`);
      console.log(`Baris ${meta.startRow} - ${meta.endRow} (Total: ${meta.totalRows} baris)`);
      console.log(`Progres: ${meta.progressPercent}%`);
      console.log('Data Chunk:', chunk);

      // Contoh: Kirim chunk ke endpoint backend Anda
      await fetch('/api/v1/import-excel-chunk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchIndex: meta.chunkIndex,
          isLast: meta.isLastChunk,
          rows: chunk
        })
      });
    }
  }
);

console.log('Selesai!', result);
```

---

### 2. Format Parameter

#### `file`
Menerima tipe data:
- `File` (dari input form / drag & drop)
- `Blob`
- `ArrayBuffer`
- `Uint8Array`

#### `validHeader`
Validasi kolom wajib pada baris pertama spreadsheet. Mendukung format:
- String pipa: `"No|Nama|Alamat|Kota"`
- String koma: `"No, Nama, Alamat, Kota"`
- Array: `["No", "Nama", "Alamat", "Kota"]`

Jika kolom pada file Excel tidak cocok / ada kolom wajib yang hilang, sistem akan melempar Error deskriptif:
```text
Validasi header gagal!
Header yang diharapkan: No | Nama | Alamat | Kota
Header yang ditemukan: No | Nama | Gaji | Kota
Kolom yang hilang: Alamat
```

#### `mappingHeader`
Menentukan field JSON output dan mencocokkannya ke kolom Excel:
- Object: `{ no: "No", alamat: "Alamat" }`
- JSON String: `'{"no":"No", "alamat":"Alamat"}'`

Output JSON per baris hanya akan memuat key yang dimapping:
```json
[
  { "no": 1, "alamat": "Jl. Sudirman No. 1" },
  { "no": 2, "alamat": "Jl. Thamrin No. 2" }
]
```

#### `rowChunk`
Jumlah baris per chunk (misal `10`).
- Total baris = **105** & `rowChunk = 10` ➔ **11 Chunk** (Chunk 1-10 berisi 10 baris, Chunk 11 berisi 5 baris).

---

### 3. Struktur `meta` pada `onUploading`

```typescript
interface ChunkMeta {
  chunkIndex: number;       // Indeks chunk saat ini (1, 2, ..., 11)
  totalChunks: number;      // Total jumlah chunk (11)
  chunkSize: number;        // Jumlah baris dalam chunk ini (misal: 10 atau 5)
  startRow: number;         // Nomor baris awal (1-indexed)
  endRow: number;           // Nomor baris akhir (1-indexed)
  totalRows: number;        // Total seluruh baris data (105)
  isLastChunk: boolean;     // True jika ini chunk terakhir
  progressPercent: number;  // Progres dalam persen (misal: 9.52, 100.0)
}
```

---

### 4. Menggunakan Event Emitter (`SpreadsheetUploader`)

Jika Anda lebih menyukai arsitektur berbasis Event:

```javascript
import { SpreadsheetUploader } from 'excelreaderwasm';

const uploader = new SpreadsheetUploader();

uploader
  .on('uploading', async (chunk, meta) => {
    console.log(`[Event uploading] Chunk ${meta.chunkIndex}/${meta.totalChunks}`);
    await sendToBackend(chunk);
  })
  .on('progress', (meta) => {
    updateProgressBar(meta.progressPercent);
  })
  .on('complete', (summary) => {
    console.log('Semua chunk berhasil diupload:', summary);
  })
  .on('error', (err) => {
    console.error('Terjadi kesalahan:', err);
  });

await uploader.process(file, 'No|Nama|Alamat|Kota', { no: 'No', alamat: 'Alamat' }, 10);
```


