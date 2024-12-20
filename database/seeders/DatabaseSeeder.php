<?php

namespace Database\Seeders;

use App\Models\Fund;
use App\Models\Transaction;
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

        Fund::factory()
            ->has(Transaction::factory()->count(7))
            ->create([
                'name' => 'Fond Principal',
                'iban' => 'BE64523081419552',
                'description' => 'Un fond collectif géré démocratiquement par ses contributeurs pour financer des activités comme des bourses et des prêts.',
                'permanent' => true,
                'amount' => fake()->numberBetween(0, 5000),
                'raise' => fake()->numberBetween(-100, 100),
            ])
            ->each(function ($fund) {
                $totalAmount = $fund->transactions()->sum('amount');
                $fund->update(['amount' => $totalAmount]);
            });

        Fund::factory()
            ->has(Transaction::factory()->count(7))
            ->create([
                'name' => 'Fond de Fonctionnement',
                'iban' => 'BE64523081417682',
                'description' => 'Un fond dédié au fonctionnement de l‘amorce, couvrant les frais opérationnels, géré par une équipe de bénévoles.',
                'permanent' => true,
                'amount' => fake()->numberBetween(0, 5000),
                'raise' => fake()->numberBetween(-100, 100),
            ])
            ->each(function ($fund) {
                $totalAmount = $fund->transactions()->sum('amount');
                $fund->update(['amount' => $totalAmount]);
            });

    }
}
