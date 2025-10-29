<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Product;
use App\Models\Order;
use App\Jobs\SendOrderNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_creates_order()
    {
        Queue::fake();

        $product = Product::factory()->create(['price' => 10000, 'stock' => 10]);

        $payload = [
            'name' => 'Test Buyer',
            'address' => 'Jalan Test 1',
            'whatsapp' => '08123456789',
            'payment_method' => 'COD',
            'items' => [
                ['product_id' => $product->id, 'qty' => 2],
            ],
        ];

        $response = $this->postJson('/api/orders', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'name', 'total', 'items']);

        $this->assertDatabaseHas('orders', ['name' => 'Test Buyer']);

        $orderId = $response->json('id');
        Queue::assertPushed(SendOrderNotification::class, function ($job) use ($orderId) {
            return isset($job->order) && $job->order->id === $orderId;
        });
    }

    public function test_index_returns_orders()
    {
        // Create an order through the API to ensure consistency
        Queue::fake();

        $product = Product::factory()->create(['price' => 5000, 'stock' => 5]);

        $payload = [
            'name' => 'Buyer 2',
            'address' => 'Alamat 2',
            'whatsapp' => '08122334455',
            'payment_method' => 'Transfer',
            'items' => [
                ['product_id' => $product->id, 'qty' => 1],
            ],
        ];

        $resp = $this->postJson('/api/orders', $payload);
        $resp->assertStatus(201);

        $orderId = $resp->json('id');
        Queue::assertPushed(SendOrderNotification::class, function ($job) use ($orderId) {
            return isset($job->order) && $job->order->id === $orderId;
        });

        $response = $this->getJson('/api/orders');

        $response->assertStatus(200)->assertJsonStructure(['data']);
    }
}
