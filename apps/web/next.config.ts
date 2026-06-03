import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compile the workspace packages from their TypeScript source.
  transpilePackages: ["@repo/shared", "@repo/api"],
  // Keep these server-only Node packages external (don't bundle them) so
  // Express/Mongoose behave correctly inside the serverless function.
  serverExternalPackages: ["mongoose", "express"],
};

export default nextConfig;
