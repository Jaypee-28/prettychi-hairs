import { NextResponse } from "next/server";
import { faqService } from "@/modules/faqs/faq.service";
import { CreateFAQSchema } from "@/modules/faqs/faq.schema";

// GET active FAQs for the public frontend
export async function GET() {
  try {
    const faqs = await faqService.getActiveFAQs();
    return NextResponse.json(faqs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new FAQ (Admin)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = CreateFAQSchema.parse(body);
    const faq = await faqService.createFAQ(data);
    return NextResponse.json(faq);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
