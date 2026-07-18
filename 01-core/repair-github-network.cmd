@echo off
setlocal

echo Requesting Windows administrator permission for the network repair...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0repair-github-network.ps1"
set "repairExitCode=%errorlevel%"

echo.
if "%repairExitCode%"=="0" (
  echo Repair complete. Restart Windows now before trying GitHub upload again.
) else (
  echo Repair did not complete. Keep this window open and take a screenshot.
)
pause
exit /b %repairExitCode%
