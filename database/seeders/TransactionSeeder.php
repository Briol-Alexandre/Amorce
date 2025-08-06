<?php

namespace Database\Seeders;

use App\Models\Donators;
use App\Models\Fund;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Seed transactions with multiple donors eligible for "détente".
     */
    public function run(): void
    {
        // Récupérer les fonds existants
        $funds = Fund::all();
        
        if ($funds->isEmpty()) {
            $this->command->error('Aucun fond trouvé. Veuillez d\'abord exécuter DatabaseSeeder.');
            return;
        }
        
        // Liste des donnateurs à créer
        $donatorNames = [
            'Marie Dupont',
            'Jean Martin',
            'Sophie Lefebvre',
            'Thomas Bernard',
            'Camille Dubois',
            'Lucas Moreau',
            'Emma Petit',
            'Hugo Lambert',
            'Léa Robert',
            'Nathan Durand'
        ];
        
        // Créer ou récupérer les donnateurs
        $donators = [];
        foreach ($donatorNames as $name) {
            $donator = Donators::firstOrCreate(['name' => $name]);
            $donators[] = $donator;
        }
        
        // Générer des transactions pour le mois actuel et les 2 mois précédents pour chaque donnateur
        foreach ($donators as $donator) {
            // Pour le mois actuel et les 2 mois précédents (0 = mois actuel, 1 = mois précédent, 2 = il y a 2 mois)
            for ($monthsAgo = 0; $monthsAgo < 3; $monthsAgo++) {
                $month = Carbon::now()->subMonths($monthsAgo);
                
                // Générer 1 à 3 transactions par mois pour chaque donnateur
                $transactionsCount = rand(1, 3);
                
                for ($i = 0; $i < $transactionsCount; $i++) {
                    // Choisir un jour aléatoire dans le mois
                    $day = rand(1, $month->daysInMonth);
                    $date = Carbon::create($month->year, $month->month, $day);
                    
                    // Choisir un fond aléatoire
                    $fund = $funds->random();
                    
                    // Montant aléatoire entre 10 et 500 euros
                    $amount = rand(10, 500);
                    
                    // Créer la transaction
                    Transaction::create([
                        'fund_id' => $fund->id,
                        'transactor' => $donator->name,
                        'amount' => $amount,
                        'date' => $date,
                        'communication' => "Don de {$donator->name} - " . $date->format('m/Y'),
                    ]);
                    
                    // Mettre à jour le montant du fond
                    $fund->amount += $amount;
                    $fund->save();
                }
            }
            
            $this->command->info("Transactions créées pour {$donator->name}");
        }
        
        $this->command->info('Toutes les transactions ont été créées avec succès!');
    }
}
