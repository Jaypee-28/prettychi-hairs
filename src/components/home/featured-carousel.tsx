"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowRight as ArrowRightIcon } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  categoryName: string;
  isFeatured: boolean;
};

interface FeaturedCarouselProps {
  products: Product[];
}

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Intersection Observer for scroll fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Update arrow states based on scroll position
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    // Scroll by roughly one card width (card + gap)
    const cardWidth = container.clientWidth > 1024 ? container.clientWidth / 4 : container.clientWidth * 0.8;
    
    container.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  if (products.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-gray-50/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-gray-900">Featured Collection</h2>
          <p className="mt-4 text-gray-500 font-medium">New arrivals coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef} 
      className={`py-16 md:py-24 overflow-hidden transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <div className="text-center md:text-left">
            <span className="inline-block text-[#FF4D8D] font-black uppercase tracking-widest text-xs md:text-sm mb-3">
              Featured
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              Best Sellers & Favorites
            </h2>
            <p className="mt-4 text-gray-500 font-medium text-lg">
              Handpicked premium selections just for you
            </p>
          </div>

          <div className="flex items-center justify-center md:justify-end gap-6">
            <Link 
              href="/products" 
              className="hidden md:flex items-center text-sm font-bold text-gray-900 hover:text-[#FF4D8D] transition-colors group"
            >
              View All 
              <ArrowRightIcon className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Desktop Navigation Arrows */}
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <ArrowLeft size={20} strokeWidth={2.5} />
              </button>
              <button 
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <ArrowRight size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Carousel */}
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-4 md:gap-6 snap-x snap-mandatory scrollbar-hide pb-8 pt-4 -mt-4 cursor-grab active:cursor-grabbing"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth'
            }}
          >
            {/* Inject a <style> tag to hide webkit scrollbar just for this container if needed, though scrollbar-hide usually does it */}
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {products.map((product, index) => (
              <Link 
                key={product.id}
                href={`/products/${product.slug}`}
                className={`group flex-none relative rounded-[2rem] bg-white transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl shadow-sm border border-gray-50 snap-center md:snap-start
                  w-[80vw] md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]
                `}
                style={{
                  transitionDelay: `${index * 50}ms`
                }}
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden mb-4 bg-gradient-to-br from-[#FFF0F5] to-pink-50">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-pink-300 font-bold tracking-widest uppercase text-xs">No Image</span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isFeatured && (
                      <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-black tracking-widest uppercase rounded-xl shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="px-2 pb-4">
                  <p className="text-[#FF4D8D] font-bold text-xs uppercase tracking-widest mb-2">
                    {product.categoryName}
                  </p>
                  <h3 className="text-gray-900 font-bold text-lg md:text-xl line-clamp-2 mb-3 leading-tight group-hover:text-[#FF4D8D] transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900 font-black text-xl">
                      ₦{product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile View All */}
        <div className="mt-6 flex justify-center md:hidden">
          <Link 
            href="/products" 
            className="flex items-center text-sm font-bold text-gray-900 hover:text-[#FF4D8D] transition-colors"
          >
            View All Products
            <ArrowRightIcon className="ml-2 w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
