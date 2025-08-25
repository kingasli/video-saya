    /** @type {import('next').NextConfig} */
    const nextConfig = {
      reactStrictMode: true,
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
    