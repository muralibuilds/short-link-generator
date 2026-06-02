import type { RequestHandler } from "express";

/**
 * Session middleware foundation.
 * Wire express-session or similar when implementing full auth.
 */
export const sessionMiddleware: RequestHandler = (_req, _res, next) => {
  next();
};
