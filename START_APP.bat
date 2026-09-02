@echo off
REM Start Backend and Frontend Servers
REM Make sure you run this from: C:\Users\itisha\source\repos\WebApplication3\

echo.
echo ========================================
echo ThesisMate - Quick Start Script
echo ========================================
echo.

REM Check if backend is already running
echo [Step 1] Checking for running backend processes...
tasklist /FI "IMAGENAME eq dotnet.exe" | find /I "dotnet.exe" >nul
if %ERRORLEVEL%==0 (
	echo ✓ Backend appears to be running
) else (
	echo ✗ Backend is NOT running
	echo.
	echo To start the backend:
	echo 1. Open Visual Studio 2026
	echo 2. Open: C:\Users\itisha\source\repos\WebApplication3\WebApplication3.slnx
	echo 3. Right-click AIRESEARCHASSISTANT project
	echo 4. Click "Set as Startup Project"
	echo 5. Press F5 to run
	echo.
	echo Wait for message: "Now listening on: http://localhost:5262"
	echo Then come back here and proceed.
	pause
)

echo.
echo [Step 2] Starting Frontend...
echo.

cd clientapp
if exist "node_modules" (
	echo ✓ Dependencies already installed
) else (
	echo Installing npm dependencies...
	call npm install
)

echo.
echo Starting frontend on http://localhost:3000...
echo.
call npm start

pause
