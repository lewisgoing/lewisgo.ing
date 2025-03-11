// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
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
    // domains: [
    //   "api.lanyard.rest",
    //   "cdn.discordapp.com",
    //   "pbs.twimg.com",
    //   "i.scdn.co",
    //   "www.gravatar.com",
    //   "avatars.githubusercontent.com",
    //   "lastfm.freetls.fastly.net"
    // ],
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
  },
};

module.exports = nextConfig;
