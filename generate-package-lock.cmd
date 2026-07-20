@echo off
setlocal
cd /d "%~dp0"
title Today No Milktea - Generate package-lock

where npm >nul 2>nul
if errorlevel 1 (
  echo Cannot find npm. Please install Node.js first.
  echo.
  pause
  exit /b 1
)

echo This will try to generate package-lock.json without installing node_modules.
echo It uses npm install --package-lock-only --ignore-scripts.
echo.
echo If this still times out, you can continue with GitHub and Netlify.
echo Netlify can install dependencies in the cloud during deployment.
echo.
pause

echo.
echo Generating package-lock.json...
echo.
npm install --package-lock-only --ignore-scripts --cache .npm-cache
if errorlevel 1 (
  echo.
  echo package-lock.json generation failed or timed out.
  echo You can still continue with GitHub and Netlify.
  echo See docs\dependency-install-fallback.md for details.
  echo.
  pause
  exit /b 1
)

if not exist "package-lock.json" (
  echo.
  echo npm finished, but package-lock.json was not created.
  echo See docs\dependency-install-fallback.md for details.
  echo.
  pause
  exit /b 1
)

echo.
echo package-lock.json was created.
echo You may commit package-lock.json. Do not commit node_modules.
echo.
echo Press any key to close this window.
pause >nul
