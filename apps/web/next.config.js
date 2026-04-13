/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@myapp/ui', '@myapp/config'],
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/ai-native-frontend' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ai-native-frontend/' : '',
}

module.exports = nextConfig
