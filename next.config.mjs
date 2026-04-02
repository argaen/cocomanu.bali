/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
