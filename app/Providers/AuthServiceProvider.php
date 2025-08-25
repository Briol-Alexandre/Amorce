<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Définir une gate dynamique pour toutes les permissions
        Gate::before(function ($user, $ability) {
            // Vérifier si l'ability est une permission et si l'utilisateur la possède
            if (method_exists($user, 'hasPermission')) {
                return $user->hasPermission($ability) ?: null;
            }
            
            return null; // null signifie continuer la vérification
        });
    }
}
