import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/modules/auth/types";
import { sendWelcomeEmail } from "@/modules/emails/welcome-email";

const SALT_ROUNDS = 12;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path.join(".") || "_root";
        (fieldErrors[field] ||= []).push(issue.message);
      }
      return NextResponse.json(
        { success: false, error: { message: "Validation failed", fieldErrors } },
        { status: 400 },
      );
    }

    const { email, password, name } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: { message: "A user with this email already exists" } },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name: name ?? null },
    });

    sendWelcomeEmail({ name: name ?? "", email }).catch((err) => {
      console.error("[register] Welcome email dispatch failed:", err);
    });

    return NextResponse.json(
      { success: true, data: { user: { id: user.id, email: user.email, name: user.name } } },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[register] Error:", error);
    return NextResponse.json(
      { success: false, error: { message: "An unexpected error occurred" } },
      { status: 500 },
    );
  }
}
