/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // PENTING: Tambahkan variabel lingkungan secara eksplisit.
  // Ganti `website-video-db` dengan nama database D1 Anda jika berbeda.
  env: {
    DB: process.env.DB,
  },
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
