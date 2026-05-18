"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Service = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
};

interface ServiceGridProps {
  services: Service[];
}

export function ServiceGrid({ services }: ServiceGridProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  if (services.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-gray-50/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-gray-900">Our Services</h2>
          <p className="mt-4 text-gray-500 font-medium">Services coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="mb-10 text-center md:text-left lg:mb-14">
          <span className="inline-block text-[#FF4D8D] font-black uppercase tracking-widest text-xs md:text-sm mb-3">
            Our Services
          </span>
          <h2 className="text-3xl font-black text-gray-900 md:text-4xl lg:text-5xl tracking-tight">
            Luxury beauty services tailored to you
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => (
            <Link
              key={service.id}
              href={`/booking?service=${service.slug}`}
              className={`group relative overflow-hidden rounded-[2rem] bg-gray-100 block transition-all duration-700 ease-out transform
                hover:shadow-xl hover:-translate-y-1 shadow-sm
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative w-full h-[300px] md:h-[350px]">
                {service.imageUrl ? (
                  <Image
                    src={service.imageUrl}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FFF0F5] to-pink-100 transition-transform duration-700 group-hover:scale-105">
                    <span className="text-pink-300 font-bold tracking-widest uppercase text-sm">No Image</span>
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 text-white flex flex-col justify-end">
                <h3 className="text-2xl font-black mb-2 leading-tight">
                  {service.name}
                </h3>
                <p className="text-gray-200 text-sm font-medium line-clamp-2 mb-5">
                  {service.description}
                </p>
                
                <div className="mt-auto">
                  <span className="inline-block bg-[#FF4D8D] text-white rounded-full px-6 py-2.5 text-sm font-bold shadow-sm transition-all duration-300 group-hover:bg-[#E6457E] group-hover:scale-105 group-hover:shadow-md">
                    Book Now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Large CTA Banner */}
        <div 
          className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#FF4D8D]/90 to-pink-400/80 py-16 px-6 text-center shadow-lg transition-all duration-1000 ease-out transform
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}
          `}
          style={{ transitionDelay: `${services.length * 100 + 100}ms` }}
        >
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
              Ready for your glow-up?
            </h3>
            <p className="text-lg md:text-xl text-pink-50 font-medium mb-8">
              Book a session with our experts today
            </p>
            <Link 
              href="/booking"
              className="inline-block bg-white text-[#FF4D8D] font-black rounded-full px-8 py-4 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Book Appointment
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
