<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        
        if ($user) {
            // Charger les permissions de l'utilisateur
            $user->load('permissions');
            
            // Extraire les slugs des permissions pour les envoyer au frontend
            $permissionSlugs = $user->permissions->pluck('slug')->toArray();
            
            // Ajouter les slugs des permissions à l'objet utilisateur
            $user = array_merge($user->toArray(), ['permissions' => $permissionSlugs]);
        }
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
