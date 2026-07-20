@echo off
setlocal
cd /d "%~dp0"
title Today No Milktea - Set WeChat AppID

where npm >nul 2>nul
if errorlevel 1 (
  echo Cannot find npm. Please install Node.js first.
  echo.
  pause
  exit /b 1
)

echo Paste your official WeChat mini program AppID below.
echo Example: wx1234567890abcdef
echo.
echo Use touristappid only for temporary preview. Do not use touristappid before upload review.
echo.
set /p WECHAT_APPID=WeChat AppID: 

if "%WECHAT_APPID%"=="" (
  echo No AppID entered.
  echo.
  pause
  exit /b 1
)

echo.
npm run wechat:set-appid -- "%WECHAT_APPID%"
echo.
echo Press any key to close this window.
pause >nul
