import { NextResponse } from "next/server";
import { testimonialService } from "@/modules/testimonials/testimonial.service";
import { UpdateTestimonialSchema } from "@/modules/testimonials/testimonial.schema";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = UpdateTestimonialSchema.parse(body);
    
    const updated = await testimonialService.updateApproval(id, parsed);
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await testimonialService.deleteTestimonial(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
