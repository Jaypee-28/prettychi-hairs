import { z } from "zod";

export const UpdateSettingsSchema = z.object({
  storeName: z.string().optional(),
  supportEmail: z.string().email("Invalid email").optional(),
  ukDeliveryFee: z.number().min(0, "Must be 0 or greater").optional(),
  intlDeliveryFee: z.number().min(0, "Must be 0 or greater").optional(),
  // Hero section fields
  heroVideoUrl: z.string().nullable().optional(),
  heroTopLabel: z.string().optional(),
  heroTitle: z.string().optional(),
  heroWords: z.array(z.string()).optional(),
  heroSubtitle: z.string().optional(),
  heroPrimaryCTA: z.string().optional(),
  heroSecondaryCTA: z.string().optional(),
  currency: z.string().optional(),
});

export type UpdateSettingsInput = z.infer<typeof UpdateSettingsSchema>;
