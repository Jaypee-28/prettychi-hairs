import { NextResponse } from "next/server";
import { auth } from "@/auth.node";
import { orderService } from "@/modules/orders/order.service";
import { CreateOrderSchema } from "@/modules/orders/order.schema";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    
    const parsed = CreateOrderSchema.parse(body);
    const order = await orderService.createOrder(parsed, session?.user?.id);
    
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Order Creation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await orderService.getUserOrders(session.user.id);
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
