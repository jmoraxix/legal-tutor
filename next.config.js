/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  // Enable output: 'export' for static site generation
  output: 'export',
  distDir: 'out',
  // Enable file-system routing
  useFileSystemPublicRoutes: true,
  // Ensure CSS is properly linked
  assetPrefix: '',
  experimental: {
    // Needed for Netlify compatibility
    flexibleNextStaticDir: true
  },
  // Add proper public path
  basePath: ''
}

module.exports = nextConfig
