import { z } from "zod";

export const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.enum(["General Inquiry", "Order Issue", "Booking Question"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
