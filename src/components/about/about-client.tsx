"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { FadeInSection } from "../shared/fade-in-section";
import { WhyChooseUs } from "../home/why-choose-us";

export function AboutClient() {
  return (
    <div className="w-full overflow-hidden bg-white">
      {/* SECTION 1: HERO */}
      <section className="relative w-full min-h-[55vh] md:min-h-[30vh] flex items-center justify-center pt-24 pb-16 md:pt-28">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about/hero.png"
            alt="Pretty Chi Hairs Interior"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Dark Pink Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-pink-900/40 to-black/80" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <FadeInSection>
            <span className="inline-block text-[#FF4D8D] font-black uppercase tracking-[0.2em] text-xs md:text-sm mb-4 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-pink-500/20">
              About Pretty Chi Hairs
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 max-w-3xl leading-tight">
              Luxury Hair.<br />Beauty. Confidence.
            </h1>
            <p className="text-lg md:text-xl text-gray-200 font-medium mb-10 max-w-2xl mx-auto md:mx-0">
              Pretty Chi Hairs is your ultimate destination for premium hair products and professional beauty services. Elevate your everyday look with uncompromised quality.
            </p>
            <Link 
              href="/products"
              className="inline-flex items-center justify-center bg-[#FF4D8D] text-white rounded-full px-8 py-4 font-black tracking-wide hover:bg-[#E6457E] hover:shadow-lg hover:shadow-pink-500/30 hover:scale-105 transition-all duration-300"
            >
              Shop Products
            </Link>
          </FadeInSection>
        </div>
      </section>

      {/* SECTION 2: OUR STORY */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <FadeInSection delay={100} className="lg:order-1">
            <span className="inline-block text-[#FF4D8D] font-black uppercase tracking-widest text-xs md:text-sm mb-3">
              The Genesis
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6">
              Our Story
            </h2>
            <div className="space-y-5 text-gray-600 font-medium text-lg leading-relaxed">
              <p>
                Born from a deep passion for authentic beauty, Pretty Chi Hairs was established to bridge the gap between luxury quality and accessible elegance. We believe that premium hair isn't just an accessory—it's the crown you never take off.
              </p>
              <p>
                Our mission is simple: to empower every client with unparalleled confidence. By sourcing only the finest, ethically gathered human hair, we ensure that every bundle, wig, and frontal meets our rigorous standard of excellence.
              </p>
              <p>
                Beyond products, Pretty Chi Hairs is a sanctuary for transformation. Our expert stylists combine artistry with precision to deliver a beauty experience that leaves you looking—and feeling—absolute perfection.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={300} className="lg:order-2">
            <div className="relative aspect-square lg:aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl group">
              <Image
                src="/images/about/story.png"
                alt="Pretty Chi Hairs Story"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-900/20 to-transparent" />
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* SECTION 3: WHAT WE OFFER */}
      <section className="py-16 md:py-24 bg-gray-50/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16 md:mb-24">
            <span className="inline-block text-[#FF4D8D] font-black uppercase tracking-widest text-xs md:text-sm mb-3">
              The Collection
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              What We Offer
            </h2>
          </FadeInSection>

          <div className="space-y-20 md:space-y-32">
            {/* Block 1: Premium Hair */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <FadeInSection delay={200} className="order-2 lg:order-1">
                <div className="relative aspect-square md:aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-xl group">
                  <Image
                    src="/images/about/premium-hair.png"
                    alt="Premium Human Hair Collections"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-transparent mix-blend-overlay" />
                </div>
              </FadeInSection>
              
              <FadeInSection delay={100} className="order-1 lg:order-2">
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                  Premium Hair
                </h3>
                <p className="text-lg text-gray-600 font-medium mb-8">
                  Experience the pinnacle of luxury with our 100% virgin human hair collections. Silky, durable, and designed to blend flawlessly with your natural essence.
                </p>
                <ul className="space-y-4 mb-10">
                  {["Bundles", "Wigs", "Closures & Frontals", "Clip-ins"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-900 font-bold text-lg">
                      <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-[#FF4D8D]">
                        <CheckCircle2 size={16} strokeWidth={3} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/products"
                  className="inline-flex items-center justify-center bg-gray-900 text-white rounded-full px-8 py-4 font-black tracking-wide hover:bg-black hover:scale-105 transition-all duration-300"
                >
                  Shop Hair
                </Link>
              </FadeInSection>
            </div>

            {/* Block 2: Beauty Services */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <FadeInSection delay={100} className="order-1">
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                  Beauty Services
                </h3>
                <p className="text-lg text-gray-600 font-medium mb-8">
                  Step into our studio for a transformative session. From flawless installations to breathtaking soft glam, our experts are dedicated to your aesthetic perfection.
                </p>
                <ul className="space-y-4 mb-10">
                  {["Wig Installation", "Makeup (Soft glam / Bridal)", "Lashes", "Styling"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-900 font-bold text-lg">
                      <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-[#FF4D8D]">
                        <CheckCircle2 size={16} strokeWidth={3} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/booking"
                  className="inline-flex items-center justify-center bg-[#FF4D8D] text-white rounded-full px-8 py-4 font-black tracking-wide hover:bg-[#E6457E] hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300"
                >
                  Book Appointment
                </Link>
              </FadeInSection>

              <FadeInSection delay={200} className="order-2">
                <div className="relative aspect-square md:aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-xl group">
                  <Image
                    src="/images/about/services.png"
                    alt="Professional Beauty and Styling Services"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-bl from-pink-500/10 to-transparent mix-blend-overlay" />
                </div>
              </FadeInSection>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: WHY CHOOSE US */}
      <WhyChooseUs />
    </div>
  );
}
