<?php

namespace Database\Factories;

use App\Models\Fund;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Fund>
 */
class FundFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'iban' => fake()->iban(),
            'description' => fake()->sentence('10'),
            'permanent' => boolVal(true),
            'amount' => fake()->numberBetween(0, 5000),
            'raise' => fake()->numberBetween(-100, 100),
        ];
    }
}
