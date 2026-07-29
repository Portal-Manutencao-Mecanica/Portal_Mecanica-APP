const nextConfig: import('next').NextConfig = {
  compress: true,
  poweredByHeader: false,
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
