import { auth } from "@/auth.node";
import { redirect } from "next/navigation";
import { orderService } from "@/modules/orders/order.service";
import { sanitizeData } from "@/lib/utils";
import { OrderDetailContent } from "@/components/shop/order-detail-content";

export const metadata = {
  title: "Order Details | Pretty Chi Hairs",
  description: "View your order details and tracking information",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    const { id } = await params;
    redirect(`/login?callbackUrl=/orders/${id}`);
  }

  const { id } = await params;

  const rawOrder = await orderService.getOrder(id);

  // Security: Users can ONLY view their own orders
  // Orders with null userId are NOT accessible to regular users
  const isAdmin = (session.user as any).userType === "admin";
  const isOwner = rawOrder.userId !== null && rawOrder.userId === session.user.id;

  if (!isAdmin && !isOwner) {
    redirect("/orders");
  }

  // sanitizeData converts Prisma Decimal to number at runtime
  // We cast to any because TS can't infer the Decimal→number conversion
  const order = sanitizeData(rawOrder) as any;

  return <OrderDetailContent order={order} />;
}
