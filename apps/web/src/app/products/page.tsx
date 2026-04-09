'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@myapp/types/database'

type Product = Database['public']['Tables']['products']['Row']
type SortOption = 'newest' | 'price_asc' | 'price_desc'

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')

  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchProducts())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*')
    if (!error) setProducts(data || [])
    setLoading(false)
  }

  const filteredProducts = useMemo(() => {
    let result = [...products]
    if (search.trim()) {
      const kw = search.trim().toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(kw) ||
        (p.description?.toLowerCase().includes(kw) ?? false)
      )
    }
    if (minPrice !== '') result = result.filter(p => p.price >= Number(minPrice))
    if (maxPrice !== '') result = result.filter(p => p.price <= Number(maxPrice))
    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price)
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price)
    else result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return result
  }, [products, search, minPrice, maxPrice, sort])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(price)

  const hasFilters = search || minPrice || maxPrice || sort !== 'newest'

  const clearFilters = () => {
    setSearch('')
    setMinPrice('')
    setMaxPrice('')
    setSort('newest')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-semibold tracking-tight">AI-Native 电商</span>
          <span className="text-sm text-gray-400">{!loading && `${products.length} 件商品`}</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">全部商品</h1>
          <p className="mt-1 text-gray-500 text-sm">发现你喜欢的好物</p>
        </div>

        {/* 搜索 + 筛选 */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* 搜索框 */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索商品..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* 价格区间 */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
            <span className="text-xs text-gray-400 whitespace-nowrap">价格</span>
            <input
              type="number"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              placeholder="最低"
              min={0}
              className="w-16 text-sm text-center focus:outline-none"
            />
            <span className="text-gray-300">—</span>
            <input
              type="number"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              placeholder="最高"
              min={0}
              className="w-16 text-sm text-center focus:outline-none"
            />
          </div>

          {/* 排序 */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer"
          >
            <option value="newest">最新上架</option>
            <option value="price_asc">价格从低到高</option>
            <option value="price_desc">价格从高到低</option>
          </select>
        </div>

        {/* 结果统计 + 清除筛选 */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            {loading ? '加载中...' : (
              <>找到 <span className="font-medium text-gray-900">{filteredProducts.length}</span> 件商品</>
            )}
          </p>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-gray-700 underline underline-offset-2">
              清除筛选
            </button>
          )}
        </div>

        {/* 商品网格 */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-full" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                  <div className="h-8 bg-gray-100 rounded-xl w-full mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 mb-1">{hasFilters ? '没有符合条件的商品' : '暂无商品'}</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-3 text-sm text-gray-900 underline underline-offset-2">
                清除筛选条件
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => router.push(`/products/${product.id}`)}
                className="bg-white rounded-2xl overflow-hidden cursor-pointer group hover:shadow-md transition-shadow duration-200"
              >
                {/* 图片 */}
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
                      📦
                    </div>
                  )}
                </div>

                {/* 信息 */}
                <div className="p-4">
                  <h2 className="font-medium text-gray-900 truncate">{product.name}</h2>
                  <p className="text-sm text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {product.description || '暂无描述'}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full group-hover:bg-gray-900 group-hover:text-white transition-colors">
                      查看详情 →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
