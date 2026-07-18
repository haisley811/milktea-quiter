@echo off
setlocal
cd /d "%~dp0"
title Record WeChat verification

echo ===============================================
echo Record WeChat request domain verification
echo ===============================================
echo.
echo Only continue after BOTH are true:
echo   1. WeChat public platform saved the request legal domain.
echo   2. A real phone preview successfully requested the backend API.
echo.
echo Paste the backend ROOT URL that WeChat accepted.
echo Example: https://your-site.netlify.app
echo Do not paste QWEN_API_KEY.
echo Do not paste the QWEN raw API domain.
echo.
set /p WECHAT_URL=WeChat backend root URL: 
if "%WECHAT_URL%"=="" (
  echo No URL entered.
  pause
  exit /b 1
)

echo.
echo Optional note example:
echo saved at 2026-07-14 21:30, tested on iPhone WeChat preview
set /p WECHAT_NOTE=Evidence note: 

npm run launch:mark-wechat-domain -- "%WECHAT_URL%" --note "%WECHAT_NOTE%"
if errorlevel 1 (
  echo.
  echo Recording failed. Check the URL and try again.
  pause
  exit /b 1
)

echo.
echo WeChat verification was recorded in .launch-state.json.
echo Running current goal status...
echo.
npm run check:goal-status
echo.
pause
