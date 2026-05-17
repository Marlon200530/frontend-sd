import { api } from "../utils/api";
import { removeTokens, setAccessToken, setRefreshToken } from "../utils/token";
import type { ApiResponse } from "../types/api";

export type UserRole = "student" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  contact: string | null;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  contact?: string;
  password: string;
  confirmPassword: string;
};

export type AuthData = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
};

export async function login(payload: LoginPayload) {
  const response = await api.post<ApiResponse<AuthData>>(
    "/auth/login",
    payload
  );

  const authData = response.data.data;

  setAccessToken(authData.accessToken);
  setRefreshToken(authData.refreshToken);

  return authData;
}

export async function register(payload: RegisterPayload) {
  const response = await api.post<ApiResponse<AuthData>>(
    "/auth/register",
    payload
  );

  return response.data.data;
}

export async function getMe() {
  const response = await api.get<ApiResponse<User>>("/users/me");
  return response.data.data;
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } finally {
    removeTokens();
  }
}
