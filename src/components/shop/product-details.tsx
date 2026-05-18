"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ProductWithRelations } from "@/modules/products/product.types";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Sparkles,
  ShieldCheck,
  Truck,
  Star,
  Loader2,
  Heart,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { useSettings } from "@/components/providers/settings-provider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { sortAttributeValues } from "@/lib/filter-utils";

interface ProductDetailsProps {
  product: ProductWithRelations;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem } = useCart();
  const { currency } = useSettings();
  const { data: session } = useSession();
  const router = useRouter();

  // Wishlist State
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetch(`/api/wishlist/check/${product.id}`)
        .then(res => res.json())
        .then(data => setIsWishlisted(data.isWishlisted))
        .catch(() => {});
    }
  }, [session, product.id]);

  const handleToggleWishlist = async () => {
    if (!session?.user) {
      toast.error("Please login to save to wishlist");
      router.push("/login");
      return;
    }

    if (isTogglingWishlist) return;

    const previousState = isWishlisted;
    setIsWishlisted(!previousState);
    setIsTogglingWishlist(true);

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
      setIsTogglingWishlist(false);
    }
  };

  // Build images array
  const allImages = useMemo(() => {
    const imgs: string[] = [];
    if (product.thumbnailUrl) imgs.push(product.thumbnailUrl);
    product.images.forEach((img) => {
      if (img.url && !imgs.includes(img.url)) imgs.push(img.url);
    });
    if (imgs.length === 0) imgs.push("");
    return imgs;
  }, [product.thumbnailUrl, product.images]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [imgTransition, setImgTransition] = useState(false);

  const selectedImage = allImages[currentIndex] || "";

  const goTo = useCallback((idx: number) => {
    setImgTransition(true);
    setTimeout(() => {
      setCurrentIndex(idx);
      setImgTransition(false);
    }, 150);
  }, []);

  const goPrev = () => {
    const idx = currentIndex === 0 ? allImages.length - 1 : currentIndex - 1;
    goTo(idx);
  };

  const goNext = () => {
    const idx = currentIndex === allImages.length - 1 ? 0 : currentIndex + 1;
    goTo(idx);
  };

  // Extract unique attributes
  const attributes = useMemo(() => {
    const attrMap: Record<string, Set<string>> = {};
    product.variants.forEach((variant) => {
      variant.options.forEach((option) => {
        if (!attrMap[option.attribute]) {
          attrMap[option.attribute] = new Set();
        }
        attrMap[option.attribute].add(option.value);
      });
    });
    return Object.keys(attrMap).map((key) => ({
      name: key,
      values: sortAttributeValues(key, Array.from(attrMap[key])),
    }));
  }, [product.variants]);

  // Sync selected options with URL
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const initial: Record<string, string> = {};
    
    attributes.forEach((attr) => {
      const urlValue = params.get(attr.name);
      if (urlValue && attr.values.includes(urlValue)) {
        initial[attr.name] = urlValue;
      } else if (attr.values.length > 0) {
        initial[attr.name] = attr.values[0];
      }
    });
    return initial;
  });

  // Update URL when options change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let changed = false;
    Object.entries(selectedOptions).forEach(([key, value]) => {
      if (params.get(key) !== value) {
        params.set(key, value);
        changed = true;
      }
    });
    if (changed) {
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
    }
  }, [selectedOptions]);

  // Find matching variant
  const selectedVariant = useMemo(() => {
    if (product.variants.length === 0) return null;
    
    // Exact match: find variant that has ALL currently selected options
    const match = product.variants.find((variant) => {
      // Every option in THIS variant must match the selected options
      const variantOptionsMatch = variant.options.every(
        (opt) => selectedOptions[opt.attribute] === opt.value
      );
      
      // Also ensure the variant doesn't have FEWER options than what we've selected 
      // (if we want exact combination matching)
      // But for Hairven, we usually want the most specific match.
      return variantOptionsMatch;
    });

    return match;
  }, [product.variants, selectedOptions]);

  // Price logic: use variant price if it exists (even if 0), otherwise fallback to base
  const currentPrice = useMemo(() => {
    const variantPrice = selectedVariant?.price;
    if (variantPrice !== null && variantPrice !== undefined) {
      return variantPrice;
    }
    return product.basePrice;
  }, [selectedVariant, product.basePrice]);

  const handleOptionSelect = (attrName: string, value: string) => {
    setSelectedOptions((prev) => {
      const next = { ...prev, [attrName]: value };
      
      // LOGIC: Ensure the new combination is "valid" or snap to the first variant that matches the new choice
      // This is the "Price Priority" logic: selecting a new length should immediately find a variant that has that length
      const possibleVariant = product.variants.find(v => 
        v.options.some(opt => opt.attribute === attrName && opt.value === value)
      );

      if (possibleVariant) {
        // If we found a variant with this new value, let's sync other attributes 
        // to this variant to ensure we always have a valid combination and a price.
        const syncedOptions = { ...next };
        possibleVariant.options.forEach(opt => {
          syncedOptions[opt.attribute] = opt.value;
        });
        return syncedOptions;
      }

      return next;
    });
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    const cartItem = {
      id: selectedVariant?.id || `${product.id}-base`,
      productId: product.id,
      name: product.name,
      price: parseFloat(currentPrice.toString()),
      image: selectedImage,
      quantity: 1,
      attributes: selectedOptions,
      slug: product.slug,
      variantId: selectedVariant?.id,
    };
    addItem(cartItem);
    setTimeout(() => {
      setIsAdding(false);
      toast.success(`${product.name} added to cart`, {
        description: selectedVariant 
          ? `Option: ${Object.values(selectedOptions).join(", ")}` 
          : "Base product added.",
        duration: 3000,
      });
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16">
        
        {/* ─── Left: Image Gallery (5 cols) ─── */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Image */}
          <div className="relative aspect-[1/1.1] md:aspect-square bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 group shadow-sm">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover transition-all duration-500 ease-out",
                  imgTransition ? "opacity-0 scale-[1.05]" : "opacity-100 scale-100"
                )}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-200">
                <span className="text-5xl font-black tracking-tighter opacity-10">HAIRVEN</span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              {product.isFeatured && (
                <span className="bg-[#FF4D8D] text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl shadow-pink-200/50 uppercase tracking-widest">
                  Featured Choice
                </span>
              )}
            </div>

            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 hover:bg-[#FF4D8D] hover:text-white transition-all shadow-xl active:scale-90"
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} strokeWidth={3} />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 hover:bg-[#FF4D8D] hover:text-white transition-all shadow-xl active:scale-90"
                  aria-label="Next"
                >
                  <ChevronRight size={20} strokeWidth={3} />
                </button>
              </>
            )}

            {/* Dots */}
            {allImages.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {allImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className={cn(
                      "transition-all duration-300 rounded-full",
                      idx === currentIndex ? "w-8 h-2 bg-[#FF4D8D]" : "w-2 h-2 bg-white/60 hover:bg-white"
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
              {allImages.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={cn(
                    "w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300",
                    idx === currentIndex ? "border-[#FF4D8D] shadow-lg scale-105" : "border-transparent opacity-40 hover:opacity-100"
                  )}
                >
                  <img src={url} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Right: Product Info (5 cols) ─── */}
        <div className="lg:col-span-5 flex flex-col pt-4">
          <div className="space-y-6 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF4D8D] animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FF4D8D]">
                {product.category?.name || "Premium Collection"}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-[1.1]">
              {product.name}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex text-amber-400 gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                4.9 (128 reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <span 
                key={currentPrice.toString()}
                className="text-4xl font-black text-gray-900 tracking-tighter animate-in fade-in zoom-in-95 duration-300"
              >
                {formatPrice(currentPrice, currency)}
              </span>
              {selectedVariant?.price && 
               parseFloat(selectedVariant.price.toString()) !== parseFloat(product.basePrice.toString()) && (
                <span className="text-lg text-gray-300 line-through font-bold">
                  {formatPrice(product.basePrice, currency)}
                </span>
              )}
            </div>
          </div>

          <div className="py-8">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Description</h3>
            <p className="text-[15px] text-gray-600 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          {/* Variant Selectors - Modern Custom Dropdowns */}
          {attributes.length > 0 && (
            <div className="py-8 space-y-6 border-t border-gray-100">
              {attributes.map((attr) => (
                <div key={attr.name} className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                    {attr.name}
                  </label>
                  <CustomDropdown
                    value={selectedOptions[attr.name]}
                    options={attr.values}
                    onChange={(val) => handleOptionSelect(attr.name, val)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* CTA Area */}
          <div className="pt-8 mt-auto space-y-6">
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-[4] bg-[#FF4D8D] text-white h-16 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-[#E6457E] transition-all shadow-2xl shadow-pink-200 active:scale-[0.98] disabled:opacity-70 group"
              >
                {isAdding ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                    Add to Cart
                  </>
                )}
              </button>
              <button 
                onClick={handleToggleWishlist}
                disabled={isTogglingWishlist}
                className={cn(
                  "flex-1 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-300 border-2 active:scale-[0.98]",
                  isWishlisted 
                    ? "bg-[#FF4D8D] border-[#FF4D8D] text-white shadow-xl shadow-pink-200" 
                    : "bg-white border-gray-100 text-gray-400 hover:border-pink-200 hover:text-[#FF4D8D]"
                )}
              >
                <Heart size={24} className={cn(isWishlisted && "fill-current")} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-10 py-4 bg-gray-50/50 rounded-[2rem] border border-gray-100">
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck size={20} className="text-green-500" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">100% Virgin</span>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="flex flex-col items-center gap-1.5">
                <Truck size={20} className="text-[#FF4D8D]" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Custom Premium Dropdown Component ───
function CustomDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-14 px-6 flex items-center justify-between bg-gray-50 border-2 rounded-2xl transition-all duration-300 group",
          isOpen ? "border-[#FF4D8D] bg-white ring-4 ring-pink-50" : "border-transparent hover:border-gray-200"
        )}
      >
        <span className="text-sm font-bold text-gray-900">{value}</span>
        <ChevronDown 
          size={18} 
          strokeWidth={3} 
          className={cn("text-gray-400 group-hover:text-[#FF4D8D] transition-transform duration-300", isOpen && "rotate-180 text-[#FF4D8D]")} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto scrollbar-hide py-2">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-6 py-3.5 text-left text-sm font-bold transition-all flex items-center justify-between group/item",
                  value === opt ? "bg-pink-50 text-[#FF4D8D]" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <span>{opt}</span>
                {value === opt && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF4D8D]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
