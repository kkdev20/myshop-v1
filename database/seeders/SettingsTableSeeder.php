<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingsTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('settings')->updateOrInsert(
            ['key' => 'bank_account'],
            ['value' => json_encode(['bank' => 'BCA', 'account' => '1234567890', 'name' => 'MyShop']), 'created_at' => now(), 'updated_at' => now()]
        );
    }
}
