import winston from "winston";
import { env } from "./env";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}]: ${stack ?? message}`;
});

export const logger = winston.createLogger({
  level: env.isProduction ? "info" : "debug",
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    env.isProduction ? logFormat : combine(colorize(), logFormat)
  ),
  transports: [new winston.transports.Console()],
});
