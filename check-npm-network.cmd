@echo off
setlocal
cd /d "%~dp0"
title Check npm network

echo ===============================================
echo Check npm network and registry
echo ===============================================
echo.
echo This only checks npm connectivity. It does not install dependencies.
echo.
echo Current npm registry:
npm config get registry
echo.

echo Pinging your current npm registry...
npm ping
if errorlevel 1 (
  echo.
  echo Current registry ping failed.
) else (
  echo.
  echo Current registry ping passed.
)

echo.
echo Pinging official npm registry...
npm ping --registry=https://registry.npmjs.org/
if errorlevel 1 (
  echo.
  echo Official registry ping failed too. This machine likely has a network or proxy problem.
  echo Try another network, proxy/VPN settings, or let Netlify install dependencies in the cloud.
) else (
  echo.
  echo Official registry ping passed. You can try generate-package-lock.cmd or install-local-deps.cmd again.
)

echo.
pause
