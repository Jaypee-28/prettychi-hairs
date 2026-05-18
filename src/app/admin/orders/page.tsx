import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ShoppingBag, Eye, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getGlobalCurrency } from "@/lib/settings";

export const revalidate = 0;

function getPaymentBadge(status: string) {
  switch (status) {
    case "SUCCESS":
      return { label: "Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "PENDING":
      return { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" };
    case "FAILED":
      return { label: "Failed", className: "bg-red-50 text-red-700 border-red-200" };
    default:
      return { label: status, className: "bg-gray-50 text-gray-700 border-gray-200" };
  }
}

function getOrderBadge(status: string) {
  switch (status) {
    case "PENDING":
      return { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" };
    case "PAID":
      return { label: "Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "SHIPPED":
      return { label: "Shipped", className: "bg-blue-50 text-blue-700 border-blue-200" };
    case "DELIVERED":
      return { label: "Delivered", className: "bg-purple-50 text-purple-700 border-purple-200" };
    case "CANCELLED":
      return { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-200" };
    default:
      return { label: status, className: "bg-gray-50 text-gray-700 border-gray-200" };
  }
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const currency = await getGlobalCurrency();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Orders</h1>
          <p className="text-gray-500 font-semibold mt-1">
            Manage and track all customer orders.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-pink-50 text-[#FF4D8D] px-4 py-2 rounded-xl font-bold text-sm border border-pink-100">
            {orders.length} Total Orders
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                  Order ID
                </th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                  Customer
                </th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                  Total
                </th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                  Payment
                </th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-6 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => {
                const paymentBadge = getPaymentBadge(order.paymentStatus);
                const orderBadge = getOrderBadge(order.status);
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/50 transition group"
                  >
                    <td className="px-8 py-5 whitespace-nowrap">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono font-bold text-sm text-gray-900 hover:text-[#FF4D8D] transition-colors uppercase tracking-wider"
                      >
                        #{order.id.slice(-8)}
                      </Link>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {order.fullName}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">
                          {order.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <p className="text-lg font-black text-gray-900">
                        {formatPrice(order.totalAmount, currency)}
                      </p>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          paymentBadge.className
                        )}
                      >
                        {paymentBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          orderBadge.className
                        )}
                      >
                        {orderBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <p className="text-sm text-gray-500 font-medium">
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(order.createdAt), "h:mm a")}
                      </p>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-[#FF4D8D] hover:text-white font-bold text-xs transition-all border border-gray-200 hover:border-transparent hover:shadow-lg hover:shadow-pink-100"
                      >
                        <Eye size={14} strokeWidth={2.5} />
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 border border-dashed border-gray-200">
                        <ShoppingBag size={32} />
                      </div>
                      <p className="font-bold text-gray-500">
                        No orders found yet.
                      </p>
                      <p className="text-sm text-gray-400">
                        Orders will appear here when customers make purchases.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 border border-dashed border-gray-200 mx-auto mb-4">
              <ShoppingBag size={28} />
            </div>
            <p className="font-bold text-gray-500">No orders found yet.</p>
          </div>
        )}
        {orders.map((order) => {
          const paymentBadge = getPaymentBadge(order.paymentStatus);
          const orderBadge = getOrderBadge(order.status);
          return (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="block bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-pink-100 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono font-bold text-sm text-gray-900 uppercase tracking-wider group-hover:text-[#FF4D8D] transition-colors">
                    #{order.id.slice(-8)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {format(new Date(order.createdAt), "MMM d, yyyy · h:mm a")}
                  </p>
                </div>
                <p className="text-lg font-black text-gray-900">
                  {formatPrice(order.totalAmount, currency)}
                </p>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                  <Package size={16} className="text-gray-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{order.fullName}</p>
                  <p className="text-xs text-gray-400">{order.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    paymentBadge.className
                  )}
                >
                  {paymentBadge.label}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    orderBadge.className
                  )}
                >
                  {orderBadge.label}
                </span>
                <span className="text-xs text-gray-400 ml-auto">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
