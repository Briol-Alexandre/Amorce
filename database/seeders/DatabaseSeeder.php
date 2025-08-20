<?php

namespace Database\Seeders;

use App\Models\Detente;
use App\Models\Fund;
use App\Models\Event;
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

        User::firstOrCreate(
            ['email' => 'alexandre.briol@gmail.com'],
            [
                'name' => 'Alexandre Briol',
                'role' => 'auth',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
            ]
        );

        // Crée 3 utilisateurs role 'auth'
        User::factory()->auth()->count(3)->create();
        // Crée 2 utilisateurs role 'comptable'
        User::factory()->comptable()->count(2)->create();
        // Crée 10 utilisateurs role 'user'
        User::factory()->user()->count(10)->create();

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




        // Appel au seeder de transactions pour créer des donnateurs éligibles à la détente
        $this->call([
            TransactionSeeder::class,
        ]);

    }
}
