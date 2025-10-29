<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_products()
    {
        $category = Category::factory()->create([
            'name' => 'Test Category'
        ]);
        
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Test Product',
            'price' => 10000,
            'stock' => 5
        ]);

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    [
                        'id' => $product->id,
                        'name' => 'Test Product',
                        'price' => '10000.00',  // Expect the price as a string
                        'stock' => 5,
                        'category' => [
                            'name' => 'Test Category'
                        ]
                    ]
                ]
            ]);
    }

    public function test_can_get_product_by_id()
    {
        $category = Category::factory()->create([
            'name' => 'Test Category'
        ]);
        
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Test Product',
            'price' => 10000
        ]);

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJsonPath('id', $product->id)
            ->assertJsonPath('name', 'Test Product')
            ->assertJsonPath('price', '10000.00')  // Expecting price as a string
            ->assertJsonPath('category.name', 'Test Category');
    }

    public function test_returns_404_when_product_not_found()
    {
        $response = $this->getJson('/api/products/999');
        
        $response->assertStatus(404)
            ->assertJson([
                'message' => 'Product not found'
            ]);
    }

    public function test_can_filter_products_by_category()
    {
        $category1 = Category::factory()->create(['name' => 'Category 1']);
        $category2 = Category::factory()->create(['name' => 'Category 2']);
        
        $product1 = Product::factory()->create([
            'category_id' => $category1->id,
            'name' => 'Product in Category 1'
        ]);
        
        $product2 = Product::factory()->create([
            'category_id' => $category2->id,
            'name' => 'Product in Category 2'
        ]);

        $response = $this->getJson("/api/products?category={$category1->id}");
        $responseData = $response->json();

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJson([
                'data' => [
                    [
                        'name' => 'Product in Category 1',
                        'category' => [
                            'id' => $category1->id
                        ]
                    ]
                ]
            ]);

        $this->assertFalse(collect($responseData['data'] ?? [])->contains('name', 'Product in Category 2'));
    }

    public function test_can_search_products_by_name()
    {
        $category = Category::factory()->create();
        
        Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Unique Product Name ABC'
        ]);
        
        Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Different Product XYZ'
        ]);

        $response = $this->getJson('/api/products?search=ABC');
        $responseData = $response->json();
        
        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJson([
                'data' => [
                    [
                        'name' => 'Unique Product Name ABC'
                    ]
                ]
            ]);

        $this->assertFalse(collect($responseData['data'] ?? [])->contains('name', 'Different Product XYZ'));
    }

    public function test_can_filter_products_by_price_range()
    {
        $category = Category::factory()->create();
        
        Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Cheap Product',
            'price' => 50000
        ]);
        
        Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Expensive Product',
            'price' => 150000
        ]);

        $response = $this->getJson('/api/products?min_price=100000');
        $responseData = $response->json();
        
        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJson([
                'data' => [
                    [
                        'name' => 'Expensive Product'
                    ]
                ]
            ]);

        $this->assertFalse(collect($responseData['data'] ?? [])->contains('name', 'Cheap Product'));
    }
}
