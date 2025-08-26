<?php

namespace Database\Seeders;

use App\Models\Detente;
use App\Models\Fund;
use App\Models\Event;
use App\Models\Permission;
use App\Models\Potentials;
use App\Models\Transaction;
use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Génération d'un lot d'utilisateurs par rôle
        // (en plus de l'utilisateur principal défini ci-dessous)
        // Vous pouvez ajuster les quantités si nécessaire
        // User::factory(10)->create();

        $user = User::firstOrCreate(
            ['email' => 'alexandre.briol@gmail.com'],
            [
                'name' => 'Alexandre Briol',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
            ]
        );

        // Crée 15 utilisateurs
        User::factory()->count(15)->create();

        Fund::factory()->create([
            'name' => 'Fond Principal',
            'iban' => 'BE64523081419552',
            'description' => 'Un fond collectif géré démocratiquement par ses contributeurs pour financer des activités comme des bourses et des prêts.',
            'permanent' => true,
            'amount' => 0,
        ]);

        Fund::factory()->create([
            'name' => 'Fond de Fonctionnement',
            'iban' => 'BE64523081417682',
            'description' => 'Un fond dédié au fonctionnement de l\'amorce, couvrant les frais opérationnels, géré par une équipe de bénévoles.',
            'permanent' => true,
            'amount' => 0,
        ]);

        // Créer 3 détentes avec 3 participations
        Detente::factory()
            ->count(3)
            ->create([
                'participation' => 3
            ]);

        // Créer 3 détentes avec 2 participations
        Detente::factory()
            ->count(3)
            ->create([
                'participation' => 2
            ]);

        // Créer 3 détentes avec 1 participation
        Detente::factory()
            ->count(3)
            ->create([
                'participation' => 1
            ]);

        // Appel aux seeders
        $this->call([
            PermissionSeeder::class,
            TransactionSeeder::class,
            EventSeeder::class,
        ]);

        // Attribuer toutes les permissions à l'utilisateur principal
        $permissions = Permission::all();
        $user->permissions()->attach($permissions->pluck('id')->toArray());

    }
}
