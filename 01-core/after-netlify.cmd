@echo off
setlocal
cd /d "%~dp0"
title Today No Milktea - After Netlify Deploy

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
echo Step 1/4: Verifying the public API...
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
echo Step 2/4: Updating the WeChat mini program API_BASE_URL template...
echo.
npm run wechat:set-api-url -- "%PUBLIC_URL%"
if errorlevel 1 (
  echo.
  echo The public API passed, but the WeChat template URL update failed.
  echo You can run set-wechat-api-url.cmd later with the same Netlify URL.
  echo.
  pause
  exit /b 1
)

echo.
echo Step 3/4: Checking the WeChat mini program API template...
echo.
npm run verify:wechat-template
if errorlevel 1 (
  echo.
  echo The public API passed and the URL was updated, but the WeChat template check failed.
  echo Fix templates\wechat-miniprogram\config\api.js or services\aiEstimate.js, then run this file again.
  echo.
  pause
  exit /b 1
)

echo.
npm run smoke:wechat-template
if errorlevel 1 (
  echo.
  echo The public API passed and the URL was updated, but the WeChat template smoke test failed.
  echo Check services\aiEstimate.js and config\api.js, then run this file again.
  echo.
  pause
  exit /b 1
)

echo.
echo Step 4/4: Saving local launch verification state...
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
echo Done.
echo Local status saved to .launch-state.json. This file is ignored by Git.
echo WeChat template API_BASE_URL was updated and the template checks passed.
echo Next: add the same Netlify root domain to WeChat request legal domain.
echo Do not add /api/estimate-drink in the WeChat public platform domain field.
echo.
echo Press any key to close this window.
pause >nul
