$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

Write-Host "Starting local preview..." -ForegroundColor Cyan
Write-Host "Keep this window open while using the site." -ForegroundColor Yellow
Write-Host "Open: http://127.0.0.1:4173/" -ForegroundColor Green
Write-Host ""

try {
  $node = Get-Command node -ErrorAction Stop
  Write-Host "Node.js: $($node.Source)" -ForegroundColor DarkGray
  & $node.Source "scripts/serve-preview.mjs"
}
catch {
  Write-Host "Start failed: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
  Write-Host ""
  Read-Host "The server stopped. Press Enter to close this window"
}
