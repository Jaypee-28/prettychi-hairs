"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Minus, HelpCircle, Mail, CalendarDays, Loader2 } from "lucide-react";

export function FaqsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);
  
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch("/api/faqs");
        const data = await res.json();
        
        // If empty, hit the seed route to auto-populate default FAQs
        if (Array.isArray(data) && data.length === 0) {
          await fetch("/api/faqs/seed", { method: "POST" });
          const retryRes = await fetch("/api/faqs");
          const retryData = await retryRes.json();
          if (Array.isArray(retryData)) setFaqs(retryData);
        } else if (Array.isArray(data)) {
          setFaqs(data);
        }
      } catch (err) {
        console.error("Failed to load FAQs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  // Dynamically extract unique categories
  const categories = useMemo(() => {
    const unique = Array.from(new Set(faqs.map(f => f.category)));
    return ["All", ...unique];
  }, [faqs]);

  // Filter logic
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch = 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
      
      // If typing in search, ignore category tabs to show all matching results
      if (searchQuery.trim().length > 0) {
        return matchesSearch;
      }
      
      return matchesCategory;
    });
  }, [searchQuery, activeCategory, faqs]);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      
      {/* SECTION 1: HERO */}
      <section className="bg-white pt-24 pb-16 md:pt-32 md:pb-24 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-50 text-[#FF4D8D] mb-6">
            <HelpCircle size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto">
            Everything you need to know about Pretty Chi Hairs products, orders, and premium beauty services.
          </p>
        </div>
      </section>

      {/* SECTION 2 & 3: SEARCH & TABS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        {/* Search Bar */}
        <div className="bg-white p-2 rounded-full shadow-lg border border-gray-100 flex items-center mb-10 max-w-2xl mx-auto focus-within:ring-4 focus-within:ring-pink-500/20 transition-all">
          <div className="pl-6 text-gray-400">
            <Search size={20} />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full px-4 py-4 rounded-full outline-none font-medium text-gray-900 placeholder:text-gray-400 bg-transparent"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="pr-6 text-gray-400 hover:text-gray-600 font-bold text-sm"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Tabs */}
        {!searchQuery && !loading && categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                  activeCategory === cat 
                    ? "bg-[#FF4D8D] text-white shadow-md shadow-pink-200" 
                    : "bg-white text-gray-600 hover:bg-pink-50 hover:text-[#FF4D8D] border border-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 4: ACCORDION LIST */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 min-h-[40vh]">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#FF4D8D]">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="font-bold text-gray-500">Loading FAQs...</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-300 border border-dashed border-gray-200 mx-auto mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 font-medium">We couldn't find any questions matching your search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <div 
                key={faq.id} 
                className={`bg-white rounded-2xl transition-all duration-300 ${
                  openId === faq.id 
                    ? "shadow-md border border-pink-100" 
                    : "shadow-sm border border-gray-100 hover:border-pink-200"
                }`}
              >
                <button 
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full px-6 py-6 flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className={`font-bold text-lg transition-colors pr-8 ${openId === faq.id ? "text-[#FF4D8D]" : "text-gray-900 group-hover:text-[#FF4D8D]"}`}>
                    {faq.question}
                  </span>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openId === faq.id ? "bg-[#FF4D8D] text-white" : "bg-pink-50 text-[#FF4D8D]"}`}>
                    {openId === faq.id ? <Minus size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out px-6 ${
                    openId === faq.id ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-600 font-medium leading-relaxed border-t border-gray-50 pt-4 whitespace-pre-wrap">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 5: CTA */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">
            Still need help?
          </h2>
          <p className="text-lg text-gray-500 font-medium mb-10 max-w-xl mx-auto">
            If you couldn't find the answer to your question, our support team is always ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#FF4D8D] text-white rounded-full px-8 py-4 font-black tracking-wide hover:bg-[#E6457E] hover:shadow-lg transition-all duration-300"
            >
              <Mail size={20} />
              Contact Us
            </Link>
            <Link 
              href="/booking"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-gray-900 border-2 border-gray-100 rounded-full px-8 py-4 font-black tracking-wide hover:bg-gray-50 hover:border-gray-200 transition-all duration-300"
            >
              <CalendarDays size={20} />
              Book Appointment
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
