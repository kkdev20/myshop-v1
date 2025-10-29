import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function ProductFilters({ categories = [] }) {
  const router = useRouter()
  const { query } = router

  // Internal form state
  const [search, setSearch] = useState(query.search || '')
  const [minPrice, setMinPrice] = useState(query.min_price || '')
  const [maxPrice, setMaxPrice] = useState(query.max_price || '')
  const [priceError, setPriceError] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef()
  
  // URL state
  const category = query.category || ''
  const page = parseInt(query.page || '1')
  const perPage = parseInt(query.per_page || '12')

  // Defensive categories array resolution
  const cats = Array.isArray(categories) ? categories : (categories && categories.data) ? categories.data : []
  const selectedCategory = cats.find(c => String(c.id) === String(category))

  // Close dropdown on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  // Handle filter changes
  const applyFilters = (newFilters) => {
    const currentQuery = { ...query, ...newFilters }
    // Reset to page 1 when filters change
    if (newFilters.category || newFilters.search || newFilters.min_price || newFilters.max_price) {
      currentQuery.page = 1
    }
    // Remove empty values
    Object.keys(currentQuery).forEach(key => {
      if (!currentQuery[key]) delete currentQuery[key]
    })
    router.push({
      pathname: router.pathname,
      query: currentQuery
    })
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Search */}
      <form onSubmit={(e) => {
        e.preventDefault()
        applyFilters({ search })
      }} className="flex gap-2">
        <input
          type="text"
          data-cy="search-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          data-cy="search-button"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category Filter (custom clickable dropdown) */}
        <div ref={dropdownRef} className="relative">
          <button
            data-cy="category-filter"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full text-left border rounded px-3 py-2 bg-white"
          >
            {selectedCategory ? selectedCategory.name : 'All Categories'}
          </button>
          {dropdownOpen && (
            <ul data-cy="category-list" className="absolute z-30 mt-1 w-full bg-white border rounded shadow-md max-h-56 overflow-auto">
              <li key="all">
                <button
                  data-cy="category-option"
                  className="w-full text-left px-3 py-2 hover:bg-gray-100"
                  onClick={() => { setDropdownOpen(false); applyFilters({ category: '' }) }}
                >
                  All Categories
                </button>
              </li>
              {cats.map(cat => (
                <li key={cat.id}>
                  <button
                    data-cy="category-option"
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    onClick={() => { setDropdownOpen(false); applyFilters({ category: cat.id }) }}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              data-cy="min-price"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="number"
              data-cy="max-price"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          {priceError && (
            <p data-cy="price-error" className="text-red-600 text-sm">
              {priceError}
            </p>
          )}
          <button
            data-cy="apply-filter"
            onClick={() => {
              setPriceError('')
              const min = parseFloat(minPrice)
              const max = parseFloat(maxPrice)
              
              if (min && max && min > max) {
                setPriceError('Invalid price range')
                return
              }
              
              applyFilters({ 
                min_price: minPrice,
                max_price: maxPrice
              })
            }}
            className="w-full bg-gray-100 rounded px-3 py-2 hover:bg-gray-200"
          >
            Apply Price Filter
          </button>
        </div>

        {/* Items per page */}
        <div>
          <select
              data-cy="per-page-select"
              value={perPage}
              onChange={(e) => applyFilters({ per_page: e.target.value, page: 1 })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="15">15 per page</option>
            </select>
        </div>
      </div>

      {/* Clear Filters */}
      {(category || search || minPrice || maxPrice) && (
        <div className="flex justify-end">
          <button
            data-cy="clear-filters"
            onClick={() => {
              setSearch('')
              setMinPrice('')
              setMaxPrice('')
              setPriceError('')
              router.push(router.pathname)
            }}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}