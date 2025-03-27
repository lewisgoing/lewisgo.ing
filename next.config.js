// next.config.js
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      require('remark-gfm'),
      require('remark-math')
    ],
    rehypePlugins: [
      require('rehype-slug'),
      [require('rehype-autolink-headings'), { behavior: 'wrap' }],
      require('rehype-prism-plus'),
      require('rehype-katex')
    ],
    providerImportSource: '@mdx-js/react',
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
  experimental: {
    useCache: true,
    dynamicIO: true,
    typedRoutes: true,
  },
};

module.exports = withMDX(nextConfig);