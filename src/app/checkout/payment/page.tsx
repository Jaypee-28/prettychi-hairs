"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  CreditCard, 
  Loader2, 
  ShieldCheck, 
  Lock, 
  ChevronRight, 
  Sparkles,
  Package,
  Truck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!orderId) {
      router.push("/products");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Order not found");
        setOrder(data);
      } catch (error: any) {
        toast.error(error.message);
        router.push("/cart");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  const handlePayment = async () => {
    setPaying(true);
    try {
      const res = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate payment");

      // Redirect to Stripe
      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error.message);
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[#FF4D8D]" size={48} />
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Preparing Secure Checkout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFCFD] pb-32">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-[#FF4D8D] bg-pink-50 px-4 py-1.5 rounded-full">
            <Lock size={14} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Secure Payment</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
            COMPLETE YOUR <span className="text-[#FF4D8D]">PURCHASE</span>
          </h1>
          <p className="text-gray-500 font-semibold max-w-md mx-auto">
            Order <span className="text-gray-900">#{order.id.slice(-6).toUpperCase()}</span> is ready. Secure your luxury selection now.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Order Details */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-gray-900 uppercase flex items-center gap-2">
                Order Summary
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D8D]"></span>
              </h3>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.productName} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate uppercase">{item.productName}</p>
                      <p className="text-xs font-bold text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-black text-gray-900">£{parseFloat(item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-50 space-y-3">
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>Subtotal</span>
                  <span>£{(parseFloat(order.totalAmount) - parseFloat(order.deliveryFee)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>Delivery</span>
                  <span>£{parseFloat(order.deliveryFee).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total</span>
                  <span className="text-3xl font-black text-[#FF4D8D]">£{parseFloat(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-gray-200 space-y-6">
              <h3 className="text-lg font-black uppercase flex items-center gap-2">
                Delivery Details
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D8D]"></span>
              </h3>
              <div className="space-y-4 text-gray-400 text-sm font-bold">
                <div className="flex gap-3">
                  <Package size={18} className="text-[#FF4D8D] flex-shrink-0" />
                  <p>{order.fullName}<br/>{order.email}</p>
                </div>
                <div className="flex gap-3">
                  <Truck size={18} className="text-[#FF4D8D] flex-shrink-0" />
                  <p>{order.addressLine1}, {order.city}<br/>{order.postalCode}, {order.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Actions */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-pink-50/20 space-y-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-[#FF4D8D] mx-auto mb-4">
                  <CreditCard size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase">Secure Payment</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Powered by Stripe</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handlePayment}
                  disabled={paying}
                  className="w-full bg-[#FF4D8D] text-white py-6 rounded-[2rem] font-black text-base flex items-center justify-center gap-3 hover:bg-[#E6457E] transition-all shadow-xl shadow-pink-100 disabled:opacity-70 uppercase tracking-widest"
                >
                  {paying ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      Pay Now £{parseFloat(order.totalAmount).toFixed(2)}
                      <ChevronRight size={20} strokeWidth={3} />
                    </>
                  )}
                </button>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-center gap-6">
                    {/* Placeholder for Card Logos */}
                    <div className="w-10 h-6 bg-gray-50 rounded border border-gray-100 flex items-center justify-center text-[8px] font-black text-gray-300">VISA</div>
                    <div className="w-10 h-6 bg-gray-50 rounded border border-gray-100 flex items-center justify-center text-[8px] font-black text-gray-300">MC</div>
                    <div className="w-10 h-6 bg-gray-50 rounded border border-gray-100 flex items-center justify-center text-[8px] font-black text-gray-300">AMEX</div>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShieldCheck size={12} className="text-green-500" />
                    100% SECURE SSL ENCRYPTION
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-pink-50/50 rounded-3xl border border-pink-100 flex items-center gap-4">
              <Sparkles size={20} className="text-[#FF4D8D]" />
              <p className="text-xs font-bold text-pink-900">Your order is reserved for the next 30 minutes.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#FF4D8D]" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
