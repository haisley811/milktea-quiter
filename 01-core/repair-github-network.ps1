$ErrorActionPreference = "Stop"

$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = [Security.Principal.WindowsPrincipal]::new($identity)
$administratorRole = [Security.Principal.WindowsBuiltInRole]::Administrator

if (-not $principal.IsInRole($administratorRole)) {
  try {
    $arguments = @(
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      ('"{0}"' -f $PSCommandPath)
    )
    $process = Start-Process -FilePath "powershell.exe" -Verb RunAs -ArgumentList $arguments -Wait -PassThru
    exit $process.ExitCode
  }
  catch {
    Write-Host "Administrator permission was not granted: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
  }
}

try {
  Write-Host "Repairing the Windows network catalog used by Git and GitHub Desktop..." -ForegroundColor Cyan
  & netsh winsock reset
  if ($LASTEXITCODE -ne 0) {
    throw "netsh winsock reset exited with code $LASTEXITCODE."
  }

  & ipconfig /flushdns
  if ($LASTEXITCODE -ne 0) {
    throw "ipconfig /flushdns exited with code $LASTEXITCODE."
  }

  exit 0
}
catch {
  Write-Host "Repair failed: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}
