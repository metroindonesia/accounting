@echo off
setlocal enabledelayedexpansion

:: 1. Baca PORT dari .env
set "PORT="
if exist .env (
    for /f "tokens=2 delims==" %%A in ('findstr /i "^PORT=" .env') do (
        set "PORT=%%A"
    )
)

:: Hapus spasi dan tanda kutip jika ada
if defined PORT (
    set "PORT=!PORT: =!"
    set "PORT=!PORT:"=!"
)

if not defined PORT (
    echo Error: Port tidak didefinisikan di dalam file .env!
    set "EXIT_CODE=1"
    goto finish
)


:: 2. Cek apakah port sedang digunakan, jika ya kill process-nya
echo Memeriksa port %PORT%...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%PORT% ^| findstr LISTENING') do (
    echo Port %PORT% terpakai oleh PID %%a. Menghentikan proses...
    taskkill /f /pid %%a 2>nul
)


:: 3. Jalankan server
echo Menjalankan server...
npm run server
set "EXIT_CODE=%ERRORLEVEL%"

:finish
echo.
:: Cek apakah command prompt dijalankan dengan parameter /c (yang otomatis menutup window setelah selesai)
echo %CMDCMDLINE% | findstr /i /c:"/c" >nul
if %ERRORLEVEL% == 0 (
    cmd /k
)
endlocal & exit /b %EXIT_CODE%

