/**
 * Auth module types & Zod validation schemas.
 *
 * Zod schemas are the single source of truth for input validation.
 * TypeScript types are inferred from them — no manual sync required.
 */

import { z } from "zod";

// ─── Validation Schemas ────────────────────────────────────────────────────────

export const registerSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address")
    .max(255, "Email must be 255 characters or less")
    .transform((v) => v.toLowerCase().trim()),

  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be 72 characters or less") // bcrypt max input length
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),

  name: z
    .string()
    .min(1, "Name cannot be empty")
    .max(100, "Name must be 100 characters or less")
    .trim()
    .optional(),
});

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address")
    .transform((v) => v.toLowerCase().trim()),

  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
});

// ─── Inferred Types ────────────────────────────────────────────────────────────

/** Validated register input (after Zod parsing). */
export type RegisterInput = z.infer<typeof registerSchema>;

/** Validated login input (after Zod parsing). */
export type LoginInput = z.infer<typeof loginSchema>;

// ─── Response Types ────────────────────────────────────────────────────────────

/** Safe user object — never includes the password hash. */
export interface SafeUser {
  id: string;
  email: string;
  name: string | null;
  userType: "admin" | "user";
  role?: string;
  createdAt: Date;
}

/** Returned by login and register endpoints. */
export interface AuthResult {
  user: SafeUser;
  token: string;
  expiresIn: number; // seconds
}

// ─── JWT Types ─────────────────────────────────────────────────────────────────

/** Payload encoded into the JWT access token. */
export interface JwtPayload {
  sub: string; // user id
  email: string;
  userType: "admin" | "user";
  role?: string;
  iat?: number;
  exp?: number;
}
