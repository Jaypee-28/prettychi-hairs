import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address")
    .max(255, "Email must be 255 characters or less")
    .transform((v) => v.toLowerCase().trim()),

  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be 72 characters or less")
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

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export interface SafeUser {
  id: string;
  email: string;
  name: string | null;
  userType: "admin" | "user";
  role?: string;
  createdAt: Date;
}
