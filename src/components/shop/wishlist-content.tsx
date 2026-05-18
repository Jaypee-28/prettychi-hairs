"use client";

import React, { useState } from "react";
import { ProductWithRelations } from "@/modules/products/product.types";
import { ProductCard } from "./product-card";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface WishlistContentProps {
  initialProducts: ProductWithRelations[];
}

export function WishlistContent({ initialProducts }: WishlistContentProps) {
  const [products, setProducts] = useState(initialProducts);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="relative">
          <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center text-[#FF4D8D]">
            <Heart size={48} />
          </div>
          <Sparkles className="absolute -top-2 -right-2 text-amber-400 animate-pulse" size={24} />
        </div>
        
        <div className="space-y-3 max-w-sm">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Wishlist is Empty</h1>
          <p className="text-gray-500 font-medium">Save items you love to your wishlist and they'll appear here for easy access.</p>
        </div>

        <Link 
          href="/products" 
          className="bg-[#FF4D8D] text-white px-8 py-4 rounded-[2rem] font-black text-lg shadow-xl shadow-pink-100 hover:bg-[#E6457E] transition-all flex items-center gap-3 active:scale-95 group"
        >
          Explore Collection
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#FF4D8D]">
            <Heart size={14} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Your Favorites</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
            MY <span className="text-[#FF4D8D]">WISHLIST</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            {products.length} {products.length === 1 ? "Item" : "Items"} saved for later
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {products.map((product) => (
          <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
