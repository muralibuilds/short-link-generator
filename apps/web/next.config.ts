import path from "path";
import dotenv from "dotenv";
import type { NextConfig } from "next";

const monorepoRoot = path.join(__dirname, "../..");
dotenv.config({ path: path.join(monorepoRoot, ".env") });

const apiInternalUrl =
  process.env.API_INTERNAL_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/shared"],
  outputFileTracingRoot: monorepoRoot,
  serverExternalPackages: [
    "mongoose",
    "express",
    "bcrypt",
    "geoip-lite",
    "ua-parser-js",
  ],
  turbopack: {
    root: monorepoRoot,
  },
  async rewrites() {
    // Dev only: proxy /api to the standalone Express server. On Vercel, localhost
    // resolves to a private IP and triggers DNS_HOSTNAME_RESOLVED_PRIVATE.
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: `${apiInternalUrl}/api/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
