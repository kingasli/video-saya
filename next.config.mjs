/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@cloudflare/next-on-pages'],
    runtime: 'edge', // Ini adalah baris penting yang kita tambahkan
  },
};

export default nextConfig;