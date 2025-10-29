<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 20);
        $categories = Category::withCount('products')->paginate($perPage);
        return response()->json($categories);
    }

    public function show($id)
    {
        $category = Category::with('products')->find($id);
        if (! $category) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        return response()->json($category);
    }
}
