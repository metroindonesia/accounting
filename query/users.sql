-- User Applikasi

-- 1. Buat user 'app'
CREATE USER app WITH PASSWORD 'password_app_anda';

-- 2. Beri hak koneksi ke database
GRANT CONNECT ON DATABASE "accounting-db" TO app;

-- 3. Beri hak akses ke ke-4 schema
GRANT USAGE ON SCHEMA core, public, log, temp TO app;

-- 4. Beri hak DML (SELECT, INSERT, UPDATE, DELETE) pada TABEL & VIEW yang SUDAH ADA
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA core, public, log, temp TO app;

-- 5. Beri hak EXECUTE untuk FUNCTION & PROCEDURE yang SUDAH ADA
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA core, public, log, temp TO app;
GRANT EXECUTE ON ALL PROCEDURES IN SCHEMA core, public, log, temp TO app;

-- 6. Beri hak DML & EXECUTE OTOMATIS untuk TABEL, VIEW, FUNCTION, & PROCEDURE BARU yang dibuat user 'admin'
ALTER DEFAULT PRIVILEGES FOR ROLE admin IN SCHEMA core, public, log, temp 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app;

ALTER DEFAULT PRIVILEGES FOR ROLE admin IN SCHEMA core, public, log, temp 
GRANT EXECUTE ON ROUTINES TO app;




-- DbMiner
-- 1. Buat user 'dbminer'
CREATE USER dbminer WITH PASSWORD 'password_dbminer_anda';

-- 2. Beri akses koneksi ke database (jika belum)
GRANT CONNECT ON DATABASE "metro-accounting-db" TO dbminer;

-- 3. Beri izin menggunakan ke-4 schema
GRANT USAGE ON SCHEMA core, public, log, temp TO dbminer;

-- 4. Beri izin SELECT untuk semua tabel yang SUDAH ADA saat ini
GRANT SELECT ON ALL TABLES IN SCHEMA core, public, log, temp TO dbminer;

-- 5. Beri izin SELECT OTOMATIS untuk tabel BARU yang dibuat oleh user 'admin'
ALTER DEFAULT PRIVILEGES FOR ROLE admin IN SCHEMA core, public, log, temp GRANT SELECT ON TABLES TO dbminer;