

# pembuatan PA
- PA created
- PA approve -> masukkan kode pa ke paymreq_outstanding
- PA reject
	* cek dulu apakah PA sudah direfensi oleh jurnal -> jika sudah direferensi tidak bisa direject
	* setelah berhasil reject, hapus dari paymreq_outstanding

# pembuatan AP-Bill (AP)
- tarik data dari PA (ambil dari pamreq_outstanding join ke jurnal, yang belum ada referensi ke paymreq)
- AP saving
	* masukkan/update data pada paymreq_bill, dengan semua data jurnaldetil, jurnaltype, dan paymreq_id sebagai PK, innit nilai outstanding sesuai value jurnal


# pembuatan AP-Payment (PV)
- tarik data dari PA, ambil dari paymreq_bill join ke jurnal, dengan kondisi jurnalnya sudah diposting
- simpan PV (paid_aount) dari PA, ke tabel paymreq_paid, jumlahkan kembali total paid versus nilai AP, simpan kembali nilai outstanding ke paymreq_bill
- saat PV di posting, hapus data dari paymreq_bill, paymreq_paid, dan paymreq_outstanding, archive datanya ke paymreq_arch
- saat PV di unposting, kembalikan data dari paymreq_arch ke paymreq_bill, paymreq_paid, dan paymreq_outstanding



# pembuatan Advance Payment (PV)
- tarik data dari PA (ambil dari pamreq_outstanding join ke jurnal, yang belum ada referensi ke paymreq)
- PV saving
	* masukkan/update data pada paymreq_bill, dengan semua data jurnaldetil, jurnaltype, dan paymreq_id sebagai PK, innit nilai outstanding sesuai value jurnal
	* simpan PV (paid_aount) dari PA, ke tabel paymreq_paid, jumlahkan kembali total paid versus nilai AP, simpan kembali nilai outstanding ke paymreq_bill
- saat PV di posting, hapus data dari paymreq_bill, paymreq_paid, dan paymreq_outstanding, archive datanya ke paymreq_arch
- saat PV di unposting, kembalikan data dari paymreq_arch ke paymreq_bill, paymreq_paid, dan paymreq_outstanding



