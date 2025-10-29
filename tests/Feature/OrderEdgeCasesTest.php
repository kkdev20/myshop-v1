<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use App\Jobs\SendOrderNotification;

class OrderEdgeCasesTest extends TestCase
{
    use RefreshDatabase;

    public function test_insufficient_stock_returns_422()
    {
        Queue::fake();

        $product = Product::factory()->create(['price' => 10000, 'stock' => 1]);

        $payload = [
            'name' => 'Buyer',
            'address' => 'Addr',
            'whatsapp' => '081234',
            'payment_method' => 'COD',
            'items' => [
                ['product_id' => $product->id, 'qty' => 2],
            ],
        ];

        $response = $this->postJson('/api/orders', $payload);

        $response->assertStatus(422);
        $this->assertStringContainsString('Insufficient stock', $response->json('message'));

        // ensure no job was dispatched
        Queue::assertNotPushed(SendOrderNotification::class);
    }

    public function test_invalid_product_id_returns_validation_error()
    {
        $payload = [
            'name' => 'Buyer',
            'address' => 'Addr',
            'whatsapp' => '081234',
            'payment_method' => 'COD',
            'items' => [
                ['product_id' => 999999, 'qty' => 1],
            ],
        ];

        $response = $this->postJson('/api/orders', $payload);

        $response->assertStatus(422);
        $this->assertArrayHasKey('items.0.product_id', $response->json('errors') ?? []);
    }

    public function test_invalid_qty_returns_validation_error()
    {
        $product = Product::factory()->create(['stock' => 10]);

        $payload = [
            'name' => 'Buyer',
            'address' => 'Addr',
            'whatsapp' => '081234',
            'payment_method' => 'COD',
            'items' => [
                ['product_id' => $product->id, 'qty' => 0],
            ],
        ];

        $response = $this->postJson('/api/orders', $payload);

        $response->assertStatus(422);
        $this->assertArrayHasKey('items.0.qty', $response->json('errors') ?? []);
    }

    public function test_stock_decrements_and_total_is_correct()
    {
        Queue::fake();

        $product = Product::factory()->create(['price' => 5000, 'stock' => 5]);

        $payload = [
            'name' => 'Buyer',
            'address' => 'Addr',
            'whatsapp' => '081234',
            'payment_method' => 'Transfer',
            'items' => [
                ['product_id' => $product->id, 'qty' => 3],
            ],
        ];

        $response = $this->postJson('/api/orders', $payload);

        $response->assertStatus(201);

        // Check product stock decremented
        $product->refresh();
        $this->assertEquals(2, $product->stock);

        // Check total
        $orderData = $response->json();
        $this->assertEquals(5000 * 3, $orderData['total']);

        // ensure job dispatched with correct order id
        $orderId = $orderData['id'];
        Queue::assertPushed(SendOrderNotification::class, function ($job) use ($orderId) {
            return isset($job->order) && $job->order->id === $orderId;
        });
    }

    public function test_sequential_orders_second_fails_when_stock_exhausted()
    {
        Queue::fake();

        $product = Product::factory()->create(['price' => 2000, 'stock' => 2]);

        $payload1 = [
            'name' => 'A',
            'address' => 'Addr',
            'whatsapp' => '081',
            'payment_method' => 'COD',
            'items' => [ ['product_id' => $product->id, 'qty' => 2] ],
        ];

        $payload2 = [
            'name' => 'B',
            'address' => 'Addr',
            'whatsapp' => '082',
            'payment_method' => 'COD',
            'items' => [ ['product_id' => $product->id, 'qty' => 1] ],
        ];


        $resp1 = $this->postJson('/api/orders', $payload1);
        $resp1->assertStatus(201);

        $order1Id = $resp1->json('id');
        Queue::assertPushed(SendOrderNotification::class, function ($job) use ($order1Id) {
            return isset($job->order) && $job->order->id === $order1Id;
        });

    // second attempt should fail because stock is 0 now
    $response2 = $this->postJson('/api/orders', $payload2);
    $response2->assertStatus(422);
    $this->assertStringContainsString('Insufficient stock', $response2->json('message'));
    }
}
