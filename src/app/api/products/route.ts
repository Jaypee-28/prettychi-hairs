import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { productService } from "@/modules/products/product.service";
import { CreateProductSchema } from "@/modules/products/product.schema";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    const variantFilters: Record<string, string[]> = {};
    const excludeParams = ["search", "sort", "categorySlug", "categoryId", "include", "tags", "isFeatured"];
    
    // Dynamically build variant filters from any other search params
    // We map param names back to potential attribute names (capitalized)
    searchParams.forEach((value, key) => {
      if (!excludeParams.includes(key)) {
        // Map common params back to attributes if needed, or just capitalize
        const attrName = key.charAt(0).toUpperCase() + key.slice(1);
        if (!variantFilters[attrName]) {
          variantFilters[attrName] = searchParams.getAll(key);
        }
      }
    });

    const options = {
      includeRelations: searchParams.get("include") === "true",
      categoryId: searchParams.get("categoryId") || undefined,
      categorySlug: searchParams.get("categorySlug") || undefined,
      search: searchParams.get("search") || undefined,
      sort: searchParams.get("sort") || undefined,
      variantFilters,
      tags: searchParams.getAll("tags"),
      isFeatured: searchParams.get("isFeatured") === "true" ? true : undefined,
    };

    const products = await productService.getAllProducts(options);
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Product Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateProductSchema.parse(body);
    const product = await productService.createProduct(parsed);
    revalidatePath("/", "layout");
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      console.error("Validation Error Details:", JSON.stringify(error.errors, null, 2));
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Product Creation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
