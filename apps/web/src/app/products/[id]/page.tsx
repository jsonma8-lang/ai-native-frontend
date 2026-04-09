'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@myapp/types/database'

type Product = Database['public']['Tables']['products']['Row']

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single()
    if (!error) setProduct(data)
    setLoading(false)
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(price)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
            <span className="text-xl font-semibold tracking-tight">AI-Native 电商</span>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-white rounded-2xl" />
            <div className="space-y-4 pt-4">
              <div className="h-8 bg-gray-200 rounded-full w-3/4" />
              <div className="h-6 bg-gray-200 rounded-full w-1/3" />
              <div className="h-4 bg-gray-200 rounded-full w-full mt-6" />
              <div className="h-4 bg-gray-200 rounded-full w-5/6" />
              <div className="h-4 bg-gray-200 rounded-full w-4/6" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">商品不存在</h2>
          <p className="text-gray-500 mb-6 text-sm">该商品可能已下架或链接有误</p>
          <button
            onClick={() => router.push('/products')}
            className="px-5 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors"
          >
            返回商品列表
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span
            className="text-xl font-semibold tracking-tight cursor-pointer"
            onClick={() => router.push('/products')}
          >
            AI-Native 电商
          </span>
          <button
            onClick={() => router.push('/products')}
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
          >
            ← 返回列表
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 产品图片 */}
          <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                <span className="text-7xl">📦</span>
                <span className="text-sm">暂无图片</span>
              </div>
            )}
          </div>

          {/* 产品信息 */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

            <div className="text-4xl font-bold text-gray-900 mb-8">
              {formatPrice(product.price)}
            </div>

            {/* 分割线 */}
            <div className="border-t border-gray-100 mb-6" />

            {/* 描述 */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">商品描述</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || '暂无描述'}
              </p>
            </div>

            {/* 商品信息 */}
            <div className="bg-gray-50 rounded-xl p-4 mb-8 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">商品编号</span>
                <span className="font-mono text-gray-700 text-xs">{product.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">上架时间</span>
                <span className="text-gray-700">{new Date(product.created_at).toLocaleDateString('zh-CN')}</span>
              </div>
            </div>

            {/* 返回按钮 */}
            <button
              onClick={() => router.push('/products')}
              className="w-full py-3.5 border-2 border-gray-900 text-gray-900 font-medium rounded-xl hover:bg-gray-900 hover:text-white transition-colors duration-200"
            >
              继续逛逛
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
