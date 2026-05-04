param(
    [Parameter(Mandatory = $true)]
    [string] $Root,

    [Parameter(Mandatory = $true)]
    [int] $Port
)

$ErrorActionPreference = "Continue"

Set-Location -LiteralPath $Root

$logPath = Join-Path $Root "storage\logs\local-laravel-server.log"
Start-Transcript -Path $logPath -Force | Out-Null

Write-Host "Laravel: http://localhost:$Port" -ForegroundColor Green
Write-Host "Log: $logPath"
Write-Host ""
Write-Host "Tentative avec php artisan serve..."

php artisan serve --host=0.0.0.0 --port=$Port

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "php artisan serve a echoue. Tentative avec le serveur PHP natif..." -ForegroundColor Yellow
    Set-Location -LiteralPath (Join-Path $Root "public")
    php -S "0.0.0.0:$Port" (Join-Path $Root "vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php")
}

Stop-Transcript | Out-Null
