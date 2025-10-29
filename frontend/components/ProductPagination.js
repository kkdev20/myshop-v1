import React from 'react'
import { useRouter } from 'next/router'

export default function ProductPagination({ total, currentPage = 1, perPage = 12 }) {
  const router = useRouter()
  const totalPages = Math.ceil(total / perPage)
  
  // Generate page numbers array
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  const changePage = (page) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page }
    })
  }

  // Don't show pagination if there's only one page
  if (totalPages <= 1) return null

  return (
    <div className="mt-6 flex items-center justify-between">
      {/* Info */}
      <div data-cy="pagination-info" className="text-sm text-gray-600">
        Showing {((currentPage - 1) * perPage) + 1}-
        {Math.min(currentPage * perPage, total)} of {total}
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <button
          data-cy="prev-page"
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className={`px-3 py-1 rounded border ${
            currentPage === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'hover:bg-gray-50'
          }`}
        >
          Previous
        </button>

        {pageNumbers.map(num => (
          <button
            key={num}
            data-cy={`page-${num}`}
            onClick={() => changePage(num)}
            aria-label={`Page ${num}`}
            aria-current={currentPage === num ? 'page' : undefined}
            className={`px-3 py-1 rounded border ${
              currentPage === num
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-50'
            }`}
          >
            {num}
          </button>
        ))}

        <button
          data-cy="next-page"
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className={`px-3 py-1 rounded border ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'hover:bg-gray-50'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  )
}