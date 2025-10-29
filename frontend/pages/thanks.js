import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function ThanksPage() {
  const router = useRouter()
  const { id } = router.query

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-semibold mb-4">Terima kasih atas pesanan Anda</h1>
      <p className="text-gray-600 mb-4">Pesanan Anda telah diterima. Kami akan memprosesnya segera.</p>
      {id && (
        <p className="text-gray-700 mb-4">Order ID: {id}</p>
      )}
      <Link href="/" className="text-indigo-600">Kembali ke toko</Link>
    </div>
  )
}
