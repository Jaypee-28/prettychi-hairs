import { z } from "zod";

export const VariantOptionSchema = z.object({
  attribute: z.string().min(1, "Attribute is required"),
  value: z.string().min(1, "Value is required"),
});

export const ProductVariantSchema = z.object({
  sku: z.string().optional(),
  price: z.coerce.number().optional(), // Coerce handles string inputs from forms cleanly
  stock: z.coerce.number().int().default(0),
  options: z.array(VariantOptionSchema),
});

export const ProductImageSchema = z.object({
  url: z.string().min(1, "Image URL is required"),
  altText: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

export const CreateProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(2, "Description is required"),
  basePrice: z.coerce.number().nonnegative("Base price must be 0 or more"),
  categoryId: z.string().min(1, "Category is required"),
  isFeatured: z.boolean().default(false).optional(),
  thumbnailUrl: z.string().optional().or(z.literal("").transform(() => undefined)),
  tags: z.array(z.string()).default([]),
  images: z.array(ProductImageSchema).default([]),
  variants: z.array(ProductVariantSchema).default([]),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductVariantInput = z.infer<typeof ProductVariantSchema>;
