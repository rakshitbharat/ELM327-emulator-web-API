import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  transpilePackages: ['geist'],
  // Disable type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable font optimization and use PostCSS config file
  experimental: {
  }
};

export default nextConfig;
