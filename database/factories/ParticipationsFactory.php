<?php

namespace Database\Factories;

use App\Models\Donators;
use App\Models\Participations;
use Illuminate\Database\Eloquent\Factories\Factory;

class ParticipationsFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Participations::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'user_id' => Donators::factory(),
            'last_detente' => now()->subMonths($this->faker->numberBetween(1, 18)),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
