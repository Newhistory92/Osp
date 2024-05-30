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
export default nextConfig;

