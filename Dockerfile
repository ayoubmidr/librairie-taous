FROM php:8.4-cli-bookworm

# System dependencies + PHP extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
        git curl unzip zip \
        libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
        libzip-dev libicu-dev libonig-dev libxml2-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        bcmath gd intl mbstring opcache pdo pdo_mysql pdo_sqlite pcntl zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Install PHP deps
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Install Node deps
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy full project
COPY . .

# Post-install hooks + frontend build
RUN composer run-script post-autoload-dump 2>/dev/null || true
RUN npm run build

# Permissions
RUN mkdir -p storage/framework/{cache,sessions,testing,views} storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8000

CMD sh -c "\
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan migrate --force && \
    php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"
