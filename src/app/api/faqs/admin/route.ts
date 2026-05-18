import { NextResponse } from "next/server";
import { faqService } from "@/modules/faqs/faq.service";

export async function GET() {
  try {
    const faqs = await faqService.getAllFAQs();
    return NextResponse.json(faqs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
