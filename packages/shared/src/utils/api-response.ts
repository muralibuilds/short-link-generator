import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../types/api";

export function successResponse<T>(data: T): ApiSuccessResponse<T> {
  return { success: true, data };
}

export function errorResponse(
  message: string,
  code?: string,
  details?: unknown
): ApiErrorResponse {
  return {
    success: false,
    error: { message, code, details },
  };
}
