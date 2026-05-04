param(
    [Parameter(Mandatory = $true)]
    [string] $Root
)

$ErrorActionPreference = "Continue"

Set-Location -LiteralPath $Root

$logPath = Join-Path $Root "storage\logs\local-vite-server.log"
Start-Transcript -Path $logPath -Force | Out-Null

Write-Host "Vite/npm: http://127.0.0.1:5173" -ForegroundColor Green
Write-Host "Log: $logPath"
Write-Host ""

npm run dev

Stop-Transcript | Out-Null

