<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->with('category');

        if ($request->query('category')) {
            $query->where('category_id', (int) $request->query('category'));
        }

        if ($request->query('search')) {
            $query->where('name', 'like', '%' . $request->query('search') . '%');
        }

        if ($request->query('min_price')) {
            $query->where('price', '>=', (float) $request->query('min_price'));
        }

        if ($request->query('max_price')) {
            $query->where('price', '<=', (float) $request->query('max_price'));
        }

        $perPage = (int) $request->query('per_page', 12);
        $products = $query->orderBy('id')->paginate($perPage);

        return ProductResource::collection($products);
    }

    public function show($id)
    {
        $product = Product::with('category')->find($id);

        if (! $product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Return resolved array to avoid an outer `data` wrapper so tests that
        // expect fields at the root (e.g. 'id') pass.
        return response()->json((new ProductResource($product))->resolve());
    }
}
