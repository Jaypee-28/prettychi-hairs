import { productRepository, ProductFilterOptions } from "./product.repository";
import { CreateProductInput, UpdateProductInput } from "./product.schema";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function generateSku(slug: string, index: number): string {
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${slug.substring(0, 20).toUpperCase().replace(/-/g, "-")}-V${index + 1}-${suffix}`;
}

import { normalizeAttributeValue } from "@/lib/filter-utils";

function deduplicateOptions(options: { attribute: string; value: string }[]) {
  const seen = new Set<string>();
  return options.filter(opt => {
    const key = opt.attribute.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export class ProductService {
  async getAllProducts(options: ProductFilterOptions = {}) {
    return productRepository.findAll(options);
  }

  async getFilterOptions() {
    return productRepository.getFilterOptions();
  }

  async getProductById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) throw new Error("Product not found");
    return product;
  }

  async getProductBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) throw new Error("Product not found");
    return product;
  }

  async createProduct(input: CreateProductInput) {
    let slug = generateSlug(input.name);
    
    const existing = await productRepository.findBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    // Prepare nested data
    const imagesData = input.images.map((img) => ({
      url: img.url,
      altText: img.altText,
      sortOrder: img.sortOrder,
    }));

    const variantsData = input.variants
      .map((v, i) => {
        const validOptions = v.options.filter(opt => opt.attribute && opt.value);
        if (validOptions.length === 0) return null;

        return {
          sku: v.sku && v.sku.trim() ? v.sku.trim() : generateSku(slug, i),
          price: v.price !== undefined ? v.price : null,
          stock: v.stock,
          options: {
            create: deduplicateOptions(validOptions).map((opt) => ({
              attribute: opt.attribute,
              value: normalizeAttributeValue(opt.attribute, opt.value),
            }))
          }
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);

    return productRepository.create({
      name: input.name,
      slug,
      description: input.description,
      basePrice: input.basePrice,
      isFeatured: input.isFeatured,
      thumbnailUrl: input.thumbnailUrl || null,
      tags: input.tags,
      category: { connect: { id: input.categoryId } },
      images: { create: imagesData },
      variants: { create: variantsData },
    });
  }

  async updateProduct(id: string, input: UpdateProductInput) {
    const dataToUpdate: any = {};
    
    if (input.name) {
      dataToUpdate.name = input.name;
      dataToUpdate.slug = generateSlug(input.name);
      
      const existing = await productRepository.findBySlug(dataToUpdate.slug);
      if (existing && existing.id !== id) {
        dataToUpdate.slug = `${dataToUpdate.slug}-${Date.now()}`;
      }
    }
    
    if (input.description !== undefined) dataToUpdate.description = input.description;
    if (input.basePrice !== undefined) dataToUpdate.basePrice = input.basePrice;
    if (input.isFeatured !== undefined) dataToUpdate.isFeatured = input.isFeatured;
    if (input.thumbnailUrl !== undefined) dataToUpdate.thumbnailUrl = input.thumbnailUrl;
    if (input.tags !== undefined) dataToUpdate.tags = input.tags;
    if (input.categoryId !== undefined) dataToUpdate.category = { connect: { id: input.categoryId } };

    // Handle nested images if provided (simple replacement strategy)
    if (input.images) {
      dataToUpdate.images = {
        deleteMany: {}, // Delete old images
        create: input.images.map(img => ({
          url: img.url,
          altText: img.altText,
          sortOrder: img.sortOrder
        }))
      };
    }

    // Handle nested variants if provided (simple replacement strategy)
    if (input.variants) {
      dataToUpdate.variants = {
        deleteMany: {}, // Delete old variants and their options (handled by onDelete: Cascade in prisma)
        create: input.variants
          .map((v, i) => {
            const validOptions = v.options.filter(opt => opt.attribute && opt.value);
            if (validOptions.length === 0) return null;

            return {
              sku: v.sku && v.sku.trim() ? v.sku.trim() : generateSku(dataToUpdate.slug || id, i),
              price: v.price !== undefined ? v.price : null,
              stock: v.stock,
              options: {
                create: deduplicateOptions(validOptions).map(opt => ({
                  attribute: opt.attribute,
                  value: normalizeAttributeValue(opt.attribute, opt.value),
                }))
              }
            };
          })
          .filter((v): v is NonNullable<typeof v> => v !== null)
      };
    }

    return productRepository.update(id, dataToUpdate);
  }

  async deleteProduct(id: string) {
    return productRepository.delete(id);
  }
}

export const productService = new ProductService();
