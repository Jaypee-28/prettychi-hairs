import { NextResponse } from "next/server";
import { orderService } from "@/modules/orders/order.service";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-paystack-signature") as string;

    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret || !signature) {
      return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
    }

    const hash = crypto.createHmac("sha512", secret).update(bodyText).digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(bodyText);

    switch (event.event) {
      case "charge.success": {
        const orderId = event.data.metadata?.orderId;
        if (orderId) {
          console.log(`[Paystack Webhook] Charge successful for order: ${orderId}`);
          await orderService.updateOrderStatus(orderId, "PAID", "SUCCESS");
        }
        break;
      }
      
      default:
        console.log(`[Paystack Webhook] Unhandled event type: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`Paystack Webhook Error: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
