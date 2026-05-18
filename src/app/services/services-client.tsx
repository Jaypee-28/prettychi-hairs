"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

type ServiceData = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  [key: string]: any;
};

interface ServicesClientProps {
  services: ServiceData[];
}

export function ServicesClient({ services }: ServicesClientProps) {
  return (
    <main className="bg-white min-h-screen">
      {/* 1. HERO SECTION (LUXURY MINIMAL) */}
      <section className="bg-gradient-to-b from-[#FFF1F6] to-white py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-pink-500 font-semibold block mb-4">
            SERVICES
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Luxury Beauty Services
          </h1>
          <p className="text-gray-600 mt-4 md:text-lg">
            From premium hair installations to flawless glam, we bring your beauty vision to life with expert care.
          </p>
        </div>
      </section>

      {/* 2. SERVICES GRID (CORE SECTION) */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-medium">No services available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service) => (
              <div 
                key={service.id}
                className="group flex flex-col bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] w-full bg-gray-50 overflow-hidden">
                  {service.imageUrl ? (
                    <Image
                      src={service.imageUrl}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                      No Image Available
                    </div>
                  )}
                </div>
                
                {/* Content Container */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
                    {service.description}
                  </p>
                  
                  <Link
                    href={`/booking?serviceId=${service.id}`}
                    className="w-full text-center bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. CTA BANNER (BOOKING PUSH) */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="bg-pink-500 rounded-2xl py-16 px-6 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Elevate Your Look?
          </h2>
          <p className="text-pink-50 mb-8 max-w-2xl mx-auto md:text-lg">
            Book your appointment today and experience premium beauty services tailored just for you.
          </p>
          <Link
            href="/booking"
            className="inline-block bg-white text-pink-500 font-semibold hover:bg-gray-100 rounded-full px-6 py-3 transition-colors duration-300"
          >
            Book Appointment
          </Link>
        </div>
      </section>
    </main>
  );
}
