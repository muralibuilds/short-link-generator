import { createApp } from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";
import { logger } from "./config/logger";

async function bootstrap() {
  await connectDatabase();

  const app = createApp();

  app.listen(env.port, () => {
    logger.info(`API listening on port ${env.port}`);
  });
}

bootstrap().catch((err) => {
  logger.error("Failed to start server", { error: err });
  process.exit(1);
});
