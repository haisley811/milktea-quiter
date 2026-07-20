@echo off
setlocal
cd /d "%~dp0"
title Today No Milktea - Start Here

if not exist "docs\start-here-after-sleep.md" (
  echo Cannot find docs\start-here-after-sleep.md
  echo Please make sure this file is in the project root folder.
  echo.
  pause
  exit /b 1
)

echo Opening docs\start-here-after-sleep.md ...
notepad "docs\start-here-after-sleep.md"
