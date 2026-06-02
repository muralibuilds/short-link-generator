import type { ErrorRequestHandler, RequestHandler } from "express";
import { errorResponse } from "@repo/shared";
import { logger } from "../config/logger";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code = "INTERNAL_ERROR",
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json(errorResponse("Route not found", "NOT_FOUND"));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    logger.warn(err.message, { code: err.code, details: err.details });
    return res
      .status(err.statusCode)
      .json(errorResponse(err.message, err.code, err.details));
  }

  logger.error(err instanceof Error ? err.message : "Unknown error", {
    stack: err instanceof Error ? err.stack : undefined,
  });

  const status = (err as { status?: number }).status ?? 500;
  const message =
    status < 500 && err instanceof Error
      ? err.message
      : "Internal server error";

  res.status(status).json(errorResponse(message, "INTERNAL_ERROR"));
};
