"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

export interface HeroData {
  heroVideoUrl: string | null;
  heroTopLabel: string | null;
  heroTitle: string | null;
  heroWords: string[];
  heroSubtitle: string | null;
  heroPrimaryCTA: string | null;
  heroSecondaryCTA: string | null;
}

// ── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_HERO: Required<HeroData> = {
  heroVideoUrl: "",
  heroTopLabel: "LUXURY BEAUTY EXPERIENCE",
  heroTitle: "Pretty Chi Hairs",
  heroWords: [
    "Beauty Consultant",
    "Premium Hair",
    "Make-up",
    "Lashes",
    "Soft Glam",
    "Bridal",
    "Wig Installs",
  ],
  heroSubtitle:
    "Discover the pinnacle of luxury hair and beauty. Crafted for those who demand excellence.",
  heroPrimaryCTA: "Shop Now",
  heroSecondaryCTA: "Book Appointment",
};

// ── Typewriter Hook ──────────────────────────────────────────────────────────
// All control-flow state (phase, indices) lives in refs so that tick() is the
// sole scheduler and no phase transition can silently break the chain.
// Only `displayText` triggers a React re-render.

function useTypewriter(words: string[]) {
  const [displayText, setDisplayText] = useState("");

  const safeWords        = words.length > 0 ? words : DEFAULT_HERO.heroWords;
  const wordsRef         = useRef(safeWords);
  const wordIndexRef     = useRef(0);
  const charIndexRef     = useRef(0);
  const phaseRef         = useRef<"typing" | "deleting">("typing");
  const timerRef         = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the words ref in sync without resetting the animation
  useEffect(() => {
    wordsRef.current = safeWords;
  });

  const tick = useCallback(() => {
    const ws          = wordsRef.current;
    const currentWord = ws[wordIndexRef.current % ws.length];

    if (phaseRef.current === "typing") {
      charIndexRef.current += 1;
      setDisplayText(currentWord.slice(0, charIndexRef.current));

      if (charIndexRef.current >= currentWord.length) {
        // Finished typing — pause then switch to deleting
        timerRef.current = setTimeout(() => {
          phaseRef.current = "deleting";
          tick();           // ← explicitly re-enter the loop
        }, 1500);
      } else {
        timerRef.current = setTimeout(tick, 80);
      }
    } else {
      // deleting
      charIndexRef.current -= 1;
      setDisplayText(currentWord.slice(0, charIndexRef.current));

      if (charIndexRef.current <= 0) {
        // Finished deleting — advance word, pause then switch to typing
        wordIndexRef.current = (wordIndexRef.current + 1) % ws.length;
        charIndexRef.current  = 0;
        timerRef.current = setTimeout(() => {
          phaseRef.current = "typing";
          tick();           // ← explicitly re-enter the loop
        }, 350);
      } else {
        timerRef.current = setTimeout(tick, 45);
      }
    }
  }, []); // no deps — everything read through refs

  useEffect(() => {
    timerRef.current = setTimeout(tick, 600);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [tick]);

  return { displayText };
}

// ── Main Component ───────────────────────────────────────────────────────────

export function HeroContent({ data }: { data: HeroData }) {
  const hero = {
    heroVideoUrl: data.heroVideoUrl ?? DEFAULT_HERO.heroVideoUrl,
    heroTopLabel: data.heroTopLabel ?? DEFAULT_HERO.heroTopLabel,
    heroTitle: data.heroTitle ?? DEFAULT_HERO.heroTitle,
    heroWords: data.heroWords?.length ? data.heroWords : DEFAULT_HERO.heroWords,
    heroSubtitle: data.heroSubtitle ?? DEFAULT_HERO.heroSubtitle,
    heroPrimaryCTA: data.heroPrimaryCTA ?? DEFAULT_HERO.heroPrimaryCTA,
    heroSecondaryCTA: data.heroSecondaryCTA ?? DEFAULT_HERO.heroSecondaryCTA,
  };

  const { displayText } = useTypewriter(hero.heroWords);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure autoplay on mobile (needs muted + playsInline)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Browser blocked autoplay — silently ignore
      });
    }
  }, []);

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      aria-label="Hero section"
    >
      {/* ── Video Background ─────────────────────────────────────────── */}
      <div className="absolute inset-0">
        {hero.heroVideoUrl ? (
          <video
            ref={videoRef}
            className="hero-video absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src={hero.heroVideoUrl} type="video/mp4" />
          </video>
        ) : (
          /* Fallback gradient when no video is set */
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800" />
        )}
      </div>

      {/* ── Overlay Layer 1 — Dark Side Gradients ────────────────────── */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.78), rgba(0,0,0,0.4), rgba(0,0,0,0.78))",
        }}
        aria-hidden="true"
      />

      {/* ── Overlay Layer 2 — Pink Radial Glow ───────────────────────── */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(255,77,141,0.25), transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* ── Bottom Fade ──────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 z-[3]"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
        }}
        aria-hidden="true"
      />

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="relative z-[10] h-full flex items-center">
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12">
          <div className="max-w-3xl text-center md:text-left">

            {/* Top Label */}
            {hero.heroTopLabel && (
              <div className="hero-label inline-flex items-center gap-2 mb-6 md:mb-8">
                <div className="h-px w-8 bg-[#FF4D8D]" />
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-[#FF4D8D]">
                  {hero.heroTopLabel}
                </span>
                <Sparkles
                  size={12}
                  className="text-[#FF4D8D] animate-pulse"
                  strokeWidth={3}
                />
              </div>
            )}

            {/* Main Title */}
            <h1 className="hero-title font-heading text-[2.6rem] leading-[1.05] md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight mb-4 md:mb-6">
              {hero.heroTitle}
            </h1>

            {/* Typewriter Line */}
            <div
              className="hero-typewriter flex items-center gap-0 mb-6 md:mb-8 justify-center md:justify-start"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="text-[1.4rem] md:text-3xl lg:text-4xl font-black text-[#FF4D8D] uppercase tracking-tight min-h-[1.2em] leading-none">
                {displayText}
              </span>
              <span
                className="text-[1.4rem] md:text-3xl lg:text-4xl font-black text-[#FF4D8D] leading-none ml-0.5 cursor-blink"
                aria-hidden="true"
              >
                |
              </span>
            </div>

            {/* Subtitle */}
            {hero.heroSubtitle && (
              <p className="hero-subtitle text-sm md:text-base lg:text-lg text-white/70 font-medium leading-relaxed max-w-xl mb-10 md:mb-12 mx-auto md:mx-0">
                {hero.heroSubtitle}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="hero-ctas flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4">
              {/* Primary — Shop Now */}
              <Link
                href="/products"
                className="hero-cta-primary group inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-[#FF4D8D] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-pink-900/40 hover:bg-pink-500 hover:shadow-pink-500/40 transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto"
              >
                {hero.heroPrimaryCTA}
                <ArrowRight
                  size={16}
                  strokeWidth={3}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              {/* Secondary — Book Appointment */}
              <Link
                href="/booking"
                className="hero-cta-secondary group inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-white/10 text-white border-2 border-white/30 rounded-2xl font-black text-sm uppercase tracking-widest backdrop-blur-sm hover:bg-white/20 hover:border-white/60 transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto"
              >
                <Calendar size={16} strokeWidth={2.5} />
                {hero.heroSecondaryCTA}
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ── Scroll Indicator ─────────────────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center gap-2 opacity-60">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-white to-transparent animate-bounce" />
      </div>

    </section>
  );
}
