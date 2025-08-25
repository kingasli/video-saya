/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // PENTING: Tambahkan rewrites untuk membuat variabel lingkungan tersedia
  // di Edge Runtime.
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
