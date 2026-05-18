import { NextResponse } from "next/server";
import { faqService } from "@/modules/faqs/faq.service";
import { UpdateFAQSchema } from "@/modules/faqs/faq.schema";

// GET all FAQs (Admin)
// We use a specific admin endpoint or just filter via query params, but we can also add a /api/faqs/admin route. 
// For simplicity, we'll put the admin GET in a separate route if needed, or use a query param.
// Wait, the id route is for single FAQ operations.

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = UpdateFAQSchema.parse(body);
    
    const updated = await faqService.updateFAQ(id, data);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await faqService.deleteFAQ(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
