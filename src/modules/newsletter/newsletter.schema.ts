import { z } from "zod";

export const SubscribeNewsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const BroadcastNewsletterSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});
