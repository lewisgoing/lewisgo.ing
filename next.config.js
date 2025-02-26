// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'api.lanyard.rest',
      'cdn.discordapp.com',
      'i.scdn.co', // For Spotify images
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  },
  experimental: {
    // Enable App Router features
    // appDir: true,
    // Enable NextJS 15 caching features
    dynamicIO: true,
    useCache: true,
    cacheLife: {
      spotify: {
        stale: 300,     // 5 minutes
        revalidate: 60, // 1 minute
        expire: 3600,   // 1 hour
      },
    },
  },
};

module.exports = nextConfig;