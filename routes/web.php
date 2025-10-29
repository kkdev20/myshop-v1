<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\SettingController;

Route::get('/', function () {
    return view('welcome');
});

// Simple API routes (use API middleware so CSRF is not required)
Route::middleware('api')->prefix('api')->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class])->group(function () {
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{id}', [ProductController::class, 'show']);
    Route::get('categories', [\App\Http\Controllers\Api\CategoryController::class, 'index']);
    Route::get('categories/{id}', [\App\Http\Controllers\Api\CategoryController::class, 'show']);
    Route::post('orders', [OrderController::class, 'store']);
    Route::get('orders', [OrderController::class, 'index']);
    Route::get('orders/{id}', [OrderController::class, 'show']);
    Route::get('settings/bank_account', [SettingController::class, 'bankAccount']);
    Route::get('settings', [SettingController::class, 'index']);
    Route::get('settings/{key}', [SettingController::class, 'show']);
});

// Temporary debug route to inspect latest order (remove in production)
Route::get('debug/last-order', function () {
    return App\Models\Order::with('items.product')->latest()->first();
});
