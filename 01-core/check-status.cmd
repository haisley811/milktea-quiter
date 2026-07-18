@echo off
setlocal
cd /d "%~dp0"
title Today No Milktea - Goal Status

where npm >nul 2>nul
if errorlevel 1 (
  echo Cannot find npm. Please install Node.js first, or open docs\start-here-after-sleep.md manually.
  echo.
  pause
  exit /b 1
)

echo Checking current project status...
echo.
npm run check:goal-status
echo.
echo Press any key to close this window.
pause >nul
