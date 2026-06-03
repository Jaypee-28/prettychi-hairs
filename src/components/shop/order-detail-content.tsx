"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  Sparkles,
  ArrowLeft,
  Package,
  CreditCard,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  Gift,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  variantSnapshot: Record<string, string>;
  imageUrl?: string | null;
}

interface OrderUser {
  id: string;
  name: string | null;
  email: string | null;
}

interface OrderDetail {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  deliveryFee: number;
  currency: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  addressLine1: string;
  addressLine2?: string | null;
  postalCode: string;
  paystackReference?: string | null;
  items: OrderItem[];
  user?: OrderUser | null;
  createdAt: string;
}

interface OrderDetailContentProps {
  order: OrderDetail;
}

// ── Status Config ────────────────────────────────────────────────────────────

const STATUS_MESSAGES: Record<string, string> = {
  PENDING: "We've received your order",
  PAID: "Payment confirmed",
  SHIPPED: "Your order is on the way",
  DELIVERED: "Delivered successfully",
  CANCELLED: "Order cancelled",
};

const STATUS_BADGE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PENDING: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  SUCCESS: { label: "Paid", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  FAILED: { label: "Failed", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

// ── Tracking Timeline ────────────────────────────────────────────────────────

const TRACKING_STEPS = [
  {
    key: "PENDING",
    label: "Order Placed",
    message: "We've received your order",
    icon: Clock,
  },
  {
    key: "PAID",
    label: "Payment Confirmed",
    message: "Payment confirmed",
    icon: CreditCard,
  },
  {
    key: "SHIPPED",
    label: "Shipped",
    message: "Your order is on the way",
    icon: Truck,
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    message: "Delivered successfully",
    icon: Gift,
  },
];

const STATUS_ORDER = ["PENDING", "PAID", "SHIPPED", "DELIVERED"];

function getStepIndex(status: string): number {
  const idx = STATUS_ORDER.indexOf(status);
  return idx === -1 ? 0 : idx;
}

function OrderTrackingTimeline({ status }: { status: string }) {
  const isCancelled = status === "CANCELLED";
  const currentIndex = isCancelled ? -1 : getStepIndex(status);

  if (isCancelled) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-50 mb-8">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
            <XCircle size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 uppercase">
              Order Tracking
            </h3>
            <p className="text-xs font-bold text-gray-400 mt-0.5">
              Track your order status
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-[1.5rem] flex items-center justify-center mb-6">
            <XCircle size={36} className="text-red-500" strokeWidth={2} />
          </div>
          <h4 className="text-xl font-black text-red-600 uppercase tracking-tight mb-2">
            Order Cancelled
          </h4>
          <p className="text-sm font-medium text-gray-500 max-w-md">
            This order has been cancelled. If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10">
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-gray-50 mb-8">
        <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#FF4D8D]">
          <Truck size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900 uppercase">
            Order Tracking
          </h3>
          <p className="text-xs font-bold text-gray-400 mt-0.5">
            Track your order status
          </p>
        </div>
      </div>

      {/* Current Status Message — Prominent Display */}
      <div className="bg-gradient-to-r from-pink-50 to-violet-50 rounded-2xl p-6 mb-10 border border-pink-100">
        <p className="text-[10px] font-black text-[#FF4D8D] uppercase tracking-[0.3em] mb-1">
          Current Status
        </p>
        <p className="text-lg md:text-xl font-black text-gray-900">
          {STATUS_MESSAGES[status] || STATUS_MESSAGES.PENDING}
        </p>
      </div>

      {/* Desktop: Horizontal Stepper */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Background Track */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-gray-100 rounded-full" />

          {/* Active Track */}
          <div
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-[#FF4D8D] to-violet-500 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${(currentIndex / (TRACKING_STEPS.length - 1)) * 100}%`,
            }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {TRACKING_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentIndex;
              const isCurrent = idx === currentIndex;
              const StepIcon = step.icon;

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center"
                  style={{ width: "25%" }}
                >
                  {/* Circle */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-500 border-4",
                      isCurrent
                        ? "bg-[#FF4D8D] border-pink-200 text-white shadow-lg shadow-pink-200 scale-110"
                        : isCompleted
                          ? "bg-[#FF4D8D] border-pink-100 text-white"
                          : "bg-white border-gray-200 text-gray-300"
                    )}
                  >
                    {isCompleted && !isCurrent ? (
                      <CheckCircle2 size={20} strokeWidth={3} />
                    ) : (
                      <StepIcon size={20} strokeWidth={2.5} />
                    )}
                  </div>

                  {/* Label */}
                  <p
                    className={cn(
                      "mt-4 text-xs font-black uppercase tracking-wider text-center transition-colors",
                      isCurrent
                        ? "text-[#FF4D8D]"
                        : isCompleted
                          ? "text-gray-900"
                          : "text-gray-300"
                    )}
                  >
                    {step.label}
                  </p>

                  {/* Message */}
                  <p
                    className={cn(
                      "mt-1 text-[10px] font-medium text-center max-w-[120px] transition-colors",
                      isCurrent
                        ? "text-gray-600"
                        : isCompleted
                          ? "text-gray-400"
                          : "text-gray-200"
                    )}
                  >
                    {step.message}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Vertical Timeline */}
      <div className="md:hidden space-y-0">
        {TRACKING_STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const isLast = idx === TRACKING_STEPS.length - 1;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex gap-4">
              {/* Line + Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 border-[3px]",
                    isCurrent
                      ? "bg-[#FF4D8D] border-pink-200 text-white shadow-lg shadow-pink-200"
                      : isCompleted
                        ? "bg-[#FF4D8D] border-pink-100 text-white"
                        : "bg-white border-gray-200 text-gray-300"
                  )}
                >
                  {isCompleted && !isCurrent ? (
                    <CheckCircle2 size={16} strokeWidth={3} />
                  ) : (
                    <StepIcon size={16} strokeWidth={2.5} />
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 min-h-[40px] transition-colors",
                      isCompleted ? "bg-[#FF4D8D]" : "bg-gray-200"
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className={cn("pb-8", isLast && "pb-0")}>
                <p
                  className={cn(
                    "text-sm font-black uppercase tracking-wider transition-colors",
                    isCurrent
                      ? "text-[#FF4D8D]"
                      : isCompleted
                        ? "text-gray-900"
                        : "text-gray-300"
                  )}
                >
                  {step.label}
                </p>
                <p
                  className={cn(
                    "text-xs font-medium mt-1 transition-colors",
                    isCurrent
                      ? "text-gray-600"
                      : isCompleted
                        ? "text-gray-400"
                        : "text-gray-200"
                  )}
                >
                  {step.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Order Items Section ──────────────────────────────────────────────────────

function OrderItemsSection({ items }: { items: OrderItem[] }) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10">
      <div className="flex items-center gap-4 pb-6 border-b border-gray-50 mb-8">
        <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#FF4D8D]">
          <Package size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900 uppercase">
            Order Items
          </h3>
          <p className="text-xs font-bold text-gray-400 mt-0.5">
            {items.length} {items.length === 1 ? "item" : "items"} in this order
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-5 p-4 rounded-2xl hover:bg-gray-50/50 transition-colors"
          >
            {/* Product Image */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={24} className="text-gray-300" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900 uppercase tracking-wider truncate">
                {item.productName}
              </p>
              <p className="text-xs font-bold text-gray-400 mt-1">
                Qty: {item.quantity} × ₦{item.price.toFixed(2)}
              </p>

              {/* Variant Pills */}
              {item.variantSnapshot && Object.keys(item.variantSnapshot).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {Object.entries(item.variantSnapshot).map(([key, value]) => (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50 text-[9px] font-black uppercase tracking-widest text-[#FF4D8D] border border-pink-100"
                    >
                      {key}: {value}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="text-right shrink-0">
              <p className="text-sm font-black text-gray-900">
                ₦{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Order Summary Section ────────────────────────────────────────────────────

function OrderSummarySection({
  order,
}: {
  order: OrderDetail;
}) {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10">
      <div className="flex items-center gap-4 pb-6 border-b border-gray-50 mb-8">
        <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#FF4D8D]">
          <CreditCard size={24} strokeWidth={2.5} />
        </div>
        <h3 className="text-xl font-black text-gray-900 uppercase">
          Order Summary
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-gray-500">Subtotal</span>
          <span className="text-sm font-black text-gray-900">
            ₦{subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-500">Delivery Fee</span>
            <Truck size={14} className="text-[#FF4D8D]" />
          </div>
          <span className="text-sm font-black text-gray-900">
            ₦{order.deliveryFee.toFixed(2)}
          </span>
        </div>
        <div className="h-px bg-gray-100 my-4" />
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Total Amount
            </span>
            <p className="text-3xl font-black text-[#FF4D8D] leading-none mt-1">
              ₦{order.totalAmount.toFixed(2)}
            </p>
          </div>
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
            {order.currency}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Delivery Info Section ────────────────────────────────────────────────────

function DeliveryInfoSection({ order }: { order: OrderDetail }) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10">
      <div className="flex items-center gap-4 pb-6 border-b border-gray-50 mb-8">
        <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#FF4D8D]">
          <MapPin size={24} strokeWidth={2.5} />
        </div>
        <h3 className="text-xl font-black text-gray-900 uppercase">
          Delivery Information
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Full Name
          </p>
          <p className="text-sm font-bold text-gray-900">{order.fullName}</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Phone
          </p>
          <p className="text-sm font-bold text-gray-900">{order.phone}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Address
          </p>
          <p className="text-sm font-bold text-gray-900">
            {order.addressLine1}
            {order.addressLine2 && <>, {order.addressLine2}</>}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            City
          </p>
          <p className="text-sm font-bold text-gray-900">{order.city}</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            State / Province
          </p>
          <p className="text-sm font-bold text-gray-900">{order.state}</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Country
          </p>
          <p className="text-sm font-bold text-gray-900">{order.country}</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Postal Code
          </p>
          <p className="text-sm font-bold text-gray-900">{order.postalCode}</p>
        </div>
      </div>
    </div>
  );
}

// ── Payment Info Section ─────────────────────────────────────────────────────

function PaymentInfoSection({ order }: { order: OrderDetail }) {
  const config =
    STATUS_BADGE_CONFIG[order.paymentStatus] ?? STATUS_BADGE_CONFIG.PENDING;

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10">
      <div className="flex items-center gap-4 pb-6 border-b border-gray-50 mb-8">
        <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#FF4D8D]">
          <ShieldCheck size={24} strokeWidth={2.5} />
        </div>
        <h3 className="text-xl font-black text-gray-900 uppercase">
          Payment Information
        </h3>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Payment Status
          </p>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border",
              config.bg,
              config.color
            )}
          >
            {config.label}
          </span>
        </div>

        {(order as any).paystackReference && (
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Paystack Reference
            </p>
            <p className="text-sm font-mono font-bold text-gray-600 bg-gray-50 px-4 py-3 rounded-xl break-all">
              {(order as any).paystackReference}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export function OrderDetailContent({ order }: OrderDetailContentProps) {
  return (
    <div className="min-h-screen bg-[#FBFCFD] pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#FF4D8D]">
              <Sparkles size={14} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Order Details
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">
              ORDER{" "}
              <span className="text-[#FF4D8D]">#{order.id.slice(-8)}</span>
            </h1>
            <p className="text-sm font-bold text-gray-400 mt-1">
              Placed on {format(new Date(order.createdAt), "dd MMMM yyyy 'at' HH:mm")}
            </p>
          </div>
          <Link
            href="/orders"
            className="inline-flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={3} />
            Back to Orders
          </Link>
        </div>

        {/* Order Tracking — Section 1 (Most Prominent) */}
        <div className="mb-8">
          <OrderTrackingTimeline status={order.status} />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Order Items — Section 2 */}
            <OrderItemsSection items={order.items} />

            {/* Delivery Info — Section 3 */}
            <DeliveryInfoSection order={order} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-8">
            {/* Order Summary — Section 4 */}
            <OrderSummarySection order={order} />

            {/* Payment Info — Section 5 */}
            <PaymentInfoSection order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}
