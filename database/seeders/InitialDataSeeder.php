<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class InitialDataSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            ProductsTableSeeder::class,
            SettingsTableSeeder::class,
        ]);
    }
}
