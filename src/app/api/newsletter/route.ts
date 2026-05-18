import { NextResponse } from "next/server";
import { newsletterService } from "@/modules/newsletter/newsletter.service";
import { SubscribeNewsletterSchema } from "@/modules/newsletter/newsletter.schema";

export async function GET() {
  try {
    const subscribers = await newsletterService.getAllSubscribers();
    return NextResponse.json(subscribers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SubscribeNewsletterSchema.parse(body);
    const subscriber = await newsletterService.subscribe(parsed);
    return NextResponse.json(subscriber, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
