/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@myapp/ui', '@myapp/config'],
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
