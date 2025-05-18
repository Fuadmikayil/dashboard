'use client'

import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import MenuItem from '@/components/MenuItem'

export default function Home() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('product_list').select('*')
      if (error) setError(error)
      else setProducts(data)
    }

    fetchData()
  }, [])

  if (error) {
    return (
      <main className="container mx-auto p-6">
        <p className="text-red-500">Something went wrong...</p>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
        Our Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </main>
  )
}
