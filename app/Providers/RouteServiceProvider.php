<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/dashboard';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        $this->routes(function () {
            Route::middleware('web')
                ->group(base_path('routes/web.php'));
                
            // Charger les routes avec le middleware web
            Route::middleware('web')
                ->group(base_path('routes/auth.php'));
                
            Route::middleware('web')
                ->group(base_path('routes/fund.php'));
                
            Route::middleware('web')
                ->group(base_path('routes/transaction.php'));
                
            Route::middleware('web')
                ->group(base_path('routes/detente.php'));
                
            Route::middleware('web')
                ->group(base_path('routes/compte.php'));
                
            Route::middleware('web')
                ->group(base_path('routes/event.php'));
                
            Route::middleware('web')
                ->group(base_path('routes/project.php'));
        });
    }
}
