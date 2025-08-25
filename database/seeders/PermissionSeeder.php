<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            [
                'name' => 'Peut accéder aux fonds',
                'slug' => 'access-funds',
                'description' => 'Permet de voir les fonds et leurs détails',
            ],
            [
                'name' => 'Peut agir sur les fonds',
                'slug' => 'manage-funds',
                'description' => 'Permet de créer des transactions et d\'effectuer des opérations sur les fonds',
            ],
            [
                'name' => 'Peut modifier / supprimer un fond',
                'slug' => 'edit-delete-funds',
                'description' => 'Permet de modifier les informations d\'un fond ou de le supprimer',
            ],
            [
                'name' => 'Peut accéder aux réunions',
                'slug' => 'access-meetings',
                'description' => 'Permet de voir les réunions et leurs détails',
            ],
            [
                'name' => 'Peut créer supprimer une réunion',
                'slug' => 'manage-meetings',
                'description' => 'Permet de créer, modifier ou supprimer des réunions',
            ],
            [
                'name' => 'Peut accéder à la détente',
                'slug' => 'access-detente',
                'description' => 'Permet de voir la détente et ses détails',
            ],
            [
                'name' => 'Peut agir sur la détente',
                'slug' => 'manage-detente',
                'description' => 'Permet de gérer les participants à la détente et d\'effectuer des tirages',
            ],
            [
                'name' => 'Peut accéder aux projets',
                'slug' => 'access-projects',
                'description' => 'Permet de voir les projets et leurs détails',
            ],
            [
                'name' => 'Peut agir sur les projets',
                'slug' => 'manage-projects',
                'description' => 'Permet de créer, modifier ou supprimer des projets',
            ],
            [
                'name' => 'Peut créer un utilisateur',
                'slug' => 'create-users',
                'description' => 'Permet de créer de nouveaux utilisateurs',
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['slug' => $permission['slug']],
                [
                    'name' => $permission['name'],
                    'description' => $permission['description'],
                ]
            );
        }
    }
}
