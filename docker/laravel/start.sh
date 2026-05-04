#!/usr/bin/env sh
set -eu

if [ ! -f .env ]; then
    cp .env.docker .env
fi

composer install --no-interaction --prefer-dist

if ! grep -q '^APP_KEY=base64:' .env; then
    php artisan key:generate --force
fi

echo "Attente de MySQL..."
ready=0
for i in $(seq 1 60); do
    if php -r '$host=getenv("DB_HOST") ?: "mysql"; $port=getenv("DB_PORT") ?: "3306"; $db=getenv("DB_DATABASE") ?: "librairie_taous"; $user=getenv("DB_USERNAME") ?: "taous"; $pass=getenv("DB_PASSWORD") ?: "taous"; try { new PDO("mysql:host=$host;port=$port;dbname=$db", $user, $pass); exit(0); } catch (Throwable $e) { exit(1); }'; then
        ready=1
        break
    fi

    sleep 2
done

if [ "$ready" != "1" ]; then
    echo "MySQL n'est pas pret. Verifiez les logs avec: docker compose logs mysql"
    exit 1
fi

php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan migrate --force
php artisan db:seed --force
php artisan optimize:clear
php artisan storage:link || true

echo ""
echo "Laravel est pret sur http://127.0.0.1:8000"
php artisan serve --host=0.0.0.0 --port=8000
