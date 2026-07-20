@echo off
setlocal
cd /d "%~dp0"
title Today No Milktea - Verify Public API

where npm >nul 2>nul
if errorlevel 1 (
  echo Cannot find npm. Please install Node.js first.
  echo.
  pause
  exit /b 1
)

echo Paste your Netlify public site URL below.
echo Example: https://your-site.netlify.app
echo You can also paste the full API URL ending with /api/estimate-drink.
echo.
set /p PUBLIC_URL=Netlify URL: 

if "%PUBLIC_URL%"=="" (
  echo No URL entered.
  echo.
  pause
  exit /b 1
)

echo.
echo Verifying public API...
echo.
npm run verify:public-api -- "%PUBLIC_URL%"
if errorlevel 1 (
  echo.
  echo Public API verification failed.
  echo Fix the Netlify deploy or environment variables first, then run this file again.
  echo.
  pause
  exit /b 1
)

echo.
echo Saving local launch verification state...
echo.
npm run launch:mark-public-api -- "%PUBLIC_URL%"
if errorlevel 1 (
  echo.
  echo The public API passed, but saving .launch-state.json failed.
  echo You can still continue, but check-status.cmd may not remember the public URL.
  echo.
  pause
  exit /b 1
)

echo.
echo Done. Local status saved to .launch-state.json.
echo Press any key to close this window.
pause >nul
