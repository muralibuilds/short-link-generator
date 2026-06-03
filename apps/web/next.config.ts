import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/shared"],
  async rewrites() {
    // In local dev the Express API runs as a separate server (port 8000),
    // so we proxy /api/* to it to avoid CORS. On Vercel the API is deployed
    // as a serverless function and routing is handled by vercel.json, so we
    // must NOT proxy to localhost here.
    if (process.env.NODE_ENV !== "development") {
      return [];
    }

    const apiInternalUrl =
      process.env.API_INTERNAL_URL ?? "http://localhost:8000";

    return [
      {
        source: "/api/:path*",
        destination: `${apiInternalUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
