import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ArrowLeft, User, MapPin, CreditCard, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getGlobalCurrency } from "@/lib/settings";
import OrderStatusUpdate from "./order-status-update";

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

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      items: true,
    },
  });

  if (!order) return notFound();

  const paymentBadge = getPaymentBadge(order.paymentStatus);
  const currency = await getGlobalCurrency();
  const subtotal = Number(order.totalAmount) - Number(order.deliveryFee);

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#FF4D8D] hover:text-white hover:border-transparent transition-all"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Order <span className="font-mono text-[#FF4D8D]">#{order.id.slice(-8).toUpperCase()}</span>
            </h1>
            <p className="text-gray-400 font-medium text-sm mt-0.5">
              Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border self-start",
            paymentBadge.className
          )}
        >
          Payment: {paymentBadge.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-[#FF4D8D] border border-pink-100 shadow-sm">
                  <Package size={18} strokeWidth={2.5} />
                </div>
                <h2 className="text-lg font-black text-gray-900 tracking-tight">
                  Order Items
                </h2>
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {order.items.map((item) => {
                const variant = item.variantSnapshot as Record<string, string> | null;
                return (
                  <div key={item.id} className="p-6 flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0 shadow-sm">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package size={24} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-base leading-tight">
                        {item.productName}
                      </p>

                      {/* Variant Pills */}
                      {variant && Object.keys(variant).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {Object.entries(variant).map(([attr, val]) => (
                            <span
                              key={attr}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-600 text-[11px] font-bold border border-gray-200"
                            >
                              {attr}: {val}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-sm text-gray-400 font-medium">
                          Qty: <span className="text-gray-900 font-bold">{item.quantity}</span>
                        </span>
                        <span className="text-sm text-gray-400 font-medium">
                          × {formatPrice(item.price, currency)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-black text-gray-900">
                        {formatPrice(Number(item.price) * item.quantity, currency)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="p-6 bg-gray-50/30 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="text-gray-900 font-bold">{formatPrice(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Delivery</span>
                <span className="text-gray-900 font-bold">{formatPrice(order.deliveryFee, currency)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-lg font-black text-gray-900">Total</span>
                <span className="text-lg font-black text-gray-900">
                  {formatPrice(order.totalAmount, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Controls */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
            <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
          </div>
        </div>

        {/* Right Column — Sidebar Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
                <User size={18} strokeWidth={2.5} />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                Customer
              </h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Name</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{order.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</p>
                <p className="text-sm font-medium text-gray-700 mt-0.5 break-all">{order.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Phone</p>
                <p className="text-sm font-medium text-gray-700 mt-0.5">{order.phone}</p>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                <MapPin size={18} strokeWidth={2.5} />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                Delivery Address
              </h3>
            </div>
            <div className="space-y-1 text-sm text-gray-700">
              <p className="font-bold text-gray-900">{order.addressLine1}</p>
              {order.addressLine2 && <p>{order.addressLine2}</p>}
              <p>
                {order.city}, {order.state}
              </p>
              <p>{order.postalCode}</p>
              <p className="font-bold text-gray-900 mt-2 pt-2 border-t border-gray-100">
                {order.country}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 border border-purple-100">
                <CreditCard size={18} strokeWidth={2.5} />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                Payment
              </h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Status
                </p>
                <span
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border mt-1",
                    paymentBadge.className
                  )}
                >
                  {paymentBadge.label}
                </span>
              </div>
              {order.paystackReference && (
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Paystack Reference
                  </p>
                  <p className="text-xs font-mono text-gray-600 mt-1 bg-gray-50 px-3 py-2 rounded-lg break-all border border-gray-100">
                    {order.paystackReference}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Currency
                </p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{order.currency}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
