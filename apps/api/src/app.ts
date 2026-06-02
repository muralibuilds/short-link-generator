import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";
import { logger } from "./config/logger";
import apiRouter from "./routes";
import { authenticate } from "./middleware/auth";
import { sessionMiddleware } from "./middleware/session";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.set("trust proxy", env.isProduction);

  app.use(
    cors({
      credentials: true,
      origin: env.isProduction
        ? [env.baseUrl]
        : ["http://localhost:3000", env.baseUrl],
    })
  );

  app.use(
    morgan(env.isProduction ? "combined" : "dev", {
      stream: { write: (message) => logger.http(message.trim()) },
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(sessionMiddleware);
  app.use(authenticate({ required: false }));

  app.use(
    express.static(path.join(__dirname, "..", "public"))
  );

  app.use("/api", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
