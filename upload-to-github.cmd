@echo off
setlocal
cd /d "%~dp0"

echo Preparing GitHub upload...
git config --global --add safe.directory "%CD%"
git remote set-url origin https://github.com/haisley811/milktea-quiter.git
git push -u origin main

if errorlevel 1 (
    echo.
    echo Upload did not finish. Keep this window open and take a screenshot of the error.
    echo If the error says getaddrinfo() thread failed to start, restart Windows first.
    echo Then run this file again. Detailed instructions: docs\github-upload-manual.md
    pause
    exit /b 1
)

echo.
echo Upload complete. You can close this window.
pause
