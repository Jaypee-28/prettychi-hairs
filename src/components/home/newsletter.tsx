"use client";

import React, { useState } from "react";
import { Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus("success");
        setMessage("You're in 💕");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("An error occurred.");
    }
  };

  return (
    <section className="w-full">
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#FFF0F5] to-pink-50 py-10 md:py-12 px-4 sm:px-6 lg:px-8 text-center shadow-sm border-y border-pink-100/50">
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-pink-200 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-sm text-[#FF4D8D] mb-4 md:mb-6">
            <Mail size={24} strokeWidth={2.5} />
          </div>
          
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-3 md:mb-4">
            Join Pretty Chi Hairs's Beauty Circle
          </h2>
          
          <p className="text-base md:text-lg text-gray-600 font-medium mb-8 max-w-xl mx-auto">
            Get exclusive offers, beauty tips & new arrivals straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto relative flex flex-col sm:flex-row gap-3 sm:gap-0">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-8 py-5 rounded-full sm:rounded-r-none bg-white border-2 border-transparent focus:border-[#FF4D8D] outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 shadow-sm"
            />
            <button 
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full sm:w-auto bg-[#FF4D8D] text-white px-8 py-5 rounded-full sm:rounded-l-none font-black tracking-wide hover:bg-[#E6457E] transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {status === "loading" ? (
                <Loader2 size={20} className="animate-spin" />
              ) : status === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <>
                  Subscribe
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Inline Validation / Success Message */}
          {message && (
            <div className={`mt-6 font-bold text-sm inline-flex items-center justify-center px-4 py-2 rounded-full ${
              status === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
            }`}>
              {message}
            </div>
          )}
          
          <p className="text-gray-400 text-xs font-medium mt-8">
            By subscribing, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
}
