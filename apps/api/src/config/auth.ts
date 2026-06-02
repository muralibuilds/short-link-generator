import { env } from "./env";

/**
 * Auth configuration foundation for JWT + cookies.
 * Full auth flows are not implemented yet.
 */
export const authConfig = {
  jwtSecret: env.jwtSecret,
  jwtExpiresIn: env.jwtExpiresIn,
  cookieName: env.cookieName,
  cookieOptions: {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  },
};
