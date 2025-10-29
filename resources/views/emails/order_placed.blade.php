<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Order</title>
</head>
<body>
  <h2>New Order #{{ $order->id }}</h2>
  <p>Name: {{ $order->name }}</p>
  <p>WhatsApp: {{ $order->whatsapp }}</p>
  <p>Address: {{ $order->address }}</p>
  <p>Payment method: {{ $order->payment_method }}</p>
  <p>Total: {{ $order->total }}</p>

  <h3>Items</h3>
  <ul>
    @foreach($order->items as $item)
      <li>{{ $item->product->name }} x {{ $item->quantity }} — {{ $item->price }}</li>
    @endforeach
  </ul>
</body>
</html>
