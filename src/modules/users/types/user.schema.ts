import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional(),
  phone: z
    .string()
    .min(5, "Phone number must be at least 5 characters")
    .max(20, "Phone number must be less than 20 characters")
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
