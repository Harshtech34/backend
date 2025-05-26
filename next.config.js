/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for better deployment
  output: "standalone",

  // Optimize images
  images: {
    domains: ["images.unsplash.com", "via.placeholder.com"],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Enable experimental features
  experimental: {
    serverComponentsExternalPackages: ["leaflet"],
  },

  // Environment variables - only expose safe ones to client
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },

  // Headers for better caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/overview",
        permanent: true,
      },
    ]
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
