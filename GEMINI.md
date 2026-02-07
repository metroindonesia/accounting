# 🤖 GEMINI Context Guide: Accounting System
Dokumen ini adalah panduan konteks bagi asisten AI (Gemini) untuk memahami aturan, standar, dan arsitektur proyek Sistem Akuntansi ini. Semua saran kode dan pengembangan fitur wajib mematuhi ketentuan di bawah ini.
---

---
## 🏗️ Project Overview & Architecture
- **Type:** Web-based Enterprise Accounting
- **Backend:** Node.js (Express.js) - Full ES6 Modules (`import/export`)
- **Database:** PostgreSQL 16 (Relational Integrity)
- **Cache/Session:** Redis (Speed & Token Blacklisting)
- **Scale:** Dirancang untuk horizontal scaling

## Standar Penulisan Kode
- **Variabel & Fungsi:** Gunakan `camelCase`.
- **Error Handling:** Wajib menggunakan blok `try { ... } catch (error) { ... }` pada setiap fungsi.
- **Data Credentials:** Untuk server side, dilarang keras menulis data sensitif di dalam kode. Gunakan `process.env` (file `.env`).
- **Dokumentasi:** Gunakan komentar JSDoc dalam **Bahasa Indonesia**.
- **Variabel:** Gunakan const untuk variabel yang tidak berubah dan let untuk variabel yang nilainya berubah; hindari penggunaan var.
## Module Structure
- lokasi source module client side ada di direktori public/modules/${modulename}/*.*
- lokasi api module ada di direktori src/apis/${modulename}.api.js
- file-file utama untuk client side pada module terdiri dari
	- ${modulename}.html, sebagai template/view
	- ${modulename}.css, sebagai style module
	- ${modulename}.mjs, sebagai script berjalan di browser, sebagai view login module (SPA)
	