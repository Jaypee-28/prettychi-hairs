"use client";

import React from "react";
import { ShieldCheck, CalendarCheck, Heart, Sparkles } from "lucide-react";
import { FadeInSection } from "../shared/fade-in-section";

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <FadeInSection className="text-center mb-16">
        <span className="inline-block text-[#FF4D8D] font-black uppercase tracking-widest text-xs md:text-sm mb-3">
          The Advantage
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
          Why Choose Us
        </h2>
      </FadeInSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {[
          {
            icon: Sparkles,
            title: "Premium Quality",
            desc: "100% virgin human hair that lasts, looks, and feels extraordinary."
          },
          {
            icon: ShieldCheck,
            title: "Expert Stylists",
            desc: "Highly trained professionals dedicated to perfecting your look."
          },
          {
            icon: CalendarCheck,
            title: "Seamless Booking",
            desc: "Effortlessly schedule your glam sessions online in seconds."
          },
          {
            icon: Heart,
            title: "Customer Satisfaction",
            desc: "Your confidence and happiness are our ultimate priorities."
          }
        ].map((feature, idx) => (
          <FadeInSection key={idx} delay={idx * 100}>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ease-out group h-full">
              <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-[#FF4D8D] mb-6 group-hover:bg-[#FF4D8D] group-hover:text-white transition-colors duration-500">
                <feature.icon size={28} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}
