/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        // Path yang akan cocok di Next.js
        source: '/api/:path*',
        // URL tujuan yang merupakan Worker API Anda
        destination: 'https://kitacoba.kingkep123.workers.dev/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
