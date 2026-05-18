import { productService } from "@/modules/products/product.service";
import { categoryService } from "@/modules/categories/category.service";
import { EditProductForm } from "@/components/admin/edit-product-form";
import { notFound } from "next/navigation";
import { ProductWithRelations } from "@/modules/products/product.types";
import { sanitizeData } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  
  const [product, categories] = await Promise.all([
    productService.getProductById(id) as Promise<ProductWithRelations | null>,
    categoryService.getAllCategories()
  ]);

  if (!product) {
    return notFound();
  }

  return <EditProductForm product={sanitizeData(product)} categories={sanitizeData(categories)} />;
}
