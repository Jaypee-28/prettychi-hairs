"use client";

import { useState } from "react";
import { toast } from "sonner";

const ORDER_STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

function getStatusStyle(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "PAID":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "SHIPPED":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "DELIVERED":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export default function OrderStatusUpdate({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleUpdate(newStatus: string) {
    if (newStatus === status) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }

      setStatus(newStatus);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
        Update Status
      </label>
      <div className="flex flex-wrap gap-2">
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => handleUpdate(s)}
            disabled={isUpdating || s === status}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              s === status
                ? `${getStatusStyle(s)} ring-2 ring-offset-1 ring-gray-300`
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      {isUpdating && (
        <p className="text-xs text-gray-400 font-medium animate-pulse">
          Updating status...
        </p>
      )}
    </div>
  );
}
