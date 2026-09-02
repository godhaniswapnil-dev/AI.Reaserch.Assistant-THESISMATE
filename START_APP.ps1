# ThesisMate - Quick Start Script (PowerShell)
# Run this from: C:\Users\itisha\source\repos\WebApplication3\

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ThesisMate - Quick Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Checking if backend is running..." -ForegroundColor Yellow
$backendRunning = Get-Process -Name "dotnet" -ErrorAction SilentlyContinue

if ($backendRunning) {
	Write-Host "✓ Backend is running on http://localhost:5262" -ForegroundColor Green
} else {
	Write-Host "✗ Backend is NOT running!" -ForegroundColor Red
	Write-Host ""
	Write-Host "To start the backend:" -ForegroundColor Yellow
	Write-Host "  1. Open Visual Studio 2026" 
	Write-Host "  2. Open: WebApplication3.slnx"
	Write-Host "  3. Right-click 'AIRESEARCHASSISTANT' → Set as Startup Project"
	Write-Host "  4. Press F5 (or click green play button)"
	Write-Host "  5. Wait for: 'Now listening on: http://localhost:5262'"
	Write-Host ""
	Write-Host "Then come back here and run this script again." -ForegroundColor Yellow
	Read-Host "Press Enter to continue"
	exit
}

Write-Host ""
Write-Host "Step 2: Starting Frontend..." -ForegroundColor Yellow
Write-Host ""

Set-Location clientapp

if (Test-Path "node_modules") {
	Write-Host "✓ Dependencies already installed" -ForegroundColor Green
} else {
	Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
	npm install
}

Write-Host ""
Write-Host "Starting frontend on http://localhost:3000..." -ForegroundColor Green
Write-Host ""

npm start

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
Read-Host "Press Enter to exit"
