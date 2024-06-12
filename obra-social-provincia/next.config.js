const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pinimg.com' },
      { protocol: 'https', hostname: 'img.clerk.com' },
      { protocol: 'https', hostname: 'assets.pinterest.com' },
      { protocol: 'https', hostname: 'img.icons8.com' },
    ],
  },
  
};
module.exports = withBundleAnalyzer(nextConfig)

