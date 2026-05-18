import { NextResponse } from "next/server";
import { testimonialService } from "@/modules/testimonials/testimonial.service";

// Admin route to fetch ALL testimonials (pending and approved)
export async function GET() {
  try {
    const testimonials = await testimonialService.getAllTestimonialsAdmin();
    return NextResponse.json(testimonials);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
