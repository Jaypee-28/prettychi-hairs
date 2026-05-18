import { z } from "zod";

export const CreateTestimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(5, "Message must be at least 5 characters"),
  rating: z.number().min(1).max(5).optional(),
});

export const UpdateTestimonialSchema = z.object({
  isApproved: z.boolean(),
});
