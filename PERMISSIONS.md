# Système de Permissions

Ce document décrit le nouveau système de permissions implémenté dans l'application Amorce.

## Introduction

Le système de permissions remplace l'ancien système basé sur les rôles (`auth`, `comptable`, `user`). Cette nouvelle approche offre une gestion plus fine et granulaire des droits d'accès et des actions autorisées pour chaque utilisateur.

## Permissions disponibles

Les permissions suivantes sont disponibles dans le système :

| Nom | Slug | Description |
|-----|------|-------------|
| Peut accéder aux fonds | `access-funds` | Permet de voir les fonds et leurs détails |
| Peut agir sur les fonds | `manage-funds` | Permet de créer des transactions et d'effectuer des opérations sur les fonds |
| Peut modifier / supprimer un fond | `edit-delete-funds` | Permet de modifier les informations d'un fond ou de le supprimer |
| Peut accéder aux réunions | `access-meetings` | Permet de voir les réunions et leurs détails |
| Peut créer supprimer une réunion | `manage-meetings` | Permet de créer, modifier ou supprimer des réunions |
| Peut accéder à la détente | `access-detente` | Permet de voir la détente et ses détails |
| Peut agir sur la détente | `manage-detente` | Permet de gérer les participants à la détente et d'effectuer des tirages |
| Peut accéder aux projets | `access-projects` | Permet de voir les projets et leurs détails |
| Peut agir sur les projets | `manage-projects` | Permet de créer, modifier ou supprimer des projets |
| Peut créer un utilisateur | `create-users` | Permet de créer de nouveaux utilisateurs |

## Structure de la base de données

Le système de permissions est implémenté avec les tables suivantes :

1. `permissions` : Stocke toutes les permissions disponibles
   - `id` : Identifiant unique
   - `name` : Nom de la permission
   - `slug` : Identifiant unique de la permission (utilisé dans le code)
   - `description` : Description détaillée de la permission
   - `timestamps` : Dates de création et de modification

2. `user_permissions` : Table pivot qui associe les utilisateurs à leurs permissions
   - `id` : Identifiant unique
   - `user_id` : Référence à l'utilisateur
   - `permission_id` : Référence à la permission
   - `timestamps` : Dates de création et de modification

## Utilisation dans le code

### Vérifier si un utilisateur a une permission

```php
if ($user->hasPermission('access-funds')) {
    // L'utilisateur peut accéder aux fonds
}
```

### Récupérer toutes les permissions d'un utilisateur

```php
$permissions = $user->permissions;
```

### Attribuer des permissions à un utilisateur

```php
$user->permissions()->attach($permissionId);
// ou
$user->permissions()->attach([$permissionId1, $permissionId2]);
```

### Retirer des permissions à un utilisateur

```php
$user->permissions()->detach($permissionId);
// ou
$user->permissions()->detach([$permissionId1, $permissionId2]);
```

## Migration depuis l'ancien système de rôles

L'ancien système utilisait trois rôles : `auth`, `comptable` et `user`. La correspondance avec le nouveau système de permissions pourrait être :

- **auth** : Toutes les permissions
- **comptable** : `access-funds`, `manage-funds`, `access-meetings`, `access-detente`
- **user** : `access-funds`, `access-meetings`, `access-detente`, `access-projects`

## Implémentation du système de permissions

### Middleware de vérification des permissions

Un middleware `CheckPermission` a été créé pour vérifier si un utilisateur possède une permission spécifique :

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!$request->user() || !$request->user()->hasPermission($permission)) {
            abort(403, 'Accès non autorisé.');
        }

        return $next($request);
    }
}
```

Ce middleware est enregistré dans le Kernel HTTP sous l'alias 'permission' :

```php
protected $middlewareAliases = [
    // ...
    'permission' => \App\Http\Middleware\CheckPermission::class,
];
```

### Protection des routes

Les routes sont protégées par le middleware de permissions. Exemple :

```php
Route::middleware('permission:create-users')->group(function () {
    Route::get('/profile/create', [ProfileController::class, 'create'])->name('profile.create');
    Route::post('/profile', [ProfileController::class, 'store'])->name('profile.store');
});
```

Les routes ont été organisées par groupes de permissions :

- **Fonds** : `access-funds`, `manage-funds`, `delete-funds`
- **Détente** : `access-detente`, `manage-detente`
- **Événements** : `access-meetings`, `manage-meetings`
- **Projets** : `access-projects`, `manage-projects`
- **Transactions** : `access-transactions`, `manage-transactions`
- **Utilisateurs** : `create-users`

### Interface utilisateur

L'interface utilisateur a été mise à jour pour afficher et gérer les permissions :

1. Le formulaire d'ajout d'utilisateur affiche maintenant une liste de cases à cocher pour les permissions
2. Le profil utilisateur affiche la liste des permissions attribuées

## Prochaines étapes

1. Créer une interface d'administration pour gérer les permissions des utilisateurs existants
2. Ajouter des tests pour vérifier le bon fonctionnement du système de permissions
3. Implémenter un système de rôles prédéfinis (groupes de permissions)
