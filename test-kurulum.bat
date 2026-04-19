@echo off
chcp 65001 >nul
echo ========================================
echo Defterdar Muhasebe v2.3.0 Test Scripti
echo ========================================
echo.

echo 1. Kurulum dosyasi kontrol ediliyor...
if exist "dist\DefterdarMuhasebe-Setup-2.3.0.exe" (
    echo [OK] Kurulum dosyasi mevcut
    for %%A in ("dist\DefterdarMuhasebe-Setup-2.3.0.exe") do echo    Boyut: %%~zA bytes
) else (
    echo [HATA] Kurulum dosyasi bulunamadi!
    echo    Lutfen once 'npm run build' komutunu calistirin
    pause
    exit /b 1
)

echo.
echo 2. Node.js ve npm kontrol ediliyor...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js mevcut
    node --version
) else (
    echo [HATA] Node.js bulunamadi!
)

npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] npm mevcut
    npm --version
) else (
    echo [HATA] npm bulunamadi!
)

echo.
echo 3. Electron kontrol ediliyor...
if exist "node_modules\electron" (
    echo [OK] Electron mevcut
) else (
    echo [HATA] Electron bulunamadi!
    echo    Lutfen 'npm install' komutunu calistirin
)

echo.
echo 4. Gerekli dosyalar kontrol ediliyor...
if exist "electron.js" (
    echo [OK] electron.js mevcut
) else (
    echo [HATA] electron.js bulunamadi!
)

if exist "server.js" (
    echo [OK] server.js mevcut
) else (
    echo [HATA] server.js bulunamadi!
)

if exist "package.json" (
    echo [OK] package.json mevcut
) else (
    echo [HATA] package.json bulunamadi!
)

if exist "build\icon.ico" (
    echo [OK] icon.ico mevcut
) else (
    echo [HATA] icon.ico bulunamadi!
)

echo.
echo 5. Port kontrol ediliyor...
netstat -an | findstr ":4500" >nul
if %errorlevel% equ 0 (
    echo [UYARI] Port 4500 kulanimda
    echo    Uygulamayi kapatip tekrar deneyin
) else (
    echo [OK] Port 4500 musait
)

echo.
echo ========================================
echo Test tamamlandi!
echo ========================================
echo.
echo Kurulum dosyasini test etmek icin:
echo 1. dist\DefterdarMuhasebe-Setup-2.3.0.exe dosyasini calistirin
echo 2. Kurulum sihirbazini takip edin
echo 3. DDMAdmin / ddm-4128.316.316 ile giris yapin
echo.
echo Gelistirici modu icin:
echo 1. npm start (sunucu baslatir)
echo 2. npm run electron (electron uygulamasini baslatir)
echo.
pause