import { prisma } from "../../lib/db";
import { Prisma } from "@/generated/prisma";

export interface ProductFilterOptions {
  includeRelations?: boolean;
  categoryId?: string;
  categorySlug?: string;
  search?: string;
  sort?: string;
  variantFilters?: Record<string, string[]>;
  tags?: string[];
  isFeatured?: boolean;
}

export class ProductRepository {
  async findAll(options: ProductFilterOptions = {}) {
    const { 
      includeRelations = false, 
      categoryId, 
      categorySlug, 
      search, 
      sort,
      variantFilters,
      tags,
      isFeatured
    } = options;

    const where: Prisma.ProductWhereInput = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    if (variantFilters && Object.keys(variantFilters).length > 0) {
      // Normalize values for searching as well to be robust
      const { normalizeAttributeValue } = await import("@/lib/filter-utils");
      
      const variantConditions = Object.entries(variantFilters).map(([attribute, values]) => {
        if (!values || values.length === 0) return null;
        
        // Match both the exact selected value and potentially other variations if data isn't perfectly normalized
        return {
          variants: {
            some: {
              options: {
                some: {
                  attribute: { equals: attribute, mode: 'insensitive' as Prisma.QueryMode },
                  value: { in: values, mode: 'insensitive' as Prisma.QueryMode }
                }
              }
            }
          }
        };
      }).filter(Boolean) as Prisma.ProductWhereInput[];

      if (variantConditions.length > 0) {
        where.AND = [
          ...(where.AND as Prisma.ProductWhereInput[] || []),
          ...variantConditions
        ];
      }
    }

    if (search) {
      const searchCondition = {
        OR: [
          { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { tags: { has: search } },
          { category: { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } } },
          { category: { slug: { contains: search, mode: 'insensitive' as Prisma.QueryMode } } },
        ]
      };
      
      if (where.AND) {
        (where.AND as Prisma.ProductWhereInput[]).push(searchCondition);
      } else {
        where.AND = [searchCondition];
      }
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] = { createdAt: "desc" };

    if (sort === "price_asc") {
      orderBy = { basePrice: "asc" };
    } else if (sort === "price_desc") {
      orderBy = { basePrice: "desc" };
    } else if (sort === "newest") {
      orderBy = { createdAt: "desc" };
    } else if (sort === "featured") {
      orderBy = [
        { isFeatured: "desc" },
        { createdAt: "desc" }
      ];
    }

    return prisma.product.findMany({
      where,
      orderBy,
      include: includeRelations ? {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { include: { options: true } }
      } : undefined
    });
  }

  async getFilterOptions() {
    const options = await prisma.variantOption.findMany({
      select: {
        attribute: true,
        value: true,
      },
    });

    const { normalizeAttributeValue, sortAttributeValues } = await import("@/lib/filter-utils");

    const grouped = options.reduce((acc, curr) => {
      const normalizedValue = normalizeAttributeValue(curr.attribute, curr.value);
      
      if (!acc[curr.attribute]) acc[curr.attribute] = [];
      if (!acc[curr.attribute].includes(normalizedValue)) {
        acc[curr.attribute].push(normalizedValue);
      }
      return acc;
    }, {} as Record<string, string[]>);

    // Sort each group
    Object.keys(grouped).forEach(attr => {
      grouped[attr] = sortAttributeValues(attr, grouped[attr]);
    });

    // Also get unique tags
    const products = await prisma.product.findMany({
      select: { tags: true }
    });
    
    const allTags = Array.from(new Set(products.flatMap(p => p.tags)));
    
    return {
      attributes: grouped,
      tags: allTags
    };
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { include: { options: true } }
      }
    });
  }

  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { include: { options: true } }
      }
    });
  }

  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
      include: {
        images: true,
        variants: { include: { options: true } }
      }
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        images: true,
        variants: { include: { options: true } }
      }
    });
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}

export const productRepository = new ProductRepository();
