<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendOrderNotification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'whatsapp' => 'required|string',
            'payment_method' => 'required|in:COD,Transfer',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
        ]);

        // Pre-check stock availability before creating order
        $productsMap = [];
        foreach ($data['items'] as $item) {
            $product = Product::find($item['product_id']);
            if (! $product) {
                return response()->json(['message' => 'Product not found: ' . $item['product_id']], 404);
            }

            $qty = (int) $item['qty'];
            if ($product->stock < $qty) {
                return response()->json(['message' => 'Insufficient stock for product: ' . $product->name], 422);
            }

            $productsMap[$product->id] = $product;
        }

        $order = DB::transaction(function () use ($data, $productsMap) {
            $order = Order::create([
                'name' => $data['name'],
                'address' => $data['address'],
                'whatsapp' => $data['whatsapp'],
                'payment_method' => $data['payment_method'],
                'total' => 0,
                'status' => 'pending',
            ]);

            $total = 0;

            foreach ($data['items'] as $item) {
                $product = $productsMap[$item['product_id']];
                $qty = (int) $item['qty'];
                $price = $product->price;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $qty,
                    'price' => $price,
                ]);

                // decrement stock
                $product->decrement('stock', $qty);

                $total += $price * $qty;
            }

            $order->update(['total' => $total]);

            return $order;
        });

        // dispatch notification job
        SendOrderNotification::dispatch($order);

        return response()->json($order->load('items.product'), 201);
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 20);
        $orders = Order::with('items.product')->latest()->paginate($perPage);
        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::with('items.product')->find($id);
        if (! $order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        return response()->json($order);
    }
}
