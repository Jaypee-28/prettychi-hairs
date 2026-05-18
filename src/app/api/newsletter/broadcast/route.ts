import { NextResponse } from "next/server";
import { newsletterService } from "@/modules/newsletter/newsletter.service";
import { BroadcastNewsletterSchema } from "@/modules/newsletter/newsletter.schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = BroadcastNewsletterSchema.parse(body);
    const result = await newsletterService.broadcast(parsed);
    return NextResponse.json(result);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
