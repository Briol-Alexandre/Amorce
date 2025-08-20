<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    protected $model = Event::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'date' => fake()->dateTimeBetween('-30 days', '+30 days'),
        ];
    }

    /**
     * Past events state.
     */
    public function past(): static
    {
        return $this->state(fn () => [
            'date' => fake()->dateTimeBetween('-60 days', 'yesterday'),
        ]);
    }

    /**
     * Upcoming events state.
     */
    public function upcoming(): static
    {
        return $this->state(fn () => [
            'date' => fake()->dateTimeBetween('now', '+60 days'),
        ]);
    }
}
