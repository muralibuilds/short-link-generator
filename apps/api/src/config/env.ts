import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const ENV_FILENAME = ".env";

/** Candidate paths for the monorepo root `.env`, ordered by preference. */
function getEnvCandidates(): string[] {
  const fromConfigDir = path.resolve(__dirname, "../../../..");
  const fromCwd = process.cwd();
  const fromCwdParent = path.resolve(fromCwd, "../..");

  return [
    path.join(fromConfigDir, ENV_FILENAME),
    path.join(fromCwd, ENV_FILENAME),
    path.join(fromCwd, "..", "..", ENV_FILENAME),
    path.join(fromCwdParent, ENV_FILENAME),
  ];
}

export function loadMonorepoEnv(): string | undefined {
  for (const envPath of getEnvCandidates()) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      return envPath;
    }
  }
  return undefined;
}

loadMonorepoEnv();

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.API_PORT ?? process.env.PORT ?? 8000),
  mongoConnection: requireEnv("MONGO_CONNECTION"),
  baseUrl: process.env.BASE ?? "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  cookieName: process.env.COOKIE_NAME ?? "short_link_session",
  isProduction: process.env.NODE_ENV === "production",
};
