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
        $platforms = ['Zoom', 'Microsoft Teams', 'Discord', 'Présentiel', null];
        $platform = fake()->randomElement($platforms);

        return [
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'platform' => $platform,
            'meeting_link' => $platform && $platform !== 'Présentiel' ? fake()->url() : null,
            'date' => fake()->dateTimeBetween('-30 days', '+30 days')->format('Y-m-d'),
            'time' => fake()->time(),
            'user_id' => 1,
        ];
    }

    /**
     * Past events state.
     */
    public function past(): static
    {
        return $this->state(fn() => [
            'date' => fake()->dateTimeBetween('-60 days', 'yesterday')->format('Y-m-d'),
        ]);
    }

    /**
     * Upcoming events state.
     */
    public function upcoming(): static
    {
        return $this->state(fn() => [
            'date' => fake()->dateTimeBetween('now', '+60 days')->format('Y-m-d'),
        ]);
    }
}
