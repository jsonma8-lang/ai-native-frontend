import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@myapp/types/database'
import Link from 'next/link'

type Product = Database['public']['Tables']['products']['Row']

// 在构建时生成所有产品页面
export async function generateStaticParams() {
  // 如果环境变量未配置，返回空数组（允许构建通过）
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase credentials not found, skipping static generation for product pages')
    return []
  }

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data: products } = await supabase.from('products').select('id')

  if (!products) return []

  return products.map((product: { id: string }) => ({
    id: product.id,
  }))
}

// 获取产品数据
async function getProduct(id: string): Promise<Product | null> {
  // 如果环境变量未配置，返回 null
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(price)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/products" className="text-xl font-semibold tracking-tight">
            AI-Native 电商
          </Link>
          <Link
            href="/products"
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
          >
            ← 返回列表
          </Link>
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
            <Link
              href="/products"
              className="w-full py-3.5 border-2 border-gray-900 text-gray-900 font-medium rounded-xl hover:bg-gray-900 hover:text-white transition-colors duration-200 text-center block"
            >
              继续逛逛
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
