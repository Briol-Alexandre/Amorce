<?php

namespace Database\Seeders;

use App\Models\Fund;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'a@a.a',
        ]);

        Fund::factory()->create([
            'name'=> 'Fond Principal',
            'description' => 'Un fonds collectif géré démocratiquement par ses contributeurs pour financer des activités comme des bourses et des prêts.',
            'permanent'=>true,
            'amount' => fake()->numberBetween(0, 5000),
            'raise' => fake()->numberBetween(-100, 100),
        ]);

        Fund::factory()->create([
            'name'=> 'Fond de Fonctionnement',
            'description' => 'Un fonds dédié au fonctionnement de l‘amorce, couvrant les frais opérationnels, géré par une équipe de bénévoles.',
            'permanent'=>true,
            'amount' => fake()->numberBetween(0, 5000),
            'raise' => fake()->numberBetween(-100, 100),
        ]);
    }
}
