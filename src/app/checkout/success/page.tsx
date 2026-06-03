"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  Package, 
  ArrowRight, 
  Mail, 
  Sparkles,
  ShoppingCart
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto space-y-10">
      <div className="relative">
        <div className="w-32 h-32 bg-emerald-50 rounded-[3rem] flex items-center justify-center text-emerald-500 relative z-10 animate-in zoom-in duration-700">
          <CheckCircle2 size={64} strokeWidth={2.5} />
        </div>
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-[#FF4D8D] animate-bounce">
          <Sparkles size={24} />
        </div>
        <div className="absolute inset-0 bg-emerald-100 blur-3xl opacity-30 rounded-full"></div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-emerald-600">
          <span className="text-xs font-black uppercase tracking-[0.4em]">Order Confirmed</span>
        </div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
          THANK YOU <br/>FOR YOUR <span className="text-[#FF4D8D]">ORDER</span>
        </h1>
        <p className="text-gray-500 font-semibold text-lg">
          Your order <span className="text-gray-900 font-black">#{orderId?.slice(-6).toUpperCase()}</span> has been placed successfully. We're getting it ready for fulfillment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
            <Mail size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-gray-900 uppercase">Confirmation Sent</p>
            <p className="text-[10px] font-bold text-gray-400 mt-0.5">Check your email for details</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-gray-900 uppercase">Preparing Shipment</p>
            <p className="text-[10px] font-bold text-gray-400 mt-0.5">Estimated: 2-4 business days</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Link 
          href="/products" 
          className="flex-1 bg-gray-900 text-white py-5 rounded-[2rem] font-black text-sm tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-3 uppercase shadow-2xl shadow-gray-200"
        >
          <ShoppingCart size={18} />
          Continue Shopping
        </Link>
        <Link 
          href="/" 
          className="flex-1 bg-white border-2 border-gray-100 text-gray-900 py-5 rounded-[2rem] font-black text-sm tracking-widest hover:border-gray-200 transition-all flex items-center justify-center gap-3 uppercase"
        >
          Order History
          <ArrowRight size={18} />
        </Link>
      </div>

      <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
        Luxury Pretty Chi Hairs Experience • Lagos, Nigeria
      </p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#FF4D8D]" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}

function Loader2({ className }: { className: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
