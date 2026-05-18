"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProductWithRelations } from "@/modules/products/product.types";
import { cn, formatPrice } from "@/lib/utils";
import { useSettings } from "@/components/providers/settings-provider";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductCardProps {
  product: ProductWithRelations;
}

export function ProductCard({ product }: ProductCardProps) {
  const { currency } = useSettings();
  const { data: session } = useSession();
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetch(`/api/wishlist/check/${product.id}`)
        .then(res => res.json())
        .then(data => setIsWishlisted(data.isWishlisted))
        .catch(() => {});
    }
  }, [session, product.id]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      toast.error("Please login to save to wishlist");
      router.push("/login");
      return;
    }

    if (isToggling) return;

    // Optimistic Update
    const previousState = isWishlisted;
    setIsWishlisted(!previousState);
    setIsToggling(true);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setIsWishlisted(data.action === "added");
      toast.success(data.action === "added" ? "Saved to wishlist" : "Removed from wishlist");
    } catch (err) {
      setIsWishlisted(previousState);
      toast.error("Failed to update wishlist");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-pink-100/40 transition-all duration-400">
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col h-full"
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          {product.thumbnailUrl ? (
            <img
              src={product.thumbnailUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200 font-bold uppercase tracking-tighter text-2xl opacity-10">
              Pretty Chi Hairs
            </div>
          )}

          {/* Tags overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
            {product.isFeatured && (
              <span className="bg-[#FF4D8D] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow shadow-pink-200">
                FEATURED
              </span>
            )}
            {product.tags.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="bg-white/90 backdrop-blur-md text-gray-900 text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm border border-gray-100 uppercase"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Quick View hover */}
          <div className="absolute inset-x-0 bottom-0 p-2.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
            <div className="w-full bg-white/90 backdrop-blur-xl py-2 rounded-xl flex items-center justify-center shadow-lg border border-white">
              <span className="text-[9px] font-black text-gray-900 tracking-widest uppercase">
                Quick View
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-2.5 sm:p-3 space-y-1">
          <p className="text-[8px] font-bold text-[#FF4D8D] uppercase tracking-widest leading-none">
            {product.category?.name || "Premium Hair"}
          </p>
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight group-hover:text-[#FF4D8D] transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between pt-0.5">
            <p className="text-sm sm:text-base font-bold text-gray-900 leading-none">
              {formatPrice(product.basePrice, currency)}
            </p>
            {product.variants.length > 0 && (
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                {product.variants.length} opts
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        disabled={isToggling}
        className={cn(
          "absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border backdrop-blur-md active:scale-90",
          isWishlisted 
            ? "bg-[#FF4D8D] border-[#FF4D8D] text-white" 
            : "bg-white/80 border-white text-gray-400 hover:text-[#FF4D8D]"
        )}
      >
        <Heart 
          size={14} 
          className={cn(isWishlisted && "fill-current")} 
          strokeWidth={3}
        />
      </button>
    </div>
  );
}
