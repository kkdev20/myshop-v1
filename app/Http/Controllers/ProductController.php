<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
            $query = Product::query()->with('category');

            if ($request->query('category')) {
            $query->where('category_id', (int)$request->query('category')); 
            }

            if ($request->query('search')) {
            $query->where('name', 'like', '%' . $request->query('search') . '%');
            }

            if ($request->query('min_price')) {
            $query->where('price', '>=', (float)$request->query('min_price'));
            }

            if ($request->query('max_price')) {
            $query->where('price', '<=', (float)$request->query('max_price'));
            }

                return ProductResource::collection($query->orderBy('id')->get());
    }

    public function show(Product $product)
    {
        $product->load('category');
        return new ProductResource($product);
    }
}