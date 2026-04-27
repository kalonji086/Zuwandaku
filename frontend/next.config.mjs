/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react'],
  // Rewrites handled by Netlify redirects (_redirects + netlify.toml)
  // Only used for local development now
  async rewrites() {
    return process.env.NODE_ENV === 'production' ? [] : [
      {
        source: '/backend/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
  images: {
    unoptimized: process.env.NETLIFY === 'true', // Disable image optimization on Netlify (uses Next.js Image API)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.firebasestorage.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
