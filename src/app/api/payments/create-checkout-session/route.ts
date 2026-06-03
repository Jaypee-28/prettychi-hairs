import { NextResponse } from "next/server";
import { initializePayment } from "@/lib/paystack";
import { orderService } from "@/modules/orders/order.service";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const { orderId } = await bodyToJSON(req);
    
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await orderService.getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "SUCCESS") {
      return NextResponse.json({ error: "Order is already paid" }, { status: 400 });
    }

    const headerList = await headers();
    const origin = headerList.get("origin") || "http://localhost:3000";

    // Create Paystack checkout session
    const amountInKobo = Math.round(Number(order.totalAmount) * 100);
    const reference = `ORD_${order.id}_${Date.now()}`;

    // Store the generated reference to verify later
    await orderService.updatePaystackReference(order.id, reference);

    const session = await initializePayment({
      email: order.email,
      amount: amountInKobo,
      reference,
      callback_url: `${origin}/checkout/success?orderId=${order.id}`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json({ url: session.authorization_url });
  } catch (error: any) {
    console.error("Paystack Session Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function bodyToJSON(req: Request) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}
