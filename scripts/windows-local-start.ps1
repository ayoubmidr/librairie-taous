$ErrorActionPreference = "Stop"

function Stop-With-Message($message) {
    Write-Host ""
    Write-Host $message -ForegroundColor Red
    exit 1
}

function Require-Command($name, $installHint) {
    if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
        Stop-With-Message "'$name' est introuvable. $installHint"
    }
}

function Run-Step($label, $command, $arguments) {
    Write-Host ""
    Write-Host "==> $label" -ForegroundColor Cyan

    & $command @arguments

    if ($LASTEXITCODE -ne 0) {
        Stop-With-Message "La commande '$command $($arguments -join ' ')' a echoue."
    }
}

function Set-Env-Value($path, $key, $value) {
    $lines = Get-Content -LiteralPath $path
    $updated = $false

    $lines = $lines | ForEach-Object {
        if ($_.StartsWith("$key=")) {
            $updated = $true
            "$key=$value"
        } else {
            $_
        }
    }

    if (-not $updated) {
        $lines += "$key=$value"
    }

    Set-Content -LiteralPath $path -Value $lines -Encoding ASCII
}

function Test-Port-Can-Listen($port) {
    $listener = $null

    try {
        $address = [System.Net.IPAddress]::Parse("127.0.0.1")
        $listener = New-Object System.Net.Sockets.TcpListener($address, $port)
        $listener.Start()
        return $true
    } catch {
        return $false
    } finally {
        if ($listener) {
            $listener.Stop()
        }
    }
}

function Wait-Port-Open($port) {
    $client = $null

    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $async = $client.BeginConnect("127.0.0.1", $port, $null, $null)
        $connected = $async.AsyncWaitHandle.WaitOne(1000, $false)

        if ($connected) {
            $client.EndConnect($async)
            return $true
        }

        return $false
    } catch {
        return $false
    } finally {
        if ($client) {
            $client.Close()
        }
    }
}

$root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $root

Write-Host ""
Write-Host "Lancement local de Librairie Taous" -ForegroundColor Green
Write-Host "Mode simple Windows : PHP/Composer/Node locaux + SQLite, sans Docker."

Require-Command "php" "Installez Laravel Herd pour Windows, puis relancez ce fichier."
Require-Command "composer" "Installez Laravel Herd pour Windows, puis relancez ce fichier."
Require-Command "npm" "Installez Node.js LTS depuis https://nodejs.org, puis relancez ce fichier."

$appPort = 8000
while ((-not (Test-Port-Can-Listen $appPort)) -and ($appPort -lt 8050)) {
    $appPort++
}

if ($appPort -gt 8000) {
    Write-Host ""
    Write-Host "Le port 8000 est deja utilise. Laravel sera lance sur le port $appPort." -ForegroundColor Yellow
}

if ($appPort -ge 8050) {
    Stop-With-Message "Aucun port disponible trouve entre 8000 et 8049."
}

if (-not (Test-Path -LiteralPath ".env")) {
    if (-not (Test-Path -LiteralPath ".env.example")) {
        Stop-With-Message "Le fichier .env.example est introuvable."
    }

    Copy-Item -LiteralPath ".env.example" -Destination ".env"
}

Set-Env-Value ".env" "APP_URL" "http://localhost:$appPort"
Set-Env-Value ".env" "DB_CONNECTION" "sqlite"
Set-Env-Value ".env" "DB_DATABASE" "database/database.sqlite"
Set-Env-Value ".env" "SESSION_DRIVER" "database"
Set-Env-Value ".env" "CACHE_STORE" "database"
Set-Env-Value ".env" "QUEUE_CONNECTION" "database"
Set-Env-Value ".env" "VITE_DEV_SERVER_URL" "http://127.0.0.1:5173"

if (-not (Test-Path -LiteralPath "database")) {
    New-Item -ItemType Directory -Path "database" | Out-Null
}

if (-not (Test-Path -LiteralPath "database\database.sqlite")) {
    New-Item -ItemType File -Path "database\database.sqlite" | Out-Null
}

$requiredDirectories = @(
    "bootstrap\cache",
    "storage\app",
    "storage\app\private",
    "storage\app\public",
    "storage\framework",
    "storage\framework\cache",
    "storage\framework\cache\data",
    "storage\framework\sessions",
    "storage\framework\testing",
    "storage\framework\views",
    "storage\logs"
)

foreach ($directory in $requiredDirectories) {
    if (-not (Test-Path -LiteralPath $directory)) {
        New-Item -ItemType Directory -Path $directory | Out-Null
    }
}

if (-not (Test-Path -LiteralPath "vendor")) {
    Run-Step "Installation des dependances PHP" "composer" @("install")
} else {
    Run-Step "Verification des dependances PHP" "composer" @("install")
}

if (-not (Test-Path -LiteralPath "node_modules")) {
    Run-Step "Installation des dependances JavaScript" "npm" @("install")
}

$envContent = Get-Content -LiteralPath ".env" -Raw
if ($envContent -match "(?m)^APP_KEY=\s*$") {
    Run-Step "Creation de la cle Laravel" "php" @("artisan", "key:generate", "--force")
}

Run-Step "Nettoyage de la configuration Laravel" "php" @("artisan", "config:clear")
Run-Step "Nettoyage des routes Laravel" "php" @("artisan", "route:clear")
Run-Step "Nettoyage des vues Laravel" "php" @("artisan", "view:clear")
Run-Step "Preparation de la base SQLite" "php" @("artisan", "migrate", "--force")
Run-Step "Ajout des donnees de demonstration" "php" @("artisan", "db:seed", "--force")
Run-Step "Nettoyage final du cache Laravel" "php" @("artisan", "optimize:clear")

$laravelLog = Join-Path $root "storage\logs\local-laravel-server.log"
$laravelScript = Join-Path $root "scripts\run-laravel-server.ps1"
$viteScript = Join-Path $root "scripts\run-vite-server.ps1"

Write-Host ""
Write-Host "Demarrage des serveurs..." -ForegroundColor Cyan
Start-Process powershell.exe -ArgumentList @("-NoExit", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $laravelScript, "-Root", $root, "-Port", $appPort)
Start-Process powershell.exe -ArgumentList @("-NoExit", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $viteScript, "-Root", $root)

$siteReady = $false
Write-Host ""
Write-Host "Attente du serveur Laravel sur http://localhost:$appPort ..."

for ($i = 1; $i -le 30; $i++) {
    if (Wait-Port-Open $appPort) {
        $siteReady = $true
        break
    }

    Start-Sleep -Seconds 1
}

if ($siteReady) {
    Start-Process "http://localhost:$appPort"

    Write-Host ""
    Write-Host "Le site est lance : http://localhost:$appPort" -ForegroundColor Green
    Write-Host "Pour arreter le site, fermez les deux nouvelles fenetres PowerShell."
} else {
    Write-Host ""
    Write-Host "Laravel n'a pas repondu sur le port $appPort apres 30 secondes." -ForegroundColor Red
    Write-Host "Regardez la fenetre PowerShell nommee Laravel : elle contient normalement l'erreur exacte."
    Write-Host "Log Laravel : $laravelLog"
    Write-Host "Ca arrive souvent si le port 8000 est deja utilise ou si PHP a une extension manquante."
    Write-Host ""
    Write-Host "Adresse a reessayer ensuite : http://localhost:$appPort"
}
