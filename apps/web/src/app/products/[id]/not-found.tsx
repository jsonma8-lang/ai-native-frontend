import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">商品不存在</h2>
        <p className="text-gray-500 mb-6 text-sm">该商品可能已下架或链接有误</p>
        <Link
          href="/products"
          className="inline-block px-5 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-700 transition-colors"
        >
          返回商品列表
        </Link>
      </div>
    </div>
  )
}
