import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  transpilePackages: ['geist'],
  // Enable font optimization and use PostCSS config file
  experimental: {
    optimizeFonts: true,
  }
};

export default nextConfig;
