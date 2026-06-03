"use client";

import React, { useRef, useEffect, useState } from "react";
import { Star, MessageSquareQuote } from "lucide-react";
import { ReviewModal } from "./review-modal";

type Testimonial = {
  id: string;
  name: string;
  message: string;
  rating: number | null;
};

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fetch approved testimonials
    fetch("/api/testimonials")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTestimonials(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (testimonials.length === 0 || !sectionRef.current) return;

    // Scroll Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [testimonials]);

  if (testimonials.length === 0) return null;

  return (
    <section 
      ref={sectionRef} 
      className={`py-16 md:py-24 bg-gradient-to-b from-white to-pink-50/50 overflow-hidden transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="mb-10 text-center lg:mb-16">
          <span className="inline-block text-[#FF4D8D] font-black uppercase tracking-widest text-xs md:text-sm mb-3">
            What Our Clients Say
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Real experiences from our beautiful clients
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div 
            className="flex overflow-x-auto gap-6 snap-x snap-mandatory scrollbar-hide pb-8 pt-4 -mt-4 cursor-grab active:cursor-grabbing"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none'
            }}
          >
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {testimonials.map((t, index) => (
              <div 
                key={t.id}
                className="group flex-none relative rounded-3xl bg-white transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl shadow-md border border-pink-100/50 snap-center md:snap-start w-[85vw] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] p-8 md:p-10 flex flex-col"
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <MessageSquareQuote className="text-[#FF4D8D]/20 mb-6" size={40} />
                
                <p className="text-gray-700 font-medium text-lg md:text-xl leading-relaxed italic mb-8 flex-grow">
                  "{t.message}"
                </p>

                <div className="mt-auto">
                  {t.rating && (
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  )}
                  <p className="text-gray-900 font-black tracking-wide">— {t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center text-[#FF4D8D] font-bold text-sm md:text-base border-b-2 border-transparent hover:border-[#FF4D8D] transition-colors pb-1"
          >
            Share Your Experience
          </button>
        </div>

        <ReviewModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </section>
  );
}
