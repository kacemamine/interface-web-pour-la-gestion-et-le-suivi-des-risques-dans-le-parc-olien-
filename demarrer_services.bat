@echo off
echo Démarrage des services Checklist...
echo.

REM Tuer les processus existants sur les ports 3000 et 8000 si nécessaire
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

REM Utiliser l'IP fixe de l'application
set LOCAL_IP=10.162.253.213

REM Générer le QR code d'accès
echo Génération du QR code d'accès...
cd code\backend
python generate_qr.py %LOCAL_IP%
timeout /t 2

REM Démarrer le backend
echo Démarrage du backend...
start "Backend" cmd /c "uvicorn app.main:app --reload --host 0.0.0.0"

REM Attendre que le backend démarre
timeout /t 5

REM Démarrer le frontend
echo Démarrage du frontend...
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
echo - Réseau : http://%LOCAL_IP%:3000
echo.
echo Backend:
echo - Local : http://localhost:8000
echo - Réseau : http://%LOCAL_IP%:8000
echo.
echo ================================
echo.
echo Pour accéder depuis un autre appareil:
echo 1. Connectez-vous au même réseau WiFi
echo 2. Utilisez l'adresse : http://%LOCAL_IP%:3000
echo.
echo Pour arrêter les services:
echo - Fermez cette fenêtre
echo - Ou appuyez sur Ctrl+C dans chaque fenêtre
echo.
cd ..\..
pause
