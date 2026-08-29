/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Finer steps between 1200–1920 so laptop viewports (e.g. 1410px) don't overshoot to 1920w.
    deviceSizes: [640, 750, 828, 1080, 1200, 1400, 1536, 1920, 2048, 3840],
    // Explicitly allow project-served static images in both local and production.
    localPatterns: [
      {
        pathname: '/images/**',
      },
    ],
    // Keep optimization enabled, but explicitly allow all remote hosts we use.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/argaen/cocomanu.bali/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'lightroom.adobe.com',
      },
      {
        protocol: 'https',
        hostname: 'www.cocomanu.com',
      },
      {
        protocol: 'https',
        hostname: 'cocomanu.com',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'secure.notion-static.com',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
