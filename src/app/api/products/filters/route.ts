import { NextResponse } from "next/server";
import { productService } from "@/modules/products/product.service";

export async function GET() {
  try {
    const filters = await productService.getFilterOptions();
    return NextResponse.json(filters);
  } catch (error: any) {
    console.error("Filter Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
