#!/bin/bash

# Build script for Laravel Cloud deployment

echo "Installing Node.js dependencies..."
npm ci

echo "Building frontend assets..."
npm run build

echo "Clearing Laravel caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "Caching Laravel configuration..."
php artisan config:cache
php artisan route:cache

echo "Running database migrations..."
php artisan migrate --force
php artisan db:seed --force

echo "Build completed successfully!"
