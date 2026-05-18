import { NextResponse } from "next/server";
import { ContactFormSchema } from "@/modules/contact/contact.schema";
import { sendContactEmail } from "@/modules/emails/contact-email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ContactFormSchema.parse(body);
    
    await sendContactEmail(parsed);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.name === "ZodError") {
      const errors = error.errors.map((e: any) => e.message).join(", ");
      return NextResponse.json({ error: errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to send message. Please try again later." }, { status: 500 });
  }
}
