/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  images: {
    remotePatterns: [
      {
        hostname: 'raw.githubusercontent.com',
        pathname: '/argaen/cocomanu.bali/**',
      },
      {
        hostname: 'upload.wikimedia.org',
      },
      {
        hostname:'*',
      },
    ],
  },
}

export default nextConfig;
