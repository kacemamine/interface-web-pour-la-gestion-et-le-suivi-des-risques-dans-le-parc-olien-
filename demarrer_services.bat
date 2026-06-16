@echo off
setlocal enabledelayedexpansion

echo Demarrage des services Checklist...
echo.

REM Tuer les processus existants sur les ports 3000 et 8000 si necessaire
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

REM Detecter l'IP reseau active de l'application depuis la route par defaut
set LOCAL_IP=localhost
for /f "tokens=4" %%a in ('route print 0.0.0.0 ^| findstr /R "^[ ]*0.0.0.0"') do (
    set LOCAL_IP=%%a
    goto ip_detected
)
:ip_detected

REM Generer le QR code d'acces
echo Generation du QR code d'acces...
cd code\backend
python generate_qr.py %LOCAL_IP%
timeout /t 2

REM Demarrer le backend
echo Demarrage du backend...
start "Backend" cmd /c "uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM Attendre que le backend demarre
timeout /t 5

REM Demarrer le frontend
echo Demarrage du frontend...
cd ..\frontend
start "Frontend" cmd /c "npm start"

cls
echo.
echo ================================
echo    CHECKLIST - SERVICES ACTIFS
echo ================================
echo.
echo Frontend:
echo - Local : http://localhost:3000
echo - Reseau : http://%LOCAL_IP%:3000
echo.
echo Backend:
echo - Local : http://localhost:8000
echo - Reseau : http://%LOCAL_IP%:8000
echo.
echo ================================
echo.
echo Pour acceder depuis un autre appareil:
echo 1. Connectez-vous au meme reseau WiFi
echo 2. Utilisez l'adresse : http://%LOCAL_IP%:3000
echo.
echo Pour arreter les services:
echo - Fermez cette fenetre
echo - Ou appuyez sur Ctrl+C dans chaque fenetre
echo.
cd ..\..
pause
