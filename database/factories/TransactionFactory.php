<?php

namespace Database\Factories;

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
        return [
            'transactor' => fake()->name,
            'amount' => fake()->numberBetween(10, 250),
            'date' => fake()->dateTime(),
            'fund_id'=> fake()->numberBetween(1,2),
        ];
    }
}
