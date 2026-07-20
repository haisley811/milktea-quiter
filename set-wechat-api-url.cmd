@echo off
setlocal
cd /d "%~dp0"
title Today No Milktea - Set WeChat API URL

where npm >nul 2>nul
if errorlevel 1 (
  echo Cannot find npm. Please install Node.js first.
  echo.
  pause
  exit /b 1
)

echo Paste your Netlify public site URL below.
echo Example: https://today-no-milktea.netlify.app
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
npm run wechat:set-api-url -- "%PUBLIC_URL%"
echo.
echo Press any key to close this window.
pause >nul
