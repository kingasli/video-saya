/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: [
      "@cloudflare/next-on-pages"
    ]
  }
};
export default nextConfig;