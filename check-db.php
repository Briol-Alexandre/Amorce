<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Database Configuration Check ===\n";

// Check environment variables
echo "Environment: " . env('APP_ENV') . "\n";
echo "DB_CONNECTION: " . env('DB_CONNECTION') . "\n";
echo "DB_HOST: " . env('DB_HOST') . "\n";
echo "DB_PORT: " . env('DB_PORT') . "\n";
echo "DB_DATABASE: " . env('DB_DATABASE') . "\n";
echo "DB_USERNAME: " . env('DB_USERNAME') . "\n";
echo "DB_PASSWORD: " . (env('DB_PASSWORD') ? '[SET]' : '[NOT SET]') . "\n";

echo "\n=== Laravel Configuration ===\n";
echo "App URL: " . config('app.url') . "\n";
echo "App Environment: " . config('app.env') . "\n";
echo "Database Default: " . config('database.default') . "\n";
echo "Cache Default: " . config('cache.default') . "\n";
echo "Session Driver: " . config('session.driver') . "\n";

echo "\n=== Testing Database Connection ===\n";

try {
    $pdo = DB::connection()->getPdo();
    echo "✅ Database connection successful!\n";
    
    // Test a simple query
    $result = DB::select('SELECT 1 as test');
    echo "✅ Database query successful!\n";
    
    // Check if migrations table exists
    try {
        $migrations = DB::select('SELECT * FROM migrations LIMIT 1');
        echo "✅ Migrations table exists!\n";
    } catch (Exception $e) {
        echo "❌ Migrations table does not exist: " . $e->getMessage() . "\n";
    }
    
    // Check if cache table exists
    try {
        $cache = DB::select('SELECT * FROM cache LIMIT 1');
        echo "✅ Cache table exists!\n";
    } catch (Exception $e) {
        echo "❌ Cache table does not exist: " . $e->getMessage() . "\n";
    }
    
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
    echo "Error Code: " . $e->getCode() . "\n";
}

echo "\n=== Configuration Summary ===\n";
echo "Default connection: " . config('database.default') . "\n";
echo "Cache driver: " . config('cache.default') . "\n";
echo "Session driver: " . config('session.driver') . "\n";
