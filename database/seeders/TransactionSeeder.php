<?php

namespace Database\Seeders;

use App\Models\Donators;
use App\Models\DonatorPeriod;
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
            // Groupe 1 - Donateurs originaux
            'Marie Dupont',
            'Jean Martin',
            'Sophie Lefebvre',
            'Thomas Bernard',
            'Camille Dubois',
            'Lucas Moreau',
            'Emma Petit',
            'Hugo Lambert',
            'Léa Robert',
            'Nathan Durand',
            
            // Groupe 2 - Nouveaux donateurs
            'Alexandre Leroy',
            'Chloé Girard',
            'Maxime Rousseau',
            'Julie Mercier',
            'Antoine Fournier',
            'Manon Lefevre',
            'Nicolas Garnier',
            'Elodie Morel',
            'Romain Vincent',
            'Laura Chevalier',
            
            // Groupe 3 - Donateurs supplémentaires
            'Julien Bertrand',
            'Aurélie Lemoine',
            'Quentin Dubois',
            'Céline Moreau',
            'Mathieu Gauthier',
            'Pauline Roux',
            'Sébastien Lecomte',
            'Emilie Perrin',
            'Florian Legrand',
            'Charlotte Faure',
            
            // Groupe 4 - Encore plus de donateurs
            'Théo Marchand',
            'Inès Dupuis',
            'Victor Blanchard',
            'Margaux Hubert',
            'Adrien Carpentier',
            'Léa Meunier',
            'Guillaume Dumas',
            'Zoé Guerin',
            'Valentin Brun',
            'Océane Caron'
        ];

        // Créer ou récupérer les donnateurs
        $donators = [];
        foreach ($donatorNames as $name) {
            $donator = Donators::firstOrCreate(['name' => $name]);
            $donators[] = $donator;
        }

        // Générer des transactions pour chaque donateur
        foreach ($donators as $donator) {
            // Pour le mois actuel et les 2 mois précédents (0 = mois actuel, 1 = mois précédent, 2 = il y a 2 mois)
            // Ces mois correspondent exactement à ceux vérifiés par getPotentialsDetenteParticipants
            for ($monthsAgo = 0; $monthsAgo < 3; $monthsAgo++) {
                $month = Carbon::now()->subMonths($monthsAgo);
                
                // Générer 1 à 3 transactions par mois pour chaque donateur
                $transactionsCount = rand(1, 3);
                
                for ($i = 0; $i < $transactionsCount; $i++) {
                    // Choisir un jour aléatoire dans le mois
                    $day = rand(1, $month->daysInMonth);
                    $date = Carbon::create($month->year, $month->month, $day);
                    
                    // Choisir un fond aléatoire
                    $fund = $funds->random();
                    
                    // Montant aléatoire entre 10 et 500 euros
                    $amount = rand(10, 500);
                    
                    // Générer un numéro de compte au format IBAN simplifié
                    $accountNumber = 'BE' . rand(10, 99) . ' ' . 
                                    substr(str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT), 0, 4) . ' ' . 
                                    substr(str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT), 0, 4) . ' ' . 
                                    substr(str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT), 0, 4);
                    
                    // Créer la transaction sans référence au donateur
                    Transaction::create([
                        'fund_id' => $fund->id,
                        'amount' => $amount,
                        'communication' => "Don de {$donator->name} - " . $date->format('m/Y'),
                        'month' => $month->month,
                        'year' => $month->year
                    ]);
                    
                    // Créer ou mettre à jour la période de don pour ce donateur et ce mois
                    DonatorPeriod::firstOrCreate([
                        'donator_id' => $donator->id,
                        'month' => $month->month,
                        'year' => $month->year
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
