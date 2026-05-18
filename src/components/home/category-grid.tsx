"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
};

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  // If no categories exist, render 3 default placeholders
  const displayCategories = categories.length > 0 
    ? categories 
    : Array.from({ length: 3 }).map((_, i) => ({
        id: `placeholder-${i}`,
        name: "Premium Collection",
        slug: "#",
        imageUrl: null
      }));

  const featured = displayCategories[0];
  const secondary = displayCategories.slice(1);

  const renderCard = (
    category: Category,
    isLarge: boolean,
    index: number
  ) => {
    const slug = category.slug || "#";
    const name = category.name || "Luxury Collection";
    const imageUrl = category.imageUrl || null;

    return (
      <Link
        key={category.id || `fallback-${index}`}
        href={`/products?category=${slug}`}
        className={`group relative block overflow-hidden rounded-3xl bg-[#FFF0F5] transition-all active:opacity-90 ${
          isLarge 
            ? "aspect-[16/9] md:aspect-auto md:h-[420px] w-full" 
            : "aspect-[16/9] md:aspect-auto md:h-[420px]"
        }`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={isLarge ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FFF0F5] to-pink-100 transition-transform duration-500 group-hover:scale-105">
            <span className="text-pink-300 font-bold tracking-widest uppercase text-sm">No Image</span>
          </div>
        )}
        
        {/* Soft overlay (pink/dark gradient) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-[#FF4D8D]/10 transition-colors duration-500 group-hover:from-black/90 group-hover:via-black/40 group-hover:to-[#FF4D8D]/20" />

        {/* Text Content */}
        <div className="absolute bottom-0 left-0 flex w-full flex-col justify-end p-6 md:p-8 lg:p-10">
          <div className="translate-y-0 transition-transform duration-300 group-hover:-translate-y-2">
            <h3 className={`mb-2 font-black uppercase tracking-wide text-white ${isLarge ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-3xl'}`}>
              {name}
            </h3>
            <div className="inline-flex items-center text-sm md:text-base font-semibold text-white">
              <span className="border-b-2 border-[#FF4D8D] pb-0.5 transition-colors group-hover:border-white">Shop Now</span>
              <ArrowRight className="ml-2 h-4 w-4 text-[#FF4D8D] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-10 text-center lg:mb-14">
          <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
            Shop by Category
          </h2>
          <p className="mt-4 text-gray-600 md:text-lg font-medium">
            Discover our luxury collections curated for you.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:gap-6">
          {/* Large Featured Card */}
          {featured && (
            <div className="w-full">
              {renderCard(featured, true, 0)}
            </div>
          )}

          {/* Small Grid for remaining categories */}
          {secondary.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {secondary.map((cat, idx) => renderCard(cat, false, idx + 1))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
