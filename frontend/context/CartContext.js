import React, { createContext, useContext, useEffect, useState } from 'react'
import { useToast } from './ToastContext'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const { showToast } = useToast()

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart_items')
      if (raw) setItems(JSON.parse(raw))
    } catch (e) {
      console.error('Failed to load cart from storage', e)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('cart_items', JSON.stringify(items))
    } catch (e) {
      console.error('Failed to save cart to storage', e)
    }
  }, [items])

  function addItem(product, qty = 1) {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id)
      if (idx === -1) return [...prev, { ...product, qty }]
      const next = [...prev]
      next[idx].qty = Math.min((next[idx].qty || 0) + qty, product.stock || 99999)
      return next
    })
    // notify user
    try {
      showToast(`${product.name} ditambahkan ke keranjang`, { type: 'success', duration: 3000 })
    } catch (e) {
      // ignore if toast not available
    }
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((p) => p.id !== productId))
  }

  function updateQty(productId, qty) {
    setItems((prev) => prev.map((p) => (p.id === productId ? { ...p, qty } : p)))
  }

  function clear() {
    setItems([])
  }

  const value = { items, addItem, removeItem, updateQty, clear }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartContext
