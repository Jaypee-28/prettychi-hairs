/**
 * Auth Service
 *
 * Core business logic for authentication.
 * Orchestrates repositories, password hashing, and JWT generation.
 * Must NOT import Prisma directly — use the repository instead.
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ConflictError, UnauthorizedError } from "@/lib/errors";
import * as authRepo from "../repositories/auth.repository";
import { sendWelcomeEmail } from "../../emails/welcome-email";
import type {
  RegisterInput,
  LoginInput,
  AuthResult,
  SafeUser,
  JwtPayload,
} from "../types";

// ─── Constants ─────────────────────────────────────────────────────────────────

const SALT_ROUNDS = 12;
const JWT_EXPIRATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET environment variable is not set. Cannot sign tokens.",
    );
  }
  return secret;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function toSafeUser(user: any): SafeUser {
  if (!user.email) {
    throw new Error("User has no email address");
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    userType: "user" as const,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function generateToken(user: SafeUser): string {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    userType: user.userType,
    role: user.role,
  };

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: JWT_EXPIRATION_SECONDS,
  });
}

// ─── Register ──────────────────────────────────────────────────────────────────

/**
 * Creates a new user account.
 *
 * Input is already validated by Zod in the controller layer.
 * This layer handles business rules: duplicate check, hashing, token generation.
 */
export async function register(input: RegisterInput): Promise<AuthResult> {
  // Check for existing user
  const existing = await authRepo.findUserByEmail(input.email);
  if (existing) {
    throw new ConflictError("A user with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  // Create user with hashed password
  const user = await authRepo.createUser({
    email: input.email,
    password: hashedPassword,
    name: input.name,
  });

  const safeUser = toSafeUser(user);
  const token = generateToken(safeUser);

  // Send welcome email (non-blocking)
  sendWelcomeEmail({
    name: input.name || "",
    email: input.email,
  }).catch((err) => {
    console.error("[AuthService] Welcome email dispatch failed:", err);
  });

  return {
    user: safeUser,
    token,
    expiresIn: JWT_EXPIRATION_SECONDS,
  };
}

// ─── Login ─────────────────────────────────────────────────────────────────────

/**
 * Authenticates an existing user.
 *
 * Uses a constant-time comparison (bcrypt.compare) to prevent timing attacks.
 * Returns the same error message for "no user" and "wrong password" to avoid
 * leaking whether an email is registered.
 */
export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await authRepo.findUserByEmail(input.email);

  // User not found — but we don't reveal that
  if (!user || !user.password) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Constant-time password comparison
  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const safeUser = toSafeUser(user);
  const token = generateToken(safeUser);

  return {
    user: safeUser,
    token,
    expiresIn: JWT_EXPIRATION_SECONDS,
  };
}
