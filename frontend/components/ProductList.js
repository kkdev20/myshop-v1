import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useCart } from '../context/CartContext'
import ProductFilters from './ProductFilters'
import ProductPagination from './ProductPagination'
import formatCurrency from '../utils/formatCurrency'

export default function ProductList({ initialItems = [], categories = [] }) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(initialItems.length)
  
  // Get current page and per_page from URL
  const page = parseInt(router.query.page || '1')
  const perPage = parseInt(router.query.per_page || '5')
  const searchTerm = router.query.search || ''

  // Fetch products when filters change
  useEffect(() => {
    if (!router.isReady) return

    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams(router.query)
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
        const res = await fetch(`${base}/products?${params}`)
        if (!res.ok) throw new Error('Failed to load products')
        const data = await res.json()
        const products = data.data || data || []
        setItems(products)
        setTotal(products.length)
      } catch (err) {
        console.error('Error loading products:', err)
        setError('Error loading products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [router.query, router.isReady])

  // Show loading state
  if (loading) {
    return <div data-cy="loading-indicator" className="text-center py-12">Loading...</div>
  }

  // Show error state
  if (error) {
    return <div className="text-red-600 py-12">{error}</div>
  }

  // Show empty state
  if (!items.length) {
    if (searchTerm) {
      return <p className="text-gray-600 py-12">No products found matching your search</p>
    }
    return <p className="text-gray-600 py-12">No products found</p>
  }

  return (
    <div>
      {/* Filters */}
      <ProductFilters 
        categories={categories}
        activeCategory={router.query.category}
        activePriceMin={router.query.min_price}
        activePriceMax={router.query.max_price}
        searchTerm={searchTerm}
      />

      {/* Product Grid */}
      <div data-cy="product-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <ProductPagination 
          total={total}
          currentPage={page}
          perPage={perPage}
        />
      </div>
    </div>
  )
}

function ProductCard({ product }) {
  const { addItem } = useCart()
  return (
    <div data-cy="product-item" className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm flex flex-col">
      <div className="h-44 w-full bg-gray-50">
        {product.image ? (
          <img data-cy="product-image" src={product.image} alt={product.name} className="h-44 w-full object-cover" />
        ) : (
          <div data-cy="product-no-image" className="h-44 w-full flex items-center justify-center text-gray-400">No image</div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 data-cy="product-name" className="text-lg font-medium mb-1">{product.name}</h3>
          <p data-cy="product-category" className="text-sm text-gray-500 mb-2">{product.category?.name ?? ''}</p>
          <p data-cy="product-price" className="text-indigo-600 font-semibold">
            {formatCurrency(product.price)}
          </p>
          <p data-cy="product-stock" className="text-sm text-gray-500 mt-2">Stock: {product.stock}</p>
        </div>
        <div className="mt-4">
          <button 
            data-cy="add-to-cart"
            onClick={() => addItem(product, 1)} 
            disabled={product.stock <= 0} 
            className={`w-full ${product.stock > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'} py-2 rounded`}
          >
            {product.stock > 0 ? 'Add to cart' : 'Out of stock'}
          </button>
        </div>
      </div>
    </div>
  )
}
