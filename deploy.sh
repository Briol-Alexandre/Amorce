#!/bin/bash

# Deployment script for Laravel Cloud
# This script runs after the build phase when database is available

echo "=== Laravel Cloud Deployment Script ==="

echo "Checking database connection..."
php check-db.php

echo "Running database migrations..."
php artisan migrate --force

echo "Seeding database..."
php artisan db:seed --force

echo "Clearing and caching configuration..."
php artisan config:clear
php artisan config:cache

echo "Clearing and caching routes..."
php artisan route:clear
php artisan route:cache

echo "Clearing views cache..."
php artisan view:clear

echo "Deployment completed successfully!"
