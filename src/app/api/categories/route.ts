import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { categoryService } from "@/modules/categories/category.service";
import { CreateCategorySchema } from "@/modules/categories/category.schema";

export async function GET() {
  try {
    const categories = await categoryService.getAllCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateCategorySchema.parse(body);
    const category = await categoryService.createCategory(parsed);
    revalidatePath("/", "layout");
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
