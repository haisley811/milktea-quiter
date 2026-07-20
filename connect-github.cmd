@echo off
setlocal
cd /d "%~dp0"
title Today No Milktea - Connect GitHub

where npm >nul 2>nul
if errorlevel 1 (
  echo Cannot find npm. Please install Node.js first.
  echo.
  pause
  exit /b 1
)

where git >nul 2>nul
if errorlevel 1 (
  echo Cannot find git. Please install Git for Windows first.
  echo.
  pause
  exit /b 1
)

echo Paste your GitHub HTTPS repository URL below.
echo Example: https://github.com/yourname/ill-quit-milktea.git
echo.
echo Create an empty GitHub repository first. Do not add README, .gitignore, or license on GitHub.
echo.
set /p GITHUB_REPO_URL=GitHub repo URL: 

if "%GITHUB_REPO_URL%"=="" (
  echo No URL entered.
  echo.
  pause
  exit /b 1
)

echo.
npm run github:connect -- "%GITHUB_REPO_URL%"
if errorlevel 1 (
  echo.
  echo GitHub connection or push failed.
  echo Check these first:
  echo 1. The GitHub repository is empty and has no README, .gitignore, or license.
  echo 2. The URL starts with https://github.com/ and ends with .git.
  echo 3. If GitHub asks you to sign in, use browser authorization instead of typing your password.
  echo 4. If the script says there are uncommitted changes, ask Codex to commit them before pushing.
  echo.
  echo More help: docs\github-upload-manual.md and docs\deployment-troubleshooting.md
  echo.
  pause
  exit /b 1
)
echo.
echo GitHub upload finished. Refresh the repository page in your browser and confirm the project files are visible.
echo.
echo Press any key to close this window.
pause >nul
