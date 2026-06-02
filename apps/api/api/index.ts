import serverless from "serverless-http";
import { createApp } from "../src/app";
import { connectDatabase } from "../src/config/database";

let dbReady: Promise<void> | null = null;

function ensureDatabase() {
  if (!dbReady) {
    dbReady = connectDatabase();
  }
  return dbReady;
}

const app = createApp();
const handler = serverless(app);

export default async function vercelHandler(
  req: Parameters<typeof handler>[0],
  res: Parameters<typeof handler>[1]
) {
  await ensureDatabase();
  return handler(req, res);
}
