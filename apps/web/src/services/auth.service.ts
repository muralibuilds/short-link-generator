import { API_ROUTES, type AuthResponse, type LoginInput, type RegisterInput, type UserDto } from "@repo/shared";
import { apiRequest } from "@/lib/api-client";

export async function register(input: RegisterInput): Promise<UserDto> {
  const data = await apiRequest<AuthResponse>(API_ROUTES.AUTH_REGISTER, {
    method: "POST",
    body: input,
  });
  return data.user;
}

export async function login(input: LoginInput): Promise<UserDto> {
  const data = await apiRequest<AuthResponse>(API_ROUTES.AUTH_LOGIN, {
    method: "POST",
    body: input,
  });
  return data.user;
}

export async function logout(): Promise<void> {
  await apiRequest(API_ROUTES.AUTH_LOGOUT, { method: "POST" });
}

export async function getMe(): Promise<UserDto> {
  const data = await apiRequest<AuthResponse>(API_ROUTES.AUTH_ME);
  return data.user;
}
