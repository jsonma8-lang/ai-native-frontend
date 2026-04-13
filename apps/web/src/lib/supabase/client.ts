import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  // 在构建时如果环境变量缺失，返回一个模拟客户端
  if (typeof window === 'undefined' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    // 返回一个最小的模拟客户端用于构建
    return createSupabaseClient(
      'https://placeholder.supabase.co',
      'placeholder-anon-key'
    )
  }

  return createClientComponentClient()
}
