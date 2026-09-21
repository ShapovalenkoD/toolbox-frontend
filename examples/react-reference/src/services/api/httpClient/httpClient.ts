import axios from "axios";

import { Env } from "@config";

import { ApiError } from "./ApiError";

export const HttpClient = axios.create({
  baseURL: Env.apiUrl,
  headers: { Accept: "application/json" },
  timeout: 30_000,
});

HttpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    if (axios.isCancel(error)) {
      return Promise.reject(new ApiError("ABORTED"));
    }

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return Promise.reject(new ApiError("TIMEOUT"));
    }

    return Promise.reject(
      new ApiError(error.response ? "HTTP" : "NETWORK", error.response?.status),
    );
  },
);
