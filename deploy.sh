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


echo "Clearing and caching configuration..."
php artisan config:clear
php artisan config:cache

echo "Clearing and caching routes..."
php artisan route:clear
php artisan route:cache

echo "Clearing views cache..."
php artisan view:clear

echo "Creating storage symbolic link..."
php artisan storage:link

echo "Verifying deployment..."
php verify-deployment.php

echo "Setting up queue workers..."
# Redémarrer les workers de queue pour s'assurer qu'ils utilisent le code le plus récent
if [ -f "/etc/supervisor/conf.d/laravel-worker.conf" ]; then
    echo "Restarting supervisor workers..."
    sudo supervisorctl restart all
else
    echo "Starting queue worker as a background process..."
    # Démarrer un worker de queue en arrière-plan avec nohup
    nohup php artisan queue:work --tries=3 --timeout=600 > storage/logs/worker.log 2>&1 &
    echo "Queue worker started with PID: $!"
fi

echo "Deployment completed successfully!"
