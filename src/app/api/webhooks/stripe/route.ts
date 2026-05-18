import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { orderService } from "@/modules/orders/order.service";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature") as string;

  let event;

  try {
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Missing signature or webhook secret");
    }
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        console.log(`[Stripe Webhook] Checkout session completed for order: ${orderId}`);
        await orderService.updateOrderStatus(orderId, "PAID", "SUCCESS");
      }
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as any;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        console.log(`[Stripe Webhook] Payment intent succeeded for order: ${orderId}`);
        await orderService.updateOrderStatus(orderId, "PAID", "SUCCESS");
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as any;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        console.log(`[Stripe Webhook] Payment intent failed for order: ${orderId}`);
        await orderService.updateOrderStatus(orderId, "PENDING", "FAILED");
      }
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as any;
      const orderId = charge.metadata?.orderId;

      if (orderId) {
        console.log(`[Stripe Webhook] Charge refunded for order: ${orderId}`);
        await orderService.updateOrderStatus(orderId, "REFUNDED", "REFUNDED");
      }
      break;
    }

    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
