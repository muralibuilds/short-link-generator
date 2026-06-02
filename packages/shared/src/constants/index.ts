export const API_ROUTES = {
  SHORT: "/api/short",
  SHORT_BY_ID: (urlId: string) => `/api/short/${urlId}`,
  HEALTH: "/api/health",
} as const;

export const SHORT_URL_ID_LENGTH = 10;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export enum AppErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}
