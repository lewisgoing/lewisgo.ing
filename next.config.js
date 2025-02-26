// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: "@svgr/webpack", options: { icon: true } }],
    });
    return config;
  },
  images: {
    domains: [
      "api.lanyard.rest",
      "cdn.discordapp.com",
      "pbs.twimg.com",
      "i.scdn.co",
      "www.gravatar.com",
      "avatars.githubusercontent.com",
    ],
  },
  experimental: {
    useCache: true,
  }
};

module.exports = nextConfig;
