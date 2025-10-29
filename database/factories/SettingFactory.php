<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SettingFactory extends Factory
{
    protected $model = \App\Models\Setting::class;

    public function definition()
    {
        $key = $this->faker->unique()->word;

        return [
            'key' => $key,
            'value' => $this->faker->sentence(),
        ];
    }
}
