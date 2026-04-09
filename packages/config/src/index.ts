export const siteConfig = {
  name: 'AI-Native 电商平台',
  description: '基于 AI-Native 技术栈构建的现代电商平台',
  url: 'https://example.com',
  links: {
    github: 'https://github.com/yourusername/ai-native-ecommerce',
  },
}

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
}
