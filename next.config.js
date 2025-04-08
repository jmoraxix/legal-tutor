/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Enable output: 'export' for static site generation
  output: 'export',
  distDir: 'out',
  // Enable file-system routing
  useFileSystemPublicRoutes: true,
}

module.exports = nextConfig
