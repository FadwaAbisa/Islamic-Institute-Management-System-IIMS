/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Keep your existing image settings but optimize for Docker
  images: {
    remotePatterns: [{ hostname: "images.pexels.com" }],
    // Only disable optimization in production Docker builds
    unoptimized: process.env.NODE_ENV === 'production',
  },
  
  // Experimental features for better performance
  experimental: {
    // Enable server components caching
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle Prisma client for server
      config.externals.push('@prisma/client')
    }
    return config
  },
}

export default nextConfig;