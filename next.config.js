/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  basePath: '',
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://orixs.io' : '',
  async redirects() {
    return [
      {
        source: '/industries',
        destination: '/use-cases',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
