export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold text-gray-900">
            欢迎来到 AI-Native 电商平台
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            基于最新的 AI-Native 技术栈构建：Next.js 14 + Supabase + shadcn/ui + Tailwind v4
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold mb-2">快速开发</h3>
              <p className="text-gray-600">使用 Turborepo + pnpm workspace 实现高效的 Monorepo 管理</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🔐</div>
              <h3 className="text-lg font-semibold mb-2">安全认证</h3>
              <p className="text-gray-600">集成 Supabase Auth，支持多种登录方式</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold mb-2">实时协作</h3>
              <p className="text-gray-600">基于 Supabase Realtime 的实时数据同步</p>
            </div>
          </div>

          <div className="mt-12 space-x-4">
            <a
              href="/products"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              浏览产品
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
