<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Seed the events table.
     */
    public function run(): void
    {
        // Récupérer quelques utilisateurs pour les associer aux événements
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->info('Aucun utilisateur trouvé. Création d\'un utilisateur test...');
            $user = User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
            $users = collect([$user]);
        }

        // Créer 3 événements passés
        Event::factory()
            ->count(3)
            ->past()
            ->create([
                'user_id' => 1,
            ])
            ->each(function ($event) use ($users) {
                // Ajouter entre 1 et 5 participants aléatoires à chaque événement
                $event->participants()->attach(
                    $users->random(rand(1, min(5, $users->count())))->pluck('id')->toArray()
                );
            });

        // Créer 3 événements à venir
        Event::factory()
            ->count(3)
            ->upcoming()
            ->create([
                'user_id' => 1,
            ])
            ->each(function ($event) use ($users) {
                // Ajouter entre 1 et 5 participants aléatoires à chaque événement
                $event->participants()->attach(
                    $users->random(rand(1, min(5, $users->count())))->pluck('id')->toArray()
                );
            });

        $this->command->info('6 événements créés avec succès!');
    }
}
