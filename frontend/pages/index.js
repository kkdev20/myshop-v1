import React from 'react'
import Head from 'next/head'
import ProductList from '../components/ProductList'

export default function Home({ initialProducts = [], categories = [] }) {
  return (
    <>
      <Head>
        <title>MyShop - Products</title>
        <meta name="description" content="Browse our collection of products" />
      </Head>

      <main className="container py-8">
        <h1 className="text-3xl font-semibold mb-6">MyShop — Products</h1>
        <ProductList initialItems={initialProducts} categories={categories} />
      </main>
    </>
  )
}

// Fetch initial data
export async function getServerSideProps({ query }) {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
    console.log('API Base URL:', base)
    
    // Fetch products with query params
    const params = new URLSearchParams(query)
    console.log('Fetching products with params:', params.toString())
    
    // Add error handlers to both fetch calls
    const fetchWithErrors = async (url) => {
      const res = await fetch(url)
      if (!res.ok) {
        const text = await res.text()
        console.error(`API Error (${res.status}):`, text)
        throw new Error(`API returned ${res.status}: ${text}`)
      }
      return res.json()
    }
    
    const [productsData, categoriesData] = await Promise.all([
      fetchWithErrors(`${base}/products?${params}`),
      fetchWithErrors(`${base}/categories`)
    ])

    console.log('Products response:', productsData)
    console.log('Categories response:', categoriesData)

    return {
      props: {
        initialProducts: productsData.data || productsData || [],
        // categories endpoint may return a resource wrapper { data: [...] }
        categories: categoriesData.data || categoriesData || [],
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: {
        initialProducts: [],
        categories: [],
      }
    }
  }
}
