import type { Response } from "express";
import type { LoginInput, RegisterInput, UserDto } from "@repo/shared";
import { AppErrorCode } from "@repo/shared";
import { authConfig } from "../config/auth";
import { UserModel } from "../models/user.model";
import { AppError } from "../middleware/errorHandler";
import { signToken } from "../utils/jwt";
import { hashPassword, verifyPassword } from "../utils/password";

function toUserDto(doc: {
  _id: { toString(): string };
  email: string;
  createdAt: Date;
}): UserDto {
  return {
    id: doc._id.toString(),
    email: doc.email,
    createdAt: doc.createdAt,
  };
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(authConfig.cookieName, token, authConfig.cookieOptions);
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(authConfig.cookieName, {
    path: authConfig.cookieOptions.path,
    httpOnly: authConfig.cookieOptions.httpOnly,
    secure: authConfig.cookieOptions.secure,
    sameSite: authConfig.cookieOptions.sameSite,
  });
}

export async function registerUser(input: RegisterInput): Promise<UserDto> {
  const existing = await UserModel.findOne({ email: input.email });
  if (existing) {
    throw new AppError(
      "Email already registered",
      409,
      AppErrorCode.CONFLICT
    );
  }

  const passwordHash = await hashPassword(input.password);
  const user = await UserModel.create({
    email: input.email,
    passwordHash,
    createdAt: new Date(),
  });

  return toUserDto(user);
}

export async function loginUser(input: LoginInput): Promise<UserDto> {
  const user = await UserModel.findOne({ email: input.email });
  if (!user) {
    throw new AppError("Invalid email or password", 401, AppErrorCode.UNAUTHORIZED);
  }

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError("Invalid email or password", 401, AppErrorCode.UNAUTHORIZED);
  }

  return toUserDto(user);
}

export async function getUserById(userId: string): Promise<UserDto> {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404, AppErrorCode.NOT_FOUND);
  }
  return toUserDto(user);
}

export function createTokenForUser(user: UserDto): string {
  return signToken({ userId: user.id, email: user.email });
}
