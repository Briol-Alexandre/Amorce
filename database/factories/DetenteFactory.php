<?php

namespace Database\Factories;

use App\Models\Detente;
use App\Models\Donators;
use Illuminate\Database\Eloquent\Factories\Factory;

class DetenteFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Detente::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'donator_id' => Donators::factory(),
            'participation' => $this->faker->numberBetween(0, 2),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
