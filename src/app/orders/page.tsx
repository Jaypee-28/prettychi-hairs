import { auth } from "@/auth.node";
import { redirect } from "next/navigation";
import { orderService } from "@/modules/orders/order.service";
import { sanitizeData } from "@/lib/utils";
import { OrdersContent } from "@/components/shop/orders-content";

export const metadata = {
  title: "My Orders | Pretty Chi Hairs",
  description: "View and track your Pretty Chi Hairs orders",
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/orders");
  }

  const rawOrders = await orderService.getUserOrders(session.user.id);
  const orders = sanitizeData(rawOrders) as any;

  return <OrdersContent orders={orders} />;
}
