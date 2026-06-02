import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "./errorHandler";

export function validateBody<T>(schema: ZodSchema<T>): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(
        new AppError(
          "Validation failed",
          400,
          "VALIDATION_ERROR",
          result.error.flatten()
        )
      );
    }
    req.body = result.data;
    next();
  };
}

export function validateParams<T>(schema: ZodSchema<T>): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return next(
        new AppError(
          "Invalid parameters",
          400,
          "VALIDATION_ERROR",
          result.error.flatten()
        )
      );
    }
    req.params = result.data as typeof req.params;
    next();
  };
}
