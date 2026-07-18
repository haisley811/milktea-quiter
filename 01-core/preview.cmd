@echo off
setlocal
cd /d "%~dp0"
start "Milk Tea Preview" powershell.exe -NoExit -ExecutionPolicy Bypass -File "%~dp0preview.ps1"
exit /b 0
