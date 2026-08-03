const nextConfig: import("next").NextConfig = {
  allowedDevOrigins: ["10.129.224.83", "*.trycloudflare.com"],
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
