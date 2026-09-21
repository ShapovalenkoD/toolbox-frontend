import type { ApiErrorCode } from "./ApiError.interface";

export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    public readonly status?: number,
  ) {
    super(code);
    this.name = "ApiError";
  }
}
