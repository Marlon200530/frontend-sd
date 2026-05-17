import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { ApiResponse } from "../types/api";
import {
  getAccessToken,
  getRefreshToken,
  removeTokens,
  setAccessToken,
  setRefreshToken,
} from "./token";

type RefreshData = {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
};

export const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error("Missing required environment variable: VITE_API_URL");
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let isRefreshing = false;

let failedRequestsQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

function isPublicAuthEndpoint(url?: string) {
  if (!url) return false;

  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/forgot-password") ||
    url.includes("/auth/reset-password") ||
    url.includes("/auth/refresh")
  );
}

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (isPublicAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      removeTokens();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      removeTokens();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          resolve: (newAccessToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const response = await axios.post<ApiResponse<RefreshData>>(
        `${API_BASE_URL}/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            Accept: "application/json",
          },
        }
      );

      const refreshData = response.data.data;

      setAccessToken(refreshData.accessToken);

      if (refreshData.refreshToken) {
        setRefreshToken(refreshData.refreshToken);
      }

      failedRequestsQueue.forEach((request) => {
        request.resolve(refreshData.accessToken);
      });

      failedRequestsQueue = [];

      originalRequest.headers.Authorization = `Bearer ${refreshData.accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      failedRequestsQueue.forEach((request) => {
        request.reject(refreshError);
      });

      failedRequestsQueue = [];

      removeTokens();
      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
