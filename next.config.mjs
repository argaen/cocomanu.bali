/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASE_PATH,
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
