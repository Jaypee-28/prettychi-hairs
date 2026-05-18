import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
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

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: order.currency.toLowerCase(),
            product_data: {
              name: `Order #${order.id.slice(-6).toUpperCase()}`,
              description: `Payment for Pretty Chi Hairs Order`,
            },
            unit_amount: Math.round(Number(order.totalAmount) * 100), // Stripe expects cents/pence / kobo / etc.
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/checkout/success?orderId=${order.id}`,
      cancel_url: `${origin}/checkout/payment?orderId=${order.id}`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Session Error:", error);
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
