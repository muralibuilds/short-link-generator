import type { RequestHandler } from "express";
import { successResponse } from "@repo/shared";
import {
  clearAuthCookie,
  createTokenForUser,
  getUserById,
  loginUser,
  registerUser,
  setAuthCookie,
} from "../services/auth.service";
import { AppError } from "../middleware/errorHandler";

export const registerHandler: RequestHandler = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    const token = createTokenForUser(user);
    setAuthCookie(res, token);
    res.status(201).json(successResponse({ user }));
  } catch (err) {
    next(err);
  }
};

export const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const user = await loginUser(req.body);
    const token = createTokenForUser(user);
    setAuthCookie(res, token);
    res.json(successResponse({ user }));
  } catch (err) {
    next(err);
  }
};

export const logoutHandler: RequestHandler = (_req, res) => {
  clearAuthCookie(res);
  res.json(successResponse({ message: "Logged out" }));
};

export const meHandler: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user?.userId) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    const user = await getUserById(req.user.userId);
    res.json(successResponse({ user }));
  } catch (err) {
    next(err);
  }
};
