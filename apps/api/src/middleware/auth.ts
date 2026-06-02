import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth";
import { AppError } from "./errorHandler";

export interface AuthPayload {
  userId: string;
  email?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/**
 * Optional JWT auth — reads Bearer token or session cookie.
 * Does not block unauthenticated requests when `required` is false.
 */
export function authenticate(options: { required?: boolean } = {}): RequestHandler {
  const { required = false } = options;

  return (req, _res, next) => {
    const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    const token =
      bearer ||
      (req.cookies?.[authConfig.cookieName] as string | undefined);

    if (!token) {
      if (required) {
        return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
      }
      return next();
    }

    try {
      const payload = jwt.verify(token, authConfig.jwtSecret) as AuthPayload;
      req.user = payload;
      next();
    } catch {
      if (required) {
        return next(new AppError("Invalid or expired token", 401, "UNAUTHORIZED"));
      }
      next();
    }
  };
}
