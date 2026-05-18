import { prisma } from "@/lib/db";
import { FeaturedCarousel } from "./featured-carousel";

export async function FeaturedProducts() {
  // Try to fetch featured products first
  let products = await prisma.product.findMany({
    where: { isFeatured: true },
    include: { category: true },
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  // Fallback to latest products if no featured products exist
  if (products.length === 0) {
    products = await prisma.product.findMany({
      include: { category: true },
      take: 10,
      orderBy: { createdAt: "desc" },
    });
  }

  // Map to the format needed by the client component
  const formattedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.basePrice),
    imageUrl: p.thumbnailUrl,
    categoryName: p.category?.name || "Premium Collection",
    isFeatured: p.isFeatured,
  }));

  return <FeaturedCarousel products={formattedProducts} />;
}
