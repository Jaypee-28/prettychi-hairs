import { NextRequest, NextResponse } from "next/server";
import { serviceService } from "@/modules/services/service.service";
import { serviceSchema } from "@/modules/services/service.schema";

export async function GET(req: NextRequest) {
  try {
    const services = await serviceService.getAllServices();
    return NextResponse.json(services);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = serviceSchema.parse(body);
    const service = await serviceService.createService(validatedData);
    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
