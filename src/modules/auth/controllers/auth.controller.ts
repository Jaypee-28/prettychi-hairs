/**
 * Auth Controller
 *
 * Plain functions that sit between the HTTP layer (Next.js route handlers)
 * and the service layer. Responsibilities:
 *   1. Validate raw input with Zod
 *   2. Delegate to the service
 *   3. Return typed results
 *
 * These are NOT Express-style middleware.
 */

import { ValidationError } from "@/lib/errors";
import * as authService from "../services/auth.service";
import { registerSchema, loginSchema } from "../types";
import type { AuthResult } from "../types";

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Converts a ZodError into our application's ValidationError format.
 * Groups field-level errors by field name for clear client consumption.
 */
function handleZodError(zodError: import("zod").ZodError): never {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of zodError.issues) {
    const field = issue.path.join(".") || "_root";
    if (!fieldErrors[field]) {
      fieldErrors[field] = [];
    }
    fieldErrors[field].push(issue.message);
  }

  throw new ValidationError("Validation failed", fieldErrors);
}

// ─── Register ──────────────────────────────────────────────────────────────────

export async function register(rawInput: unknown): Promise<AuthResult> {
  const result = registerSchema.safeParse(rawInput);
  if (!result.success) {
    handleZodError(result.error);
  }

  return authService.register(result.data);
}

// ─── Login ─────────────────────────────────────────────────────────────────────

export async function login(rawInput: unknown): Promise<AuthResult> {
  const result = loginSchema.safeParse(rawInput);
  if (!result.success) {
    handleZodError(result.error);
  }

  return authService.login(result.data);
}
