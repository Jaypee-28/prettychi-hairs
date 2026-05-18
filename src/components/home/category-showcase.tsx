import { prisma } from "@/lib/db";
import { CategoryGrid } from "./category-grid";

export async function CategoryShowcase() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: 'asc'
    },
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
    }
  });

  return <CategoryGrid categories={categories} />;
}
