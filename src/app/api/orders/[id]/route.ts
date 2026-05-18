import { NextResponse } from "next/server";
import { auth } from "@/auth.node";
import { orderService } from "@/modules/orders/order.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    // Must be authenticated to view any order
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await orderService.getOrder(id);

    // Security: Admin can view any order, users can ONLY view their own
    // Orders with null userId are NOT accessible to regular users
    const isAdmin = (session.user as any).userType === "admin";
    const isOwner = order.userId !== null && order.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    if (error.message === "Order not found") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    console.error("Fetch Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    // Only admins can update order status
    if ((session?.user as any)?.userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status, paymentStatus } = body;

    const order = await orderService.updateOrderStatus(id, status, paymentStatus);
    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Update Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
