"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Loader2, ChevronDown, Check, X } from "lucide-react";
import { ProductCard } from "./product-card";
import { ProductWithRelations } from "@/modules/products/product.types";
import { cn } from "@/lib/utils";

const attributeToParam: Record<string, string> = {
  Length: "length",
  Color: "color",
  Texture: "texture",
  "Lace Type": "laceType",
};

interface ShopContentProps {
  initialProducts: ProductWithRelations[];
  categories: any[];
  filterOptions: {
    attributes: Record<string, string[]>;
    tags: string[];
  };
}

export function ShopContent({ initialProducts, categories, filterOptions }: ShopContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithRelations[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const currentCategorySlug = searchParams.get("categorySlug");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryString = searchParams.toString();
        const res = await fetch(`/api/products?include=true&${queryString}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (searchParams.toString()) {
      fetchProducts();
    } else {
      setProducts(initialProducts);
    }
  }, [searchParams, initialProducts]);

  const handleSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort) {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    router.push(`/products?${params.toString()}`);
  };

  const toggleFilter = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.getAll(name);
    if (currentValues.includes(value)) {
      params.delete(name);
      currentValues.filter((v) => v !== value).forEach((v) => params.append(name, v));
    } else {
      params.append(name, value);
    }
    router.push(`/products?${params.toString()}`);
  };

  const isChecked = (name: string, value: string) => {
    return searchParams.getAll(name).includes(value);
  };

  const clearFilters = () => {
    setSearch("");
    router.push("/products");
  };

  const activeFilterCount = (() => {
    let count = 0;
    if (currentCategorySlug) count++;
    Object.values(attributeToParam).forEach((param) => {
      count += searchParams.getAll(param).length;
    });
    count += searchParams.getAll("tags").length;
    return count;
  })();

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative group">
        <input
          type="text"
          placeholder="Search products, categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-xl bg-white border border-gray-200 focus:border-[#FF4D8D] focus:ring-2 focus:ring-pink-50 outline-none transition-all text-sm font-medium text-gray-700 placeholder:text-gray-400"
        />
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF4D8D] transition-colors"
          size={16}
        />
      </form>

      {/* Mobile Inline Filters — hidden on desktop */}
      <div className="lg:hidden">
        {/* Filter scroll row — items use fixed-position dropdowns to escape overflow */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {/* Category Dropdown */}
          <DropdownFilter
            label={
              currentCategorySlug
                ? categories.find((c) => c.slug === currentCategorySlug)?.name || "Category"
                : "Category"
            }
            isActive={!!currentCategorySlug}
          >
            <button
              onClick={() => router.push("/products")}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                !currentCategorySlug
                  ? "bg-gray-900 text-white font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("categorySlug", cat.slug);
                  router.push(`/products?${params.toString()}`);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                  currentCategorySlug === cat.slug
                    ? "bg-[#FF4D8D] text-white font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {cat.name}
              </button>
            ))}
          </DropdownFilter>

          {/* Attribute Dropdowns */}
          {Object.entries(filterOptions.attributes).map(([attr, values]) => {
            const paramName = attributeToParam[attr] || attr.toLowerCase();
            const activeCount = searchParams.getAll(paramName).length;
            return (
              <DropdownFilter
                key={attr}
                label={attr}
                isActive={activeCount > 0}
                badge={activeCount > 0 ? activeCount : undefined}
              >
                {values.map((val) => (
                  <button
                    key={val}
                    onClick={() => toggleFilter(paramName, val)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <span>{val}</span>
                    {isChecked(paramName, val) && (
                      <Check size={14} className="text-[#FF4D8D]" strokeWidth={3} />
                    )}
                  </button>
                ))}
              </DropdownFilter>
            );
          })}

          {/* Tags Dropdown */}
          {filterOptions.tags.length > 0 && (
            <DropdownFilter
              label="Featured"
              isActive={searchParams.getAll("tags").length > 0}
              badge={
                searchParams.getAll("tags").length > 0
                  ? searchParams.getAll("tags").length
                  : undefined
              }
            >
              {["Best Seller", "New Arrival"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleFilter("tags", tag)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <span>{tag}</span>
                  {isChecked("tags", tag) && (
                    <Check size={14} className="text-[#FF4D8D]" strokeWidth={3} />
                  )}
                </button>
              ))}
            </DropdownFilter>
          )}


        </div>
      </div>

      {/* Sort row */}
      <div className="flex items-center justify-end gap-3">
        {activeFilterCount > 0 && (
          <>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-[11px] font-semibold text-[#FF4D8D]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D8D] animate-pulse" />
              {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
            </span>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-[11px] font-semibold text-gray-500 hover:border-pink-200 hover:text-[#FF4D8D] transition-all"
            >
              <X size={11} strokeWidth={3} />
              Clear
            </button>
          </>
        )}
        <select
          onChange={(e) => handleSort(e.target.value)}
          value={searchParams.get("sort") || ""}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 font-medium text-sm text-gray-700 focus:border-[#FF4D8D] outline-none appearance-none cursor-pointer"
        >
          <option value="">Sort by: Featured</option>
          <option value="newest">Newest Arrival</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Loading Overlay */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="text-[#FF4D8D] animate-spin" />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Loading...
              </p>
            </div>
          </div>
        )}

        {/* Product Grid — 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-5 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 border-2 border-dashed border-gray-200">
              <Search size={32} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-semibold text-gray-900">No products found</h3>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filters.
              </p>
            </div>
            <button
              onClick={clearFilters}
              className="text-[#FF4D8D] font-semibold text-sm hover:underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dropdown Filter (Mobile) ───
// Uses a fixed-position panel so it escapes the overflow-x-auto scroll container
function DropdownFilter({
  label,
  isActive,
  badge,
  children,
}: {
  label: string;
  isActive: boolean;
  badge?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Position the fixed panel relative to the trigger button
  const openPanel = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPanelStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        zIndex: 9999,
        width: 192,
      });
    }
    setOpen((prev) => !prev);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on scroll (panel would drift otherwise)
  useEffect(() => {
    if (!open) return;
    const handleScroll = () => setOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  return (
    <div className="flex-shrink-0">
      <button
        ref={triggerRef}
        onClick={openPanel}
        className={cn(
          "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition-all whitespace-nowrap",
          isActive
            ? "bg-[#FF4D8D] text-white border-[#FF4D8D]"
            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
        )}
      >
        {label}
        {badge && (
          <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] font-bold flex items-center justify-center">
            {badge}
          </span>
        )}
        <ChevronDown
          size={13}
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          style={panelStyle}
          className="bg-white rounded-xl border border-gray-100 shadow-xl shadow-gray-200/60 p-1.5"
        >
          {children}
        </div>
      )}
    </div>
  );
}
