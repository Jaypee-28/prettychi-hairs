"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Inline SVGs matching the mockup perfectly
const Icons = {
  Sparkle: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
  ),
  Bag: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  ),
  Calendar: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  ArrowRight: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  ),
  Diamond: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 3h12l4 6-10 12L2 9Z"/><path d="M11 3 8 9l4 12"/><path d="M12 21 16 9l-3-6"/><path d="M2 9h20"/>
    </svg>
  ),
  Shield: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  Truck: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
  ),
  Headphones: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
    </svg>
  ),
  Star: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
};

export function HeroContent() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative w-full min-h-[85svh] lg:min-h-[100svh] flex flex-col justify-center pt-24 lg:pt-0 overflow-hidden">
      
      {/* ── User's Provided Full Background Image ─────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image 
          src="/images/hero-model.png" 
          alt="Pretty Chi Hairs"
          fill
          priority
          className="object-cover object-[75%_10%] lg:object-center"
          quality={100}
        />
        
        {/* Soft gradient overlay on the left to ensure text readability without hiding the beautiful background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-transparent lg:bg-gradient-to-r lg:from-white/30 lg:via-white/10 lg:to-transparent lg:w-[60%]" />
      </div>

      {/* ── Main Layout ──────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 xl:px-20 flex flex-col lg:flex-row items-center justify-between min-h-[85svh] lg:min-h-[100svh] pb-4 lg:pb-0">
        
        {/* ── Left Content: Typography & Buttons ─────────────────────── */}
        <div className="w-full lg:w-[55%] flex flex-col items-center text-center lg:items-start lg:text-left z-20 mt-8 lg:mt-0 relative">

          <div className={cn("transition-all duration-1000 ease-out", isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <div className="inline-flex items-center gap-2 mb-6 text-[#E30A5D] bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/40 shadow-sm">
              <Icons.Sparkle className="text-[#E30A5D]" />
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em]">
                Premium Hair Collection
              </span>
            </div>
          </div>

          <div className={cn("transition-all duration-1000 delay-150 ease-out relative z-10", isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <h1 className="text-[3.2rem] leading-[1.05] sm:text-6xl md:text-[5.5rem] xl:text-[3.5rem] font-serif tracking-tight mb-5 drop-shadow-sm">
              <span className="text-[#290916]">Luxury Hair,</span> <br />
              <span className="text-[#E30A5D] relative inline-block">
                Effortless Confidence
                {/* Decorative heart drawn next to confidence */}
                <svg className="absolute -top-1 -right-8 text-[#E30A5D] w-8 h-8 rotate-12 drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {/* Hand-drawn swish underline */}
                <svg className="absolute -bottom-3 left-0 w-[105%] h-5 text-[#E30A5D] drop-shadow-sm" viewBox="0 0 300 20" fill="none" preserveAspectRatio="none">
                  <path d="M5,15 Q150,0 295,12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
          </div>

          <div className={cn("transition-all duration-1000 delay-300 ease-out mt-5", isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <p className="text-[#1A050E] lg:text-[#4A1D2D] text-[15px] md:text-[16px] font-bold lg:font-semibold leading-relaxed max-w-[460px] mx-auto lg:mx-0 mb-8 drop-shadow-md lg:drop-shadow-sm bg-white/30 lg:bg-transparent backdrop-blur-[2px] lg:backdrop-blur-none py-1.5 px-3 lg:p-0 rounded-xl">
              Premium quality hair that blends beauty, strength and confidence, made for queens who deserve the best.
            </p>
          </div>

          {/* CTAs */}
          <div className={cn("flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto transition-all duration-1000 delay-500 ease-out", isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <Link
              href="/products"
              className="group flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#D81159] to-[#FF2D7D] text-white rounded-full overflow-hidden transition-all shadow-[0_8px_20px_rgba(216,17,89,0.35)] hover:shadow-[0_12px_25px_rgba(216,17,89,0.5)] hover:-translate-y-0.5"
            >
              <Icons.Bag />
              <span className="text-[13px] font-bold tracking-wide">Shop Collection</span>
              <Icons.ArrowRight className="transition-transform duration-500 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contact"
              className="group flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-md text-[#D81159] rounded-full transition-all shadow-lg shadow-black/5 hover:bg-white hover:-translate-y-0.5 border border-white/50"
            >
              <Icons.Calendar className="text-[#D81159]" />
              <span className="text-[13px] font-bold tracking-wide">Book Consultation</span>
            </Link>
          </div>

        </div>

        {/* ── Right Side Container (Empty to let background show through) ── */}
        <div className="w-full lg:w-[45%] h-[12vh] sm:h-[15vh] lg:h-auto relative mt-2 lg:mt-0">
          {/* Floating Review Card Overlaying the background image */}
          <div className={cn("absolute bottom-0 right-0 lg:-bottom-24 lg:right-10 bg-white/70 backdrop-blur-xl p-3 lg:p-4 shadow-2xl shadow-[#D81159]/20 rounded-xl lg:rounded-2xl border border-white/60 max-w-[160px] lg:max-w-[190px] z-20 transition-all duration-1000 delay-700 animate-[float_4s_ease-in-out_infinite]", isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1 mb-1.5 lg:mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icons.Star key={star} className="text-[#E30A5D] w-3 h-3 lg:w-3.5 lg:h-3.5" />
                ))}
              </div>
              <p className="text-[#290916] text-[9px] lg:text-[11px] font-bold mb-0.5 lg:mb-1">Trusted by</p>
              <p className="text-[#D81159] text-xl lg:text-2xl font-black leading-none mb-0.5 lg:mb-1">500+</p>
              <p className="text-[#290916] text-[9px] lg:text-[11px] font-bold mb-1 lg:mb-3">Happy Customers</p>
            </div>
          </div>
        </div>

      </div>

      {/* ── Bottom Trust Card ────────────────────────────────────────── */}
      <div className={cn("w-full px-6 md:px-12 xl:px-20 relative lg:absolute lg:bottom-10 lg:left-0 z-30 transition-all duration-1000 delay-700 ease-out mt-6 lg:mt-0 mb-6 lg:mb-0", isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12")}>
        <div className="max-w-[850px] bg-white/40 backdrop-blur-xl border border-white/60 rounded-[16px] lg:rounded-[24px] p-4 lg:p-6 shadow-2xl shadow-[#D81159]/10 mx-auto lg:mx-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 divide-x-0 lg:divide-x divide-white/40">
            
            <div className="flex items-center gap-2 lg:gap-3 lg:pl-2">
              <div className="text-[#E30A5D] scale-90 lg:scale-100">
                <Icons.Diamond />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] lg:text-[11px] font-extrabold text-[#290916] leading-tight">Premium Quality</span>
                <span className="text-[8px] lg:text-[9px] text-[#592236] font-bold">100% Human Hair</span>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 lg:pl-6">
              <div className="text-[#E30A5D] scale-90 lg:scale-100">
                <Icons.Shield />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] lg:text-[11px] font-extrabold text-[#290916] leading-tight">Secure Checkout</span>
                <span className="text-[8px] lg:text-[9px] text-[#592236] font-bold">Safe & Protected</span>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 lg:pl-6">
              <div className="text-[#E30A5D] scale-90 lg:scale-100">
                <Icons.Truck />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] lg:text-[11px] font-extrabold text-[#290916] leading-tight">Fast Delivery</span>
                <span className="text-[8px] lg:text-[9px] text-[#592236] font-bold">Nationwide</span>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 lg:pl-6">
              <div className="text-[#E30A5D] scale-90 lg:scale-100">
                <Icons.Headphones />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] lg:text-[11px] font-extrabold text-[#290916] leading-tight">Expert Support</span>
                <span className="text-[8px] lg:text-[9px] text-[#592236] font-bold">We're here for you</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
      `}} />
    </section>
  );
}
