<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Category;
use App\Models\Product;

class ProductsTableSeeder extends Seeder
{
    public function run()
    {
        $categories = [
            'Default',
            'Elektronik',
            'Pakaian',
        ];

        $categoryIds = [];
        foreach ($categories as $name) {
            $slug = Str::slug($name);
            $cat = Category::firstOrCreate([
                'slug' => $slug,
            ], [
                'name' => $name,
                'slug' => $slug,
            ]);

            $categoryIds[$name] = $cat->id;
        }

        $products = [
            [
                'category' => 'Default',
                'name' => 'Contoh Produk A',
                'description' => 'Produk contoh untuk demo',
                'price' => 10000,
                'stock' => 10,
                'image' => 'products/01K8KQA4EGDYN6NADCEH21WBAG.png',
            ],
            [
                'category' => 'Default',
                'name' => 'Contoh Produk B',
                'description' => 'Produk contoh lain untuk demo',
                'price' => 20000,
                'stock' => 5,
                'image' => 'products/01K8KQS7Y94CSRMPK9EJVC5SQ7.png',
            ],
            [
                'category' => 'Elektronik',
                'name' => 'Earphone Wireless',
                'description' => 'Earphone bluetooth kualitas bagus',
                'price' => 150000,
                'stock' => 20,
                'image' => 'products/01K8KRFEA8RDTD07Z48FZF3SYJ.png',
            ],
            [
                'category' => 'Pakaian',
                'name' => 'Kaos Polos Putih',
                'description' => 'Kaos polos cotton combed',
                'price' => 50000,
                'stock' => 30,
                'image' => 'products/01K8KRQZ7TRPQRPC388MEW9AZ0.png',
            ],
        ];

        foreach ($products as $p) {
            Product::firstOrCreate([
                'slug' => Str::slug($p['name']),
            ], [
                'category_id' => $categoryIds[$p['category']] ?? $categoryIds['Default'],
                'name' => $p['name'],
                'slug' => Str::slug($p['name']),
                'description' => $p['description'],
                'price' => $p['price'],
                'stock' => $p['stock'],
                'image' => $p['image'],
            ]);
        }
    }
}
