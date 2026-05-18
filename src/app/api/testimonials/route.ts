import { NextResponse } from "next/server";
import { testimonialService } from "@/modules/testimonials/testimonial.service";
import { CreateTestimonialSchema } from "@/modules/testimonials/testimonial.schema";

// Public route to fetch APPROVED testimonials
export async function GET() {
  try {
    const testimonials = await testimonialService.getApprovedTestimonials();
    return NextResponse.json(testimonials);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Public route to submit a new testimonial (defaults to pending approval)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateTestimonialSchema.parse(body);
    const testimonial = await testimonialService.createTestimonial(parsed);
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
