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
        return [
            'fund_id' => Fund::factory(),
            'transactor' => fake()->name(),
            'amount' => fake()->numberBetween(10, 250),
            'date' => fake()->dateTime(),
            'communication' => fake()->sentence(4),
        ];
    }
}
