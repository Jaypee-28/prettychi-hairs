"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Package,
  Sparkles,
  ShoppingCart,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string | null;
}

interface Order {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  createdAt: string;
}

interface OrdersContentProps {
  orders: Order[];
}

// ── Status Helpers ───────────────────────────────────────────────────────────

const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: <Clock size={12} strokeWidth={3} />,
  },
  PAID: {
    label: "Paid",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: <CheckCircle2 size={12} strokeWidth={3} />,
  },
  SHIPPED: {
    label: "Shipped",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: <Truck size={12} strokeWidth={3} />,
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-violet-700",
    bg: "bg-violet-50 border-violet-200",
    icon: <CheckCircle2 size={12} strokeWidth={3} />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: <XCircle size={12} strokeWidth={3} />,
  },
};

const PAYMENT_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PENDING: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
  SUCCESS: {
    label: "Paid",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  FAILED: {
    label: "Failed",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
  },
};

function StatusBadge({
  config,
  icon,
}: {
  config: { label: string; color: string; bg: string };
  icon?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
        config.bg,
        config.color
      )}
    >
      {icon}
      {config.label}
    </span>
  );
}

// ── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="w-24 h-24 bg-pink-50 rounded-[2rem] flex items-center justify-center mb-8">
        <ShoppingCart size={40} className="text-[#FF4D8D]" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-3">
        No Orders Yet
      </h2>
      <p className="text-gray-500 font-medium mb-8 max-w-md">
        You haven&apos;t placed any orders yet. Start exploring our premium
        collection and find something you love.
      </p>
      <Link
        href="/products"
        className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#FF4D8D] transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-pink-200"
      >
        <ShoppingCart size={18} />
        Start Shopping
        <ArrowRight size={16} strokeWidth={3} />
      </Link>
    </div>
  );
}

// ── Desktop Table Row ────────────────────────────────────────────────────────

function OrderTableRow({ order }: { order: Order }) {
  const orderConfig = ORDER_STATUS_CONFIG[order.status] ?? ORDER_STATUS_CONFIG.PENDING;
  const paymentConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus] ?? PAYMENT_STATUS_CONFIG.PENDING;

  return (
    <tr className="group hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-5">
        <span className="text-sm font-black text-gray-900 uppercase tracking-wider">
          #{order.id.slice(-8)}
        </span>
      </td>
      <td className="px-6 py-5">
        <span className="text-sm font-bold text-gray-600">
          {format(new Date(order.createdAt), "dd MMM yyyy")}
        </span>
      </td>
      <td className="px-6 py-5">
        <span className="text-sm font-black text-gray-900">
          ₦{order.totalAmount.toFixed(2)}
        </span>
      </td>
      <td className="px-6 py-5">
        <StatusBadge config={paymentConfig} />
      </td>
      <td className="px-6 py-5">
        <StatusBadge config={orderConfig} icon={orderConfig.icon} />
      </td>
      <td className="px-6 py-5 text-right">
        <Link
          href={`/orders/${order.id}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest text-gray-600 hover:border-[#FF4D8D] hover:text-[#FF4D8D] transition-all duration-300 group-hover:border-[#FF4D8D] group-hover:text-[#FF4D8D]"
        >
          View Details
          <ChevronRight
            size={14}
            strokeWidth={3}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </Link>
      </td>
    </tr>
  );
}

// ── Mobile Card ──────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const orderConfig = ORDER_STATUS_CONFIG[order.status] ?? ORDER_STATUS_CONFIG.PENDING;
  const paymentConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus] ?? PAYMENT_STATUS_CONFIG.PENDING;

  return (
    <Link
      href={`/orders/${order.id}`}
      className="block bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:border-pink-100 transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Order
          </span>
          <p className="text-sm font-black text-gray-900 uppercase tracking-wider">
            #{order.id.slice(-8)}
          </p>
        </div>
        <ChevronRight
          size={20}
          className="text-gray-300 group-hover:text-[#FF4D8D] transition-all duration-300 group-hover:translate-x-1"
        />
      </div>

      {/* Date & Amount */}
      <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-50">
        <span className="text-sm font-bold text-gray-500">
          {format(new Date(order.createdAt), "dd MMM yyyy")}
        </span>
        <span className="text-lg font-black text-gray-900">
          ₦{order.totalAmount.toFixed(2)}
        </span>
      </div>

      {/* Item Count */}
      <div className="flex items-center gap-2 mb-4">
        <Package size={14} className="text-gray-400" />
        <span className="text-xs font-bold text-gray-500">
          {order.items.length} {order.items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        <StatusBadge config={paymentConfig} />
        <StatusBadge config={orderConfig} icon={orderConfig.icon} />
      </div>
    </Link>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export function OrdersContent({ orders }: OrdersContentProps) {
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBFCFD]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
          {/* Header */}
          <div className="space-y-1 mb-16">
            <div className="flex items-center gap-2 text-[#FF4D8D]">
              <Sparkles size={14} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                My Orders
              </span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
              YOUR <span className="text-[#FF4D8D]">ORDERS</span>
            </h1>
          </div>
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFCFD] pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#FF4D8D]">
              <Sparkles size={14} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                My Orders
              </span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
              YOUR <span className="text-[#FF4D8D]">ORDERS</span>
            </h1>
          </div>
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
            {orders.length} {orders.length === 1 ? "ORDER" : "ORDERS"}
          </span>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Order ID
                </th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Total
                </th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Payment
                </th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <OrderTableRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}
