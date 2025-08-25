/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://kitacoba.kingkep123.workers.dev/api/:path*',
      },
    ];
  },
};

export default nextConfig; // Ganti "module.exports" menjadi "export default"