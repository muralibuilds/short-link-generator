import type { NextApiRequest, NextApiResponse } from "next";
import { createApp } from "@repo/api/app";
import { connectDatabase } from "@repo/api/database";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export const maxDuration = 30;

const app = createApp();

let dbReady: Promise<void> | null = null;

function ensureDatabase() {
  if (!dbReady) {
    dbReady = connectDatabase();
  }
  return dbReady;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await ensureDatabase();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Database connection failed";
    if (!dbReady || err) {
      dbReady = null;
    }
    return res.status(503).json({
      success: false,
      error: { message, code: "SERVICE_UNAVAILABLE" },
    });
  }

  return (app as unknown as (req: NextApiRequest, res: NextApiResponse) => void)(
    req,
    res
  );
}
