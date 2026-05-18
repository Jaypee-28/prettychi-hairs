/**
 * Centralized error handling system for the Hair & Beauty Commerce Platform.
 *
 * All API route handlers should use `handleApiError()` to return
 * consistent, structured JSON error responses.
 */

// ─── Base Application Error ────────────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_ERROR",
    isOperational: boolean = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── Specific Error Types ──────────────────────────────────────────────────────

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>;

  constructor(
    message: string = "Validation failed",
    errors: Record<string, string[]> = {},
  ) {
    super(message, 400, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "FORBIDDEN");
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists") {
    super(message, 409, "CONFLICT");
  }
}

// ─── API Error Response ────────────────────────────────────────────────────────

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    errors?: Record<string, string[]>;
  };
}

/**
 * Converts any thrown error into a structured JSON Response for use in
 * Next.js API route handlers.
 *
 * @example
 * ```ts
 * export async function POST(request: Request) {
 *   try {
 *     // ... business logic
 *   } catch (error) {
 *     return handleApiError(error);
 *   }
 * }
 * ```
 */
export function handleApiError(error: unknown): Response {
  if (error instanceof ValidationError) {
    const body: ApiErrorResponse = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        errors: error.errors,
      },
    };
    return Response.json(body, { status: error.statusCode });
  }

  if (error instanceof AppError) {
    const body: ApiErrorResponse = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    };
    return Response.json(body, { status: error.statusCode });
  }

  // Unexpected errors – don't leak internals
  console.error("[API Error]", error);
  const body: ApiErrorResponse = {
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  };
  return Response.json(body, { status: 500 });
}
