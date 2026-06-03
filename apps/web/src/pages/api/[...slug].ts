import type { NextApiRequest, NextApiResponse } from "next";
import { createApp } from "@repo/api/app";
import { connectDatabase } from "@repo/api/database";

// Let the Express app read the raw request body (express.json() handles parsing)
// and tell Next that an external resolver (Express) sends the response.
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

// Allow up to 30s for cold starts + DB connection.
export const maxDuration = 30;

// Build the Express app once per warm lambda instance.
const app = createApp();

// Cache the DB connection across invocations on the same instance.
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
  await ensureDatabase();
  // Express's app is itself a (req, res) Node handler; the Node-style
  // req/res that Pages API routes provide are compatible.
  return (app as unknown as (req: NextApiRequest, res: NextApiResponse) => void)(
    req,
    res
  );
}
