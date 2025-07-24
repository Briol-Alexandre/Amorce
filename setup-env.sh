#!/bin/bash

# Script to configure environment variables for Laravel Cloud

echo "=== Laravel Cloud Environment Setup ==="

# Check if database is available
if php check-db.php > /dev/null 2>&1; then
    echo "✅ Database available - using database for cache and sessions"
    
    # Set environment variables for database-backed cache and sessions
    echo "CACHE_STORE=database" >> .env
    echo "SESSION_DRIVER=database" >> .env
    
else
    echo "⚠️  Database not available - using file-based cache and sessions"
    
    # Set environment variables for file-based cache and sessions
    echo "CACHE_STORE=file" >> .env
    echo "SESSION_DRIVER=file" >> .env
    
    # Ensure storage directories exist
    mkdir -p storage/framework/cache/data
    mkdir -p storage/framework/sessions
fi

echo "Environment configuration completed!"
