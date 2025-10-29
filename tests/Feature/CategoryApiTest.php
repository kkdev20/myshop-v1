<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_categories()
    {
        Category::factory()->count(4)->create();

        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)->assertJsonStructure(['data']);
    }

    public function test_show_returns_category()
    {
        $category = Category::factory()->create(['name' => 'TestCat']);

        $response = $this->getJson('/api/categories/' . $category->id);

        $response->assertStatus(200)->assertJsonFragment(['id' => $category->id, 'name' => $category->name]);
    }
}
