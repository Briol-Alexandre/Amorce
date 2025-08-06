<?php

namespace Tests\Unit;

use App\Http\Controllers\DetenteController;
use App\Models\Detente;
use App\Models\Donators;
use App\Models\Fund;
use App\Models\Participations;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

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
     * Test qu'un donateur ayant fait des dons dans les 3 derniers mois est éligible
     */
    public function test_donator_with_donations_in_last_three_months_is_eligible()
    {
        // Créer un donateur
        $donator = Donators::factory()->create([
            'name' => 'Donateur Test'
        ]);
        
        // Créer un fond pour les transactions
        $fund = Fund::factory()->create();

        // Créer des transactions pour les 3 derniers mois
        for ($i = 1; $i <= 3; $i++) {
            Transaction::factory()->create([
                'fund_id' => $fund->id,
                'transactor' => $donator->name,
                'date' => now()->subMonths($i)->format('Y-m-d'),
                'amount' => 100
            ]);
        }

        // Exécuter la méthode à tester
        $result = $this->detenteController->getPotentialsDetenteParticipants();

        // Vérifier que le donateur est dans les résultats
        $this->assertCount(1, $result);
        $this->assertEquals($donator->id, $result[0]['donator_id']);
    }

    /**
     * Test qu'un donateur sans dons dans l'un des 3 derniers mois n'est pas éligible
     */
    public function test_donator_missing_donation_in_one_month_is_not_eligible()
    {
        // Créer un donateur
        $donator = Donators::factory()->create([
            'name' => 'Donateur Incomplet'
        ]);
        
        // Créer un fond pour les transactions
        $fund = Fund::factory()->create();

        // Créer des transactions pour seulement 2 des 3 derniers mois
        Transaction::factory()->create([
            'fund_id' => $fund->id,
            'transactor' => $donator->name,
            'date' => now()->subMonths(1)->format('Y-m-d'),
            'amount' => 100
        ]);
        
        Transaction::factory()->create([
            'fund_id' => $fund->id,
            'transactor' => $donator->name,
            'date' => now()->subMonths(3)->format('Y-m-d'),
            'amount' => 100
        ]);

        // Exécuter la méthode à tester
        $result = $this->detenteController->getPotentialsDetenteParticipants();

        // Vérifier que le donateur n'est pas dans les résultats
        $this->assertCount(0, $result);
    }

    /**
     * Test qu'un donateur déjà dans la détente actuelle n'est pas éligible
     */
    public function test_donator_already_in_detente_is_not_eligible()
    {
        // Créer un donateur
        $donator = Donators::factory()->create([
            'name' => 'Donateur En Détente'
        ]);
        
        // Créer un fond pour les transactions
        $fund = Fund::factory()->create();

        // Créer des transactions pour les 3 derniers mois
        for ($i = 1; $i <= 3; $i++) {
            Transaction::factory()->create([
                'fund_id' => $fund->id,
                'transactor' => $donator->name,
                'date' => now()->subMonths($i)->format('Y-m-d'),
                'amount' => 100
            ]);
        }

        // Ajouter le donateur à la détente actuelle
        Detente::factory()->create([
            'donator_id' => $donator->id,
            'name' => $donator->name
        ]);

        // Exécuter la méthode à tester
        $result = $this->detenteController->getPotentialsDetenteParticipants();

        // Vérifier que le donateur n'est pas dans les résultats
        $this->assertCount(0, $result);
    }

    /**
     * Test qu'un donateur ayant participé à une détente il y a moins d'un an n'est pas éligible
     */
    public function test_donator_with_recent_participation_is_not_eligible()
    {
        // Créer un donateur
        $donator = Donators::factory()->create([
            'name' => 'Donateur Récent'
        ]);
        
        // Créer un fond pour les transactions
        $fund = Fund::factory()->create();

        // Créer des transactions pour les 3 derniers mois
        for ($i = 1; $i <= 3; $i++) {
            Transaction::factory()->create([
                'fund_id' => $fund->id,
                'transactor' => $donator->name,
                'date' => now()->subMonths($i)->format('Y-m-d'),
                'amount' => 100
            ]);
        }

        // Ajouter une participation récente (moins d'un an)
        Participations::factory()->create([
            'user_id' => $donator->id,
            'name' => $donator->name,
            'last_detente' => now()->subMonths(6)->format('Y-m-d')
        ]);

        // Exécuter la méthode à tester
        $result = $this->detenteController->getPotentialsDetenteParticipants();

        // Vérifier que le donateur n'est pas dans les résultats
        $this->assertCount(0, $result);
    }

    /**
     * Test qu'un donateur ayant participé à une détente il y a plus d'un an est éligible
     */
    public function test_donator_with_old_participation_is_eligible()
    {
        // Créer un donateur
        $donator = Donators::factory()->create([
            'name' => 'Donateur Ancien'
        ]);
        
        // Créer un fond pour les transactions
        $fund = Fund::factory()->create();

        // Créer des transactions pour les 3 derniers mois
        for ($i = 1; $i <= 3; $i++) {
            Transaction::factory()->create([
                'fund_id' => $fund->id,
                'transactor' => $donator->name,
                'date' => now()->subMonths($i)->format('Y-m-d'),
                'amount' => 100
            ]);
        }

        // Ajouter une participation ancienne (plus d'un an)
        Participations::factory()->create([
            'user_id' => $donator->id,
            'name' => $donator->name,
            'last_detente' => now()->subMonths(13)->format('Y-m-d')
        ]);

        // Exécuter la méthode à tester
        $result = $this->detenteController->getPotentialsDetenteParticipants();

        // Vérifier que le donateur est dans les résultats
        $this->assertCount(1, $result);
        $this->assertEquals($donator->id, $result[0]['donator_id']);
    }

    /**
     * Test le scénario complet avec plusieurs donateurs dans différentes situations
     */
    public function test_complete_scenario_with_multiple_donators()
    {
        // Créer un fond pour toutes les transactions
        $fund = Fund::factory()->create();
        
        // 1. Donateur éligible (dons dans les 3 derniers mois, pas dans la détente actuelle, pas de participation récente)
        $eligibleDonator = Donators::factory()->create(['name' => 'Éligible']);
        for ($i = 1; $i <= 3; $i++) {
            Transaction::factory()->create([
                'fund_id' => $fund->id,
                'transactor' => $eligibleDonator->name,
                'date' => now()->subMonths($i)->format('Y-m-d'),
                'amount' => 100
            ]);
        }

        // 2. Donateur avec dons incomplets
        $incompleteDonator = Donators::factory()->create(['name' => 'Incomplet']);
        Transaction::factory()->create([
            'fund_id' => $fund->id,
            'transactor' => $incompleteDonator->name,
            'date' => now()->subMonths(1)->format('Y-m-d'),
            'amount' => 100
        ]);

        // 3. Donateur déjà dans la détente
        $inDetenteDonator = Donators::factory()->create(['name' => 'En Détente']);
        for ($i = 1; $i <= 3; $i++) {
            Transaction::factory()->create([
                'fund_id' => $fund->id,
                'transactor' => $inDetenteDonator->name,
                'date' => now()->subMonths($i)->format('Y-m-d'),
                'amount' => 100
            ]);
        }
        Detente::factory()->create([
            'donator_id' => $inDetenteDonator->id,
            'name' => $inDetenteDonator->name
        ]);

        // 4. Donateur avec participation récente
        $recentParticipantDonator = Donators::factory()->create(['name' => 'Récent Participant']);
        for ($i = 1; $i <= 3; $i++) {
            Transaction::factory()->create([
                'fund_id' => $fund->id,
                'transactor' => $recentParticipantDonator->name,
                'date' => now()->subMonths($i)->format('Y-m-d'),
                'amount' => 100
            ]);
        }
        Participations::factory()->create([
            'user_id' => $recentParticipantDonator->id,
            'name' => $recentParticipantDonator->name,
            'last_detente' => now()->subMonths(6)->format('Y-m-d')
        ]);

        // Exécuter la méthode à tester
        $result = $this->detenteController->getPotentialsDetenteParticipants();

        // Vérifier que seul le donateur éligible est dans les résultats
        $this->assertCount(1, $result);
        $this->assertEquals($eligibleDonator->id, $result[0]['donator_id']);
    }
}
