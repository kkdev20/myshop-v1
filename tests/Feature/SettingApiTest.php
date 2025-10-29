<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SettingApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_settings()
    {
        // create a known setting (non-json value)
        Setting::factory()->create(['key' => 'site_name', 'value' => 'MyShop']);

        $response = $this->getJson('/api/settings');

        $response->assertStatus(200)->assertJsonFragment(['site_name' => 'MyShop']);
    }

    public function test_show_bank_account_setting()
    {
        // bankAccount endpoint expects JSON-encoded value, return decoded structure
        $payload = ['account' => 'BCA 123456', 'name' => 'John'];
        Setting::factory()->create(['key' => 'bank_account', 'value' => json_encode($payload)]);

        $response = $this->getJson('/api/settings/bank_account');

        $response->assertStatus(200)->assertJsonFragment(['account' => 'BCA 123456']);
    }
}
