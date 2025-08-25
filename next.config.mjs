/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@cloudflare/next-on-pages'],
    runtime: 'experimental-edge', // BARIS INI YANG DIUBAH
  },
};

export default nextConfig;