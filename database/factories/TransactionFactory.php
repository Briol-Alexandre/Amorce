<?php

namespace Database\Factories;

use App\Models\Fund;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Générer un numéro de compte au format IBAN (simplifié)
        $accountNumber = 'BE' . fake()->numerify('##') . ' ' . 
                        fake()->numerify('####') . ' ' . 
                        fake()->numerify('####') . ' ' . 
                        fake()->numerify('####');
        
        return [
            'fund_id' => Fund::factory(),
            'transactor' => $accountNumber, // Utiliser le numéro de compte comme transactor
            'amount' => fake()->numberBetween(10, 250),
            'date' => fake()->dateTime(),
            'communication' => fake()->sentence(4),
        ];
    }
}
