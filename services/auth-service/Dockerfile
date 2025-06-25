<<<<<<< HEAD
=======
<<<<<<< HEAD
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
=======
>>>>>>> b427e14 (fix issues)
# Dockerfile for auth-service, booking-service, etc.
FROM php:8.2-fpm

# System dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev zip unzip git curl libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Composer
<<<<<<< HEAD
=======
>>>>>>> 52bc2537473c219474860525ca75fa3dc1c89343
>>>>>>> b427e14 (fix issues)
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

<<<<<<< HEAD
=======
<<<<<<< HEAD
COPY . .

RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
=======
>>>>>>> b427e14 (fix issues)
# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions (customize for your setup)
RUN chown -R www-data:www-data /var/www && chmod -R 755 /var/www

EXPOSE 9000
CMD ["php-fpm"]
<<<<<<< HEAD
=======
>>>>>>> 52bc2537473c219474860525ca75fa3dc1c89343
>>>>>>> b427e14 (fix issues)
