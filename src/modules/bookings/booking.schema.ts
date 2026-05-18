import { z } from "zod";

export const TIME_SLOTS = [
  "09:00 - 11:00",
  "11:00 - 13:00",
  "13:00 - 15:00",
  "15:00 - 17:00",
] as const;

export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  preferredDate: z.string().or(z.date()).transform((val) => new Date(val)),
  preferredTime: z.enum(TIME_SLOTS, {
    error: "Invalid time slot selected",
  }),
  notes: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const updateBookingStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
});

export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;

