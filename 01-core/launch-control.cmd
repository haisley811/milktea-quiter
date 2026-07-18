@echo off
setlocal
cd /d "%~dp0"
title Today No Milktea - Launch Control

:menu
cls
echo ===============================================
echo Today No Milktea - Launch Control
echo ===============================================
echo.
echo Recommended order:
echo   1. Check current status
echo   2. Read the start-here manual
echo   3. Connect GitHub after creating an empty repo
echo   4. Run post-Netlify checks after deployment
echo   5. Configure WeChat request legal domain in WeChat public platform
echo.
echo Choose an action:
echo.
echo   1  Check current project status
echo   2  Open start-here manual
echo   3  Connect GitHub repo and push main
echo   4  Verify Netlify public API and update WeChat template
echo   5  Retry local dependency install, verify, and build
echo   6  Check WeChat mini program API template
echo   7  Open user action checklist
echo   8  Open full project introduction
echo   9  Open troubleshooting manual
echo   A  Open zero-code launch manual
echo   L  Generate package-lock.json only
echo   E  Open Netlify environment variable copy template
echo   I  Open API integration status
echo   C  Open launch acceptance checklist
echo   D  Set WeChat mini program AppID
echo   W  Record WeChat domain and real-phone verification
echo   P  Open static preview
echo   0  Exit
echo.
choice /C 123456789ALEICDWP0 /N /M "Press a number or letter: "

if errorlevel 18 goto end
if errorlevel 17 goto preview
if errorlevel 16 goto wechatverified
if errorlevel 15 goto wechatappid
if errorlevel 14 goto acceptance
if errorlevel 13 goto apistatus
if errorlevel 12 goto envcopy
if errorlevel 11 goto lockfile
if errorlevel 10 goto zerocode
if errorlevel 9 goto troubleshoot
if errorlevel 8 goto intro
if errorlevel 7 goto actions
if errorlevel 6 goto wechatcheck
if errorlevel 5 goto deps
if errorlevel 4 goto netlify
if errorlevel 3 goto github
if errorlevel 2 goto manual
if errorlevel 1 goto status

:status
call check-status.cmd
goto menu

:manual
notepad "docs\start-here-after-sleep.md"
goto menu

:github
call connect-github.cmd
goto menu

:netlify
call after-netlify.cmd
goto menu

:deps
call install-local-deps.cmd
goto menu

:wechatcheck
call check-wechat-template.cmd
goto menu

:actions
call what-you-need-to-do.cmd
goto menu

:intro
notepad "docs\project-introduction.md"
goto menu

:troubleshoot
notepad "docs\deployment-troubleshooting.md"
goto menu

:zerocode
notepad "docs\zero-code-launch-manual.md"
goto menu

:lockfile
call generate-package-lock.cmd
goto menu

:envcopy
notepad "docs\netlify-env-copy-paste.md"
goto menu

:apistatus
notepad "docs\api-integration-status.md"
goto menu

:acceptance
notepad "docs\launch-acceptance-checklist.md"
goto menu

:wechatappid
call set-wechat-appid.cmd
goto menu

:wechatverified
call mark-wechat-verified.cmd
goto menu

:preview
call preview.cmd
goto menu

:end
exit /b 0
