import { NextResponse } from "next/server";
import { auth } from "@/auth.node";
import { userService } from "@/modules/users/services/user.service";
import { UpdateProfileSchema } from "@/modules/users/types/user.schema";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await userService.getProfile(session.user.id);
    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Get Profile Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = UpdateProfileSchema.parse(body);
    const user = await userService.updateProfile(session.user.id, parsed);

    return NextResponse.json(user);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Update Profile Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await userService.deleteAccount(session.user.id);
    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error: any) {
    console.error("Delete Account Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
