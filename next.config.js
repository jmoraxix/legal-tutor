/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'], // Add any image domains you need
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  // Enable experimental features that work well with Netlify
  experimental: {
    // These settings improve performance on Netlify
    optimizeCss: true,
    scrollRestoration: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dropdown-menu'],
  },
  // Disable X-Powered-By header
  poweredByHeader: false,
};

module.exports = nextConfig;
