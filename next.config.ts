// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: '@svgr/webpack', options: { icon: true } }],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.lanyard.rest',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lastfm.freetls.fastly.net',
        pathname: '/**',
      },
      // Add Vercel Blob hostname pattern
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
  // NextJS 15 features
  experimental: {
    useCache: true,
    dynamicIO: true,
    typedRoutes: true,
    cacheLife: {
      // Define custom caching profiles
      blog: {
        stale: 3600, // 1 hour
        revalidate: 900, // 15 minutes
        expire: 86400, // 1 day
      },
      staticContent: {
        stale: 86400, // 1 day
        revalidate: 3600, // 1 hour
        expire: 604800, // 7 days
      },
    },
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Add environment variables that should be available to the client
  env: {
    NEXT_PUBLIC_USE_VERCEL_BLOB: process.env.NEXT_PUBLIC_USE_VERCEL_BLOB || 'false',
    VERCEL_BLOB_URL: process.env.NEXT_PUBLIC_VERCEL_BLOB_URL || '',
  },
};

export default nextConfig;