import { z } from "zod";

export const CreateFAQSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters"),
  answer: z.string().min(5, "Answer must be at least 5 characters"),
  category: z.string().min(2, "Category is required"),
  isActive: z.boolean().default(true),
});

export const UpdateFAQSchema = CreateFAQSchema.partial();

export type CreateFAQInput = z.infer<typeof CreateFAQSchema>;
export type UpdateFAQInput = z.infer<typeof UpdateFAQSchema>;
