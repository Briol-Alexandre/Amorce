#!/bin/bash

# Script to run migrations and seeding for Laravel Cloud

echo "=== Running Database Migrations ==="

echo "Checking current migration status..."
php artisan migrate:status

echo "Running migrations..."
php artisan migrate --force

echo "Checking migration status after migration..."
php artisan migrate:status

echo "Seeding database..."
php artisan db:seed --force

echo "=== Migration and Seeding Complete ==="
