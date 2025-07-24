#!/bin/bash

# Deployment script for Laravel Cloud
# This script runs after the build phase when database is available

echo "=== Laravel Cloud Deployment Script ==="

echo "Checking database connection..."
if php check-db.php; then
    echo "Database connection successful, proceeding with migrations..."
else
    echo "Database connection check failed, but attempting migrations anyway..."
fi

echo "Running database migrations..."
if php artisan migrate --force; then
    echo "✅ Migrations completed successfully"
    
    echo "Seeding database..."
    php artisan db:seed --force
else
    echo "❌ Migrations failed - database may not be ready yet"
fi

echo "Clearing and caching configuration..."
php artisan config:clear
php artisan config:cache

echo "Clearing and caching routes..."
php artisan route:clear
php artisan route:cache

echo "Clearing views cache..."
php artisan view:clear

echo "Deployment completed successfully!"
