<?php

namespace Tests\Unit;

use App\Http\Controllers\DetenteController;
use App\Models\Detente;
use App\Models\Donators;
use App\Models\DonatorPeriod;
use App\Models\Fund;
use App\Models\Participations;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DonatorPeriodTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test la création d'un donateur avec des périodes de don
     */
    public function test_create_donator_with_periods()
    {
        // Créer un donateur
        $donator = Donators::factory()->create([
            'name' => 'Donateur Test',
            'email' => 'test@example.com',
            'phone' => '+32123456789'
        ]);
        
        // Créer un fond pour les transactions
        $fund = Fund::factory()->create();

        // Créer des périodes de don pour les 3 derniers mois
        for ($i = 1; $i <= 3; $i++) {
            $date = now()->subMonths($i);
            
            // Créer la période de don
            $period = DonatorPeriod::create([
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

        // Vérifier que le donateur a bien 3 périodes de don
        $this->assertEquals(3, $donator->periods()->count());
        
        // Vérifier que les périodes sont correctement liées au donateur
        $this->assertEquals($donator->id, $donator->periods()->first()->donator_id);
        
        // Vérifier que les transactions ont bien été créées
        $this->assertEquals(3, Transaction::count());
        
        // Vérifier que les transactions ont les bons mois et années
        $lastMonth = now()->subMonths(1);
        $transaction = Transaction::where('month', $lastMonth->month)
            ->where('year', $lastMonth->year)
            ->first();
        
        $this->assertNotNull($transaction);
        $this->assertEquals(100, $transaction->amount);
    }

    /**
     * Test la vérification d'unicité des périodes de don
     */
    public function test_donator_period_uniqueness()
    {
        // Créer un donateur
        $donator = Donators::factory()->create([
            'name' => 'Donateur Unique',
            'email' => 'unique@example.com'
        ]);
        
        $date = now();
        
        // Créer une première période
        $period1 = DonatorPeriod::create([
            'donator_id' => $donator->id,
            'month' => $date->month,
            'year' => $date->year
        ]);
        
        // Essayer de créer une période identique (même donateur, même mois, même année)
        try {
            $period2 = DonatorPeriod::create([
                'donator_id' => $donator->id,
                'month' => $date->month,
                'year' => $date->year
            ]);
            
            // Si on arrive ici, c'est que la contrainte d'unicité n'a pas fonctionné
            $this->fail('La contrainte d\'unicité n\'a pas fonctionné');
        } catch (\Exception $e) {
            // Vérifier qu'une exception a bien été levée
            $this->assertStringContainsString('Integrity constraint violation', $e->getMessage());
        }
        
        // Vérifier qu'il n'y a qu'une seule période pour ce donateur
        $this->assertEquals(1, $donator->periods()->count());
    }

    /**
     * Test la relation entre Donators et DonatorPeriod
     */
    public function test_donator_period_relationship()
    {
        // Créer un donateur
        $donator = Donators::factory()->create([
            'name' => 'Donateur Relation',
            'email' => 'relation@example.com',
            'phone' => '+32987654321'
        ]);
        
        // Créer plusieurs périodes pour ce donateur
        $date1 = now()->subMonths(1);
        $date2 = now()->subMonths(2);
        
        $period1 = DonatorPeriod::create([
            'donator_id' => $donator->id,
            'month' => $date1->month,
            'year' => $date1->year
        ]);
        
        $period2 = DonatorPeriod::create([
            'donator_id' => $donator->id,
            'month' => $date2->month,
            'year' => $date2->year
        ]);
        
        // Vérifier que le donateur a bien 2 périodes
        $this->assertEquals(2, $donator->periods()->count());
        
        // Vérifier que les périodes sont bien liées au bon donateur
        foreach ($donator->periods as $period) {
            $this->assertEquals($donator->id, $period->donator_id);
        }
        
        // Vérifier qu'on peut accéder au donateur depuis la période
        $this->assertEquals($donator->name, $period1->donator->name);
        $this->assertEquals($donator->email, $period1->donator->email);
    }
}
