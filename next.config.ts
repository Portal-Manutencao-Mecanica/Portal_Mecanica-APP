const backendApiUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8080/api";

const nextConfig: import("next").NextConfig = {
  allowedDevOrigins: ["10.129.224.83"],
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backendApiUrl}/:path*` }];
  },
};

export default nextConfig;