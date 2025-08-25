/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/search',
        destination: '/api/search',
      },
    ];
  },
};

export default nextConfig;