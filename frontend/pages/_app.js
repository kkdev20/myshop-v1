import React from 'react'
import '../styles/globals.css'
import { CartProvider, useCart } from '../context/CartContext'
import { ToastProvider } from '../context/ToastContext'
import Link from 'next/link'

function Header() {
  const { items } = useCart()
  const count = items.reduce((s, i) => s + (i.qty || 0), 0)
  return (
    <header className="bg-white shadow-sm">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="text-lg font-bold">MyShop</Link>
        <div className="flex items-center gap-4">
          <Link href="/cart" data-cy="cart-link" className="text-sm text-gray-700">
            Cart <span data-cy="cart-count" className="ml-1 inline-block bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs">{count}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider>
      <CartProvider>
        <HeaderWrapper>
          <Component {...pageProps} />
        </HeaderWrapper>
      </CartProvider>
    </ToastProvider>
  )
}

function HeaderWrapper({ children }) {
  return (
    <>
      <Header />
      <div style={{ padding: '0 24px' }}>{children}</div>
    </>
  )
}

export default MyApp
