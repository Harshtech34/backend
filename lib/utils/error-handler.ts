import type { ApiError } from "../types/api-types"
import { logger } from "./logger"

export const ERROR_CODES = {
  // General errors
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  INVALID_REQUEST: "INVALID_REQUEST",
  MISSING_PARAMETERS: "MISSING_PARAMETERS",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",

  // Rate limiting errors
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",

  // Data validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",

  // Portal-specific errors
  PORTAL_UNAVAILABLE: "PORTAL_UNAVAILABLE",
  PORTAL_TIMEOUT: "PORTAL_TIMEOUT",
  PORTAL_ERROR: "PORTAL_ERROR",

  // Transformation errors
  TRANSFORMATION_ERROR: "TRANSFORMATION_ERROR",
}

export class ApiErrorHandler {
  public static createError(code: string, message: string, details?: Record<string, any>, source?: string): ApiError {
    const error: ApiError = {
      code,
      message,
      details,
      source,
    }

    // Log the error
    logger.error(`API Error: ${message}`, { error })

    return error
  }

  public static handleError(error: unknown, source?: string): ApiError {
    // Handle known errors
    if (error instanceof Error) {
      return this.createError(ERROR_CODES.INTERNAL_SERVER_ERROR, error.message, { stack: error.stack }, source)
    }

    // Handle unknown errors
    return this.createError(
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      "An unexpected error occurred",
      { originalError: error },
      source,
    )
  }
}
