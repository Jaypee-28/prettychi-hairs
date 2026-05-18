import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().optional().or(z.literal("")),
  isActive: z.boolean().optional().default(true),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

export const updateServiceSchema = serviceSchema.partial();
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
