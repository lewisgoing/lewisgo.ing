// next.config.ts
import type { NextConfig } from 'next';
import withMDXPlugin from '@next/mdx';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeKatex from 'rehype-katex';

// MDX configuration
const withMDX = withMDXPlugin({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      rehypePrismPlus,
      rehypeKatex
    ],
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
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
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i1.sndcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'soundcloud-images.s3.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
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
  publicRuntimeConfig: {
    staticFolder: '/public',
  },
  // Add environment variables that should be available to the client
  env: {
    NEXT_PUBLIC_USE_VERCEL_BLOB: process.env.NEXT_PUBLIC_USE_VERCEL_BLOB,
    VERCEL_BLOB_URL: process.env.NEXT_PUBLIC_VERCEL_BLOB_URL,
  },
};

export default withMDX(nextConfig);