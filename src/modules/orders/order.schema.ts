import { z } from "zod";

export const OrderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  quantity: z.number().min(1),
  price: z.number(),
  variantSnapshot: z.record(z.string(), z.string()),
  imageUrl: z.string().optional(),
  slug: z.string(),
});

export const CreateOrderSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  country: z.string().min(2, "Country is required"),
  state: z.string().min(2, "State/Province is required"),
  city: z.string().min(2, "City is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  postalCode: z.string().min(3, "Postal code is required"),
  items: z.array(OrderItemSchema).min(1, "Cart cannot be empty"),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
