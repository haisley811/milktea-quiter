@echo off
setlocal
cd /d "%~dp0"
title Today No Milktea - Check WeChat Template

where npm >nul 2>nul
if errorlevel 1 (
  echo Cannot find npm. Please install Node.js first.
  echo.
  pause
  exit /b 1
)

echo Checking WeChat mini program API template...
echo.
echo This checks:
echo - API_BASE_URL starts with https://
echo - API_BASE_URL does not include /api/estimate-drink
echo - The mini program calls your Netlify backend only
echo - QWEN_API_KEY is not in mini program code
echo - The raw QWEN API domain is not in mini program code
echo.
npm run verify:wechat-template
if errorlevel 1 (
  echo.
  echo WeChat template check failed.
  echo Fix templates\wechat-miniprogram\config\api.js or rerun after-netlify.cmd.
  echo.
  pause
  exit /b 1
)

echo.
echo Running WeChat mini program API smoke test...
echo.
npm run smoke:wechat-template
if errorlevel 1 (
  echo.
  echo WeChat template smoke test failed.
  echo Check services\aiEstimate.js and config\api.js.
  echo.
  pause
  exit /b 1
)

echo.
echo WeChat template check passed.
echo Next: configure WeChat public platform request legal domain, then test on a real phone.
echo.
echo Press any key to close this window.
pause >nul
