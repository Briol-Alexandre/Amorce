<?php

namespace Tests\Unit;

use App\Http\Controllers\DetenteController;
use App\Models\{Detente, DonatorPeriod, Donators, Draw, Fund, Participations, Potentials, Transaction};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use ReflectionClass;

class DetenteControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $detenteController;

    protected function setUp(): void
    {
        parent::setUp();
        $this->detenteController = new DetenteController();
    }
    
    /**
     * Appelle la méthode privée getPotentialsDetenteParticipants du contrôleur
     */
    protected function callGetPotentialsDetenteParticipants($excludedDonatorId = null, $forceRefresh = false)
    {
        // Vérifier l'état avant l'appel
        $donatorsCount = Donators::count();
        $periodsCount = DonatorPeriod::count();
        $detenteCount = Detente::count();
        $participationsCount = Participations::count();
        
        echo "\nDébogage avant appel:\n";
        echo "Donateurs: $donatorsCount, Périodes: $periodsCount, Détente: $detenteCount, Participations: $participationsCount\n";
        
        $reflection = new ReflectionClass($this->detenteController);
        $method = $reflection->getMethod('getPotentialsDetenteParticipants');
        $method->setAccessible(true);
        $method->invoke($this->detenteController, $excludedDonatorId, $forceRefresh);
        
        // Vérifier les donateurs éligibles manuellement
        $lastThreeMonths = collect(range(0, 2))->map(fn($i) => now()->subMonths($i));
        echo "\nVérification manuelle des donateurs éligibles:\n";
        
        $donators = Donators::all();
        foreach ($donators as $donator) {
            $inDraw = Draw::where('donator_id', $donator->id)->exists();
            $inDetente = Detente::where('donator_id', $donator->id)->exists();
            $recentParticipation = Participations::where('user_id', $donator->id)
                ->where('last_detente', '>', now()->subYear())->exists();
            
            $donatedAllThreeMonths = true;
            echo "  Vérification des périodes pour {$donator->name}:\n";
            foreach ($lastThreeMonths as $date) {
                $periods = $donator->periods()
                    ->where('month', $date->month)
                    ->where('year', $date->year)
                    ->get();
                
                $hasDonation = $periods->count() > 0;
                echo "  - Mois {$date->month}/{$date->year}: " . ($hasDonation ? 'OUI' : 'NON') . " (" . $periods->count() . " périodes)\n";
                
                if (!$hasDonation) {
                    $donatedAllThreeMonths = false;
                }
            }
            
            // Vérifier toutes les périodes existantes
            $allPeriods = DonatorPeriod::where('donator_id', $donator->id)->get();
            echo "  Total périodes pour ce donateur: " . $allPeriods->count() . "\n";
            foreach ($allPeriods as $period) {
                echo "  - Période {$period->month}/{$period->year}\n";
            }
            
            echo "Donateur {$donator->id} ({$donator->name}): ";
            echo "inDraw=$inDraw, inDetente=$inDetente, recentParticipation=$recentParticipation, donatedAllThreeMonths=$donatedAllThreeMonths\n";
            
            $isEligible = !$inDraw && !$inDetente && !$recentParticipation && $donatedAllThreeMonths;
            echo "Éligible: " . ($isEligible ? 'OUI' : 'NON') . "\n";
        }
        
        return Potentials::all();
    }

    /**
     * Test qu'un donateur ayant fait des dons dans les 3 derniers mois est éligible
     */
    public function test_donator_with_donations_in_last_three_months_is_eligible()
    {
        // Créer un donateur
        $donator = Donators::factory()->create([
            'name' => 'Donateur Test',
            'email' => 'test@example.com'
        ]);
        
        // Créer un fond pour les transactions
        $fund = Fund::factory()->create();

        // Créer des périodes de don pour les 3 derniers mois (0, 1, 2 mois en arrière)
        for ($i = 0; $i <= 2; $i++) {
            $date = now()->subMonths($i);
            
            // Créer la période de don
            DonatorPeriod::create([
                'donator_id' => $donator->id,
                'month' => $date->month,
                'year' => $date->year
            ]);
            
            // Créer une transaction associée
            Transaction::create([
                'fund_id' => $fund->id,
                'month' => $date->month,
                'year' => $date->year,
                'date' => $date->format('Y-m-d'),
                'amount' => 100,
                'communication' => 'Test donation ' . $i
            ]);
        }

        // Appeler la méthode privée avec forceRefresh = true
        $potentials = $this->callGetPotentialsDetenteParticipants(null, true);

        // Vérifier que le donateur est dans les potentiels
        $this->assertCount(1, $potentials);
        $this->assertEquals($donator->id, $potentials->first()->donator_id);
    }

    /**
     * Test qu'un donateur sans dons dans l'un des 3 derniers mois n'est pas éligible
     */
    public function test_donator_missing_donation_in_one_month_is_not_eligible()
    {
        // Créer un donateur
        $donator = Donators::factory()->create([
            'name' => 'Donateur Incomplet',
            'email' => 'incomplet@example.com'
        ]);
        
        // Créer un fond pour les transactions
        $fund = Fund::factory()->create();

        // Créer des périodes de don pour seulement 2 des 3 derniers mois
        $date1 = now()->subMonths(1);
        DonatorPeriod::create([
            'donator_id' => $donator->id,
            'month' => $date1->month,
            'year' => $date1->year
        ]);
        
        Transaction::create([
            'fund_id' => $fund->id,
            'month' => $date1->month,
            'year' => $date1->year,
            'date' => $date1->format('Y-m-d'),
            'amount' => 100,
            'communication' => 'Test donation 1'
        ]);
        
        $date2 = now()->subMonths(3);
        DonatorPeriod::create([
            'donator_id' => $donator->id,
            'month' => $date2->month,
            'year' => $date2->year
        ]);
        
        Transaction::create([
            'fund_id' => $fund->id,
            'month' => $date2->month,
            'year' => $date2->year,
            'date' => $date2->format('Y-m-d'),
            'amount' => 100,
            'communication' => 'Test donation 3'
        ]);

        // Forcer le rafraîchissement des potentiels participants
        $this->detenteController->index(new \Illuminate\Http\Request(['refresh' => true]));

        // Vérifier que le donateur n'est pas dans les potentiels
        $potentials = \App\Models\Potentials::where('donator_id', $donator->id)->get();
        $this->assertCount(0, $potentials);
    }

    /**
     * Test qu'un donateur déjà dans la détente actuelle n'est pas éligible
     */
    public function test_donator_already_in_detente_is_not_eligible()
    {
        // Créer un donateur
        $donator = Donators::factory()->create([
            'name' => 'Donateur En Détente',
            'email' => 'detente@example.com'
        ]);
        
        // Créer un fond pour les transactions
        $fund = Fund::factory()->create();

        // Créer des périodes de don pour les 3 derniers mois (0, 1, 2 mois en arrière)
        for ($i = 0; $i <= 2; $i++) {
            $date = now()->subMonths($i);
            
            // Créer la période de don
            DonatorPeriod::create([
                'donator_id' => $donator->id,
                'month' => $date->month,
                'year' => $date->year
            ]);
            
            // Créer une transaction associée
            Transaction::create([
                'fund_id' => $fund->id,
                'month' => $date->month,
                'year' => $date->year,
                'date' => $date->format('Y-m-d'),
                'amount' => 100,
                'communication' => 'Test donation ' . $i
            ]);
        }

        // Ajouter le donateur à la détente actuelle
        Detente::create([
            'donator_id' => $donator->id,
            'name' => $donator->name,
            'participation' => 1
        ]);

        // Forcer le rafraîchissement des potentiels participants
        $this->detenteController->index(new \Illuminate\Http\Request(['refresh' => true]));

        // Vérifier que le donateur n'est pas dans les potentiels
        $potentials = \App\Models\Potentials::where('donator_id', $donator->id)->get();
        $this->assertCount(0, $potentials);
    }

    /**
     * Test qu'un donateur ayant participé à une détente il y a moins d'un an n'est pas éligible
     */
    public function test_donator_with_recent_participation_is_not_eligible()
    {
        // Créer un donateur
        $donator = Donators::factory()->create([
            'name' => 'Donateur Récent',
            'email' => 'recent@example.com'
        ]);
        
        // Créer un fond pour les transactions
        $fund = Fund::factory()->create();

        // Créer des périodes de don pour les 3 derniers mois (0, 1, 2 mois en arrière)
        for ($i = 0; $i <= 2; $i++) {
            $date = now()->subMonths($i);
            
            // Créer la période de don
            DonatorPeriod::create([
                'donator_id' => $donator->id,
                'month' => $date->month,
                'year' => $date->year
            ]);
            
            // Créer une transaction associée
            Transaction::create([
                'fund_id' => $fund->id,
                'month' => $date->month,
                'year' => $date->year,
                'date' => $date->format('Y-m-d'),
                'amount' => 100,
                'communication' => 'Test donation ' . $i
            ]);
        }

        // Ajouter une participation récente (moins d'un an)
        Participations::create([
            'user_id' => $donator->id,
            'name' => $donator->name,
            'last_detente' => now()->subMonths(6)->format('Y-m-d')
        ]);

        // Forcer le rafraîchissement des potentiels participants
        $this->detenteController->index(new \Illuminate\Http\Request(['refresh' => true]));

        // Vérifier que le donateur n'est pas dans les potentiels
        $potentials = \App\Models\Potentials::where('donator_id', $donator->id)->get();
        $this->assertCount(0, $potentials);
    }

    /**
     * Test qu'un donateur ayant participé à une détente il y a plus d'un an est éligible
     */
    public function test_donator_with_old_participation_is_eligible()
    {
        // Créer un donateur
        $donator = Donators::factory()->create([
            'name' => 'Donateur Ancien',
            'email' => 'ancien@example.com'
        ]);
        
        // Créer un fond pour les transactions
        $fund = Fund::factory()->create();

        // Créer des périodes de don pour les 3 derniers mois (0, 1, 2 mois en arrière)
        for ($i = 0; $i <= 2; $i++) {
            $date = now()->subMonths($i);
            
            // Créer la période de don
            DonatorPeriod::create([
                'donator_id' => $donator->id,
                'month' => $date->month,
                'year' => $date->year
            ]);
            
            // Créer une transaction associée
            Transaction::create([
                'fund_id' => $fund->id,
                'month' => $date->month,
                'year' => $date->year,
                'date' => $date->format('Y-m-d'),
                'amount' => 100,
                'communication' => 'Test donation ' . $i
            ]);
        }

        // Ajouter une participation ancienne (plus d'un an)
        Participations::create([
            'user_id' => $donator->id,
            'name' => $donator->name,
            'last_detente' => now()->subMonths(13)->format('Y-m-d')
        ]);

        // Appeler la méthode privée avec forceRefresh = true
        $potentials = $this->callGetPotentialsDetenteParticipants(null, true);

        // Vérifier que le donateur est dans les potentiels
        $this->assertCount(1, $potentials);
        $this->assertEquals($donator->id, $potentials->first()->donator_id);
    }

    /**
     * Test le scénario complet avec plusieurs donateurs dans différentes situations
     */
    public function test_complete_scenario_with_multiple_donators()
    {
        // Créer un fond pour toutes les transactions
        $fund = Fund::factory()->create();
        
        // 1. Donateur éligible (dons dans les 3 derniers mois, pas dans la détente actuelle, pas de participation récente)
        $eligibleDonator = Donators::factory()->create([
            'name' => 'Éligible',
            'email' => 'eligible@example.com'
        ]);
        
        // Créer des périodes de don pour les 3 derniers mois (0, 1, 2 mois en arrière)
        for ($i = 0; $i <= 2; $i++) {
            $date = now()->subMonths($i);
            
            // Créer la période de don
            DonatorPeriod::create([
                'donator_id' => $eligibleDonator->id,
                'month' => $date->month,
                'year' => $date->year
            ]);
            
            // Créer une transaction associée
            Transaction::create([
                'fund_id' => $fund->id,
                'month' => $date->month,
                'year' => $date->year,
                'date' => $date->format('Y-m-d'),
                'amount' => 100,
                'communication' => 'Test donation eligible ' . $i
            ]);
        }

        // 2. Donateur avec dons incomplets
        $incompleteDonator = Donators::factory()->create([
            'name' => 'Incomplet',
            'email' => 'incomplet2@example.com'
        ]);
        
        // Créer une seule période de don
        $date = now()->subMonths(1);
        DonatorPeriod::create([
            'donator_id' => $incompleteDonator->id,
            'month' => $date->month,
            'year' => $date->year
        ]);
        
        Transaction::create([
            'fund_id' => $fund->id,
            'month' => $date->month,
            'year' => $date->year,
            'date' => $date->format('Y-m-d'),
            'amount' => 100,
            'communication' => 'Test donation incomplet'
        ]);

        // 3. Donateur déjà dans la détente
        $inDetenteDonator = Donators::factory()->create([
            'name' => 'En Détente',
            'email' => 'detente2@example.com'
        ]);
        
        // Créer des périodes de don pour les 3 derniers mois (0, 1, 2 mois en arrière)
        for ($i = 0; $i <= 2; $i++) {
            $date = now()->subMonths($i);
            
            // Créer la période de don
            DonatorPeriod::create([
                'donator_id' => $inDetenteDonator->id,
                'month' => $date->month,
                'year' => $date->year
            ]);
            
            // Créer une transaction associée
            Transaction::create([
                'fund_id' => $fund->id,
                'month' => $date->month,
                'year' => $date->year,
                'date' => $date->format('Y-m-d'),
                'amount' => 100,
                'communication' => 'Test donation detente ' . $i
            ]);
        }
        
        Detente::create([
            'donator_id' => $inDetenteDonator->id,
            'name' => $inDetenteDonator->name,
            'participation' => 1
        ]);

        // 4. Donateur avec participation récente
        $recentParticipantDonator = Donators::factory()->create([
            'name' => 'Récent Participant',
            'email' => 'recent2@example.com'
        ]);
        
        // Créer des périodes de don pour les 3 derniers mois (0, 1, 2 mois en arrière)
        for ($i = 0; $i <= 2; $i++) {
            $date = now()->subMonths($i);
            
            // Créer la période de don
            DonatorPeriod::create([
                'donator_id' => $recentParticipantDonator->id,
                'month' => $date->month,
                'year' => $date->year
            ]);
            
            // Créer une transaction associée
            Transaction::create([
                'fund_id' => $fund->id,
                'month' => $date->month,
                'year' => $date->year,
                'date' => $date->format('Y-m-d'),
                'amount' => 100,
                'communication' => 'Test donation recent ' . $i
            ]);
        }
        
        Participations::create([
            'user_id' => $recentParticipantDonator->id,
            'name' => $recentParticipantDonator->name,
            'last_detente' => now()->subMonths(6)->format('Y-m-d')
        ]);

        // Appeler la méthode privée avec forceRefresh = true
        $potentials = $this->callGetPotentialsDetenteParticipants(null, true);

        // Vérifier que seul le donateur éligible est dans les potentiels
        $this->assertCount(1, $potentials);
        $this->assertEquals($eligibleDonator->id, $potentials->first()->donator_id);
    }
}
