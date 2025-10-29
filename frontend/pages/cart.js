import React from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'
import formatCurrency from '../utils/formatCurrency'

export default function CartPage() {
  const { items, removeItem, updateQty } = useCart()

  const subtotal = items.reduce((s, i) => s + (i.price || 0) * (i.qty || 0), 0)
  
  // format helper
  

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Cart</h1>
      {items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty. <Link href="/" className="text-indigo-600">Continue shopping</Link></p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ul className="space-y-4">
              {items.map((it) => (
                <li data-cy="cart-item" key={it.id} className="bg-white border border-gray-100 rounded p-4 flex justify-between items-center">
                  <div>
                    <div data-cy="product-name" className="font-medium">{it.name}</div>
                    <div className="text-sm text-gray-500">{it.category?.name ?? ''}</div>
                    <div data-cy="product-price" className="text-sm text-gray-700">{formatCurrency(it.price)}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <input 
                      data-cy="product-quantity"
                      type="number" 
                      min="1" 
                      value={it.qty} 
                      onChange={(e) => updateQty(it.id, Math.max(1, parseInt(e.target.value || 1)))} 
                      className="w-20 border rounded px-2 py-1" 
                    />
                    <button data-cy="remove-item" onClick={() => removeItem(it.id)} className="text-sm text-red-600">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="bg-white border border-gray-100 rounded p-4">
            <h3 className="font-semibold mb-2">Summary</h3>
            <div data-cy="cart-total" className="text-lg font-bold mb-4">{formatCurrency(subtotal)}</div>
            <Link href="/checkout" data-cy="checkout-button" className="block btn text-center">Proceed to Checkout</Link>
          </aside>
        </div>
      )}
    </div>
  )
}
