import jwt, { type SignOptions } from "jsonwebtoken";
import { authConfig } from "../config/auth";
import type { AuthPayload } from "../middleware/auth";

export function signToken(payload: AuthPayload): string {
  const options: SignOptions = {
    expiresIn: authConfig.jwtExpiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, authConfig.jwtSecret, options);
}
