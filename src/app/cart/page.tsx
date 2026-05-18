"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ShoppingCart, 
  Sparkles,
  CreditCard
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useSettings } from "@/components/providers/settings-provider";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const { currency } = useSettings();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBFCFD] flex flex-col items-center justify-center p-6 text-center space-y-8">
        <div className="w-32 h-32 bg-white rounded-[3rem] shadow-xl shadow-pink-50 flex items-center justify-center text-gray-200 border border-gray-100 relative">
          <ShoppingCart size={48} />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FF4D8D] rounded-full blur-xl opacity-50"></div>
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Your cart is empty</h1>
          <p className="text-gray-500 font-semibold text-lg max-w-sm mx-auto">
            Your next transformation is just a few clicks away. Explore our collections.
          </p>
        </div>
        <Link 
          href="/products" 
          className="bg-gray-900 text-white px-10 py-5 rounded-[2rem] font-black text-sm tracking-widest hover:bg-gray-800 transition-all shadow-2xl shadow-gray-200 uppercase"
        >
          START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFCFD] pb-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Cart Items List */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between pb-8 border-b border-gray-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#FF4D8D]">
                  <Sparkles size={14} strokeWidth={3} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Shopping Cart</span>
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                  YOUR <span className="text-[#FF4D8D]">CART</span>
                </h1>
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{totalItems} ITEMS</p>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white p-5 md:p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-md transition-all duration-300"
                >
                  {/* Left: Product Info */}
                  <div className="flex items-center gap-5">
                    <Link href={`/products/${item.slug}`} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                    </Link>
                    <div className="space-y-1">
                      <Link href={`/products/${item.slug}`} className="text-sm md:text-base font-bold text-gray-900 hover:text-[#FF4D8D] transition-colors uppercase tracking-tight">
                        {item.name}
                      </Link>
                      <p className="text-sm font-bold text-[#FF4D8D]">{formatPrice(item.price, currency)}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Object.entries(item.attributes).map(([key, val]) => (
                          <span key={key} className="text-[9px] font-bold text-gray-400 uppercase tracking-widest border border-gray-100 px-2 py-0.5 rounded-md">
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        <Minus size={14} strokeWidth={3} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Link 
              href="/products" 
              className="inline-flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors pt-4"
            >
              <ArrowLeft size={14} strokeWidth={3} />
              Continue Shopping
            </Link>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:w-[380px]">
             <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-pink-50/20 sticky top-10 space-y-8">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Order Summary</h2>
                
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-gray-500 font-bold text-sm">
                      <span>Subtotal</span>
                      <span className="text-gray-900 font-bold text-base">{formatPrice(totalPrice, currency)}</span>
                   </div>
                   <div className="flex justify-between items-center text-gray-500 font-bold text-sm">
                      <span>Shipping</span>
                      <span className="text-green-500 font-bold uppercase text-[10px] tracking-widest">Calculated at checkout</span>
                   </div>
                   <div className="flex justify-between items-center text-gray-500 font-bold text-sm">
                      <span>Taxes</span>
                      <span className="text-gray-900 font-bold text-base">{formatPrice(0, currency)}</span>
                   </div>
                   <div className="h-px bg-gray-50 w-full my-4"></div>
                   <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Total Amount</span>
                      <span className="text-3xl font-black text-[#FF4D8D] leading-none">{formatPrice(totalPrice, currency)}</span>
                   </div>
                </div>

                <div className="space-y-4 pt-2">
                   <Link href="/checkout" className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 uppercase tracking-widest">
                     <CreditCard size={18} />
                     PROCEED TO CHECKOUT
                   </Link>
                   <p className="text-[9px] font-bold text-gray-400 text-center uppercase tracking-widest flex items-center justify-center gap-2">
                     <ShieldCheck size={10} className="text-green-500" />
                     Secure SSL Encrypted Checkout
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShieldCheck({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
