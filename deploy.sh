#!/bin/bash

# Deployment script for Laravel Cloud
# This script runs after the build phase when database is available

echo "=== Laravel Cloud Deployment Script ==="

echo "Checking database connection..."
if php check-db.php; then
    echo "Database connection successful, proceeding with migrations..."
    
    echo "Running database migrations..."
    php artisan migrate --force
    
    echo "Seeding database..."
    php artisan db:seed --force
else
    echo "⚠️  Database not available yet. Skipping database operations."
    echo "Please ensure a MySQL database is configured in Laravel Cloud dashboard."
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
