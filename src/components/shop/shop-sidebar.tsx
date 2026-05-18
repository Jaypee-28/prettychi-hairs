"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, Check } from "lucide-react";

interface ShopSidebarProps {
  categories: any[];
  filterOptions: {
    attributes: Record<string, string[]>;
    tags: string[];
  };
}

const attributeToParam: Record<string, string> = {
  Length: "length",
  Color: "color",
  Texture: "texture",
  "Lace Type": "laceType",
};

export function ShopSidebar({ categories, filterOptions }: ShopSidebarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategorySlug = searchParams.get("categorySlug");

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
    <aside className="hidden lg:block sticky top-28 h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300 pr-4">
      <div className="space-y-10 pb-10">
        {/* Categories */}
        <div>
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-5 pb-3 border-b border-gray-100">
            Collections
          </h3>
          <nav className="flex flex-col gap-1">
            <Link
              href="/products"
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg transition-all text-sm",
                !currentCategorySlug
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <span className="font-medium">All Products</span>
              <ChevronRight size={14} />
            </Link>
            {categories.map((category) => {
              const isActive = currentCategorySlug === category.slug;
              return (
                <Link
                  key={category.id}
                  href={`/products?categorySlug=${category.slug}`}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg transition-all text-sm",
                    isActive
                      ? "bg-[#FF4D8D] text-white"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className="font-medium">{category.name}</span>
                  <ChevronRight size={14} />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Attribute Filters */}
        <div>
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-5 pb-3 border-b border-gray-100">
            Filter By
          </h3>
          <div className="space-y-7">
            {Object.entries(filterOptions.attributes).map(([attr, values]) => {
              const paramName = attributeToParam[attr] || attr.toLowerCase();
              return (
                <div key={attr} className="space-y-3">
                  <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    {attr}
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    {values.map((item) => (
                      <label key={item} className="flex items-center gap-2.5 group cursor-pointer">
                        <div
                          onClick={() => toggleFilter(paramName, item)}
                          className={cn(
                            "w-4 h-4 rounded border-[1.5px] flex items-center justify-center transition-all",
                            isChecked(paramName, item)
                              ? "bg-[#FF4D8D] border-[#FF4D8D] text-white"
                              : "bg-white border-gray-300 group-hover:border-gray-400"
                          )}
                        >
                          {isChecked(paramName, item) && <Check size={10} strokeWidth={3} />}
                        </div>
                        <span className={cn(
                          "text-sm transition-colors",
                          isChecked(paramName, item)
                            ? "text-gray-900 font-medium"
                            : "text-gray-500 group-hover:text-gray-700"
                        )}>
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Tags */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Featured
              </h4>
              <div className="flex flex-col gap-1.5">
                {["Best Seller", "New Arrival"].map((tag) => (
                  <label key={tag} className="flex items-center gap-2.5 group cursor-pointer">
                    <div
                      onClick={() => toggleFilter("tags", tag)}
                      className={cn(
                        "w-4 h-4 rounded border-[1.5px] flex items-center justify-center transition-all",
                        isChecked("tags", tag)
                          ? "bg-[#FF4D8D] border-[#FF4D8D] text-white"
                          : "bg-white border-gray-300 group-hover:border-gray-400"
                      )}
                    >
                      {isChecked("tags", tag) && <Check size={10} strokeWidth={3} />}
                    </div>
                    <span className={cn(
                      "text-sm transition-colors",
                      isChecked("tags", tag)
                        ? "text-gray-900 font-medium"
                        : "text-gray-500 group-hover:text-gray-700"
                    )}>
                      {tag}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Clear */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="w-full py-3 rounded-xl border border-gray-200 text-gray-400 font-medium text-xs uppercase tracking-wider hover:border-pink-200 hover:text-[#FF4D8D] transition-all"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </aside>
  );
}
