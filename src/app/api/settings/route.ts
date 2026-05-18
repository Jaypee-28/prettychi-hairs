import { NextResponse } from "next/server";
import { auth } from "@/auth.node";
import { settingService } from "@/modules/settings/setting.service";
import { UpdateSettingsSchema } from "@/modules/settings/setting.schema";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await settingService.getSettings();
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Fetch Settings Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = UpdateSettingsSchema.parse(body);
    const settings = await settingService.updateSettings(parsed);
    
    return NextResponse.json(settings);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Update Settings Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
