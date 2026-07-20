@echo off
setlocal
cd /d "%~dp0"
title Today No Milktea - Install Local Dependencies

where npm >nul 2>nul
if errorlevel 1 (
  echo Cannot find npm. Please install Node.js first.
  echo.
  pause
  exit /b 1
)

echo This will run npm install, then npm run verify, then npm run build.
echo It may take several minutes depending on your network.
echo.
echo If npm install times out, you can still continue with GitHub and Netlify.
echo Netlify can install dependencies in the cloud during deployment.
echo.
pause

echo.
echo Step 1/3: Installing dependencies...
echo.
npm install --cache .npm-cache
if errorlevel 1 (
  echo.
  echo npm install failed or timed out.
  echo You can continue deployment through GitHub and Netlify, then check the Netlify deploy log.
  echo See docs\dependency-install-fallback.md for details.
  echo.
  pause
  exit /b 1
)

echo.
echo Step 2/3: Running project verification...
echo.
npm run verify
if errorlevel 1 (
  echo.
  echo Verification failed after dependency install.
  echo.
  pause
  exit /b 1
)

echo.
echo Step 3/3: Running production build...
echo.
npm run build
if errorlevel 1 (
  echo.
  echo Build failed after dependency install.
  echo.
  pause
  exit /b 1
)

echo.
echo Done. Local dependencies, verification, and build succeeded.
echo package-lock.json can be committed. node_modules must not be committed.
echo.
echo Press any key to close this window.
pause >nul
