"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  Loader2, 
  CheckCircle,
  Plus,
  Minus
} from "lucide-react";

// Reusable fade-in animation
function FadeInSection({ 
  children, 
  delay = 0, 
  className = "" 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
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
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// FAQ Accordion Item
function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="font-bold text-gray-900 group-hover:text-[#FF4D8D] transition-colors text-lg">
          {question}
        </span>
        <div className="text-gray-400 group-hover:text-[#FF4D8D] transition-colors ml-4 shrink-0">
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <p className="text-gray-600 font-medium leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: ""
  });
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="w-full overflow-hidden bg-white">
      
      {/* SECTION 1: HERO */}
      <section className="relative w-full min-h-[50vh] flex items-center justify-center pt-24 pb-16 md:pt-32">
        <div className="absolute inset-0 bg-[#FFF0F5] z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-pink-200/50 via-transparent to-transparent z-0" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <FadeInSection>
            <span className="inline-block text-[#FF4D8D] font-black uppercase tracking-[0.2em] text-xs md:text-sm mb-4 bg-white px-4 py-1.5 rounded-full shadow-sm border border-pink-100">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight mb-6 max-w-3xl leading-tight">
              Let’s Talk Beauty.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-medium mb-10 max-w-2xl mx-auto md:mx-0">
              Have questions, need help, or ready to book? We’re here for you. Reach out to our expert team for personalized support.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link 
                href="/booking"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#FF4D8D] text-white rounded-full px-8 py-4 font-black tracking-wide hover:bg-[#E6457E] hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                Book Appointment
              </Link>
              <Link 
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-gray-900 border-2 border-gray-100 rounded-full px-8 py-4 font-black tracking-wide hover:border-gray-200 hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300"
              >
                Shop Products
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* SECTION 2: CONTACT METHODS GRID */}
      <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: Phone, label: "Call Us", value: "+234 803 123 4567", href: "tel:+2348031234567" },
            { icon: Mail, label: "Email Us", value: "hello@prettychihairs.com", href: "mailto:hello@prettychihairs.com" },
            { icon: MapPin, label: "Visit Us", value: "15 Chime Ave, Enugu, Nigeria", href: "#" },
            { icon: Clock, label: "Business Hours", value: "Mon-Sat: 9AM - 5PM", href: "#" },
          ].map((item, idx) => (
            <FadeInSection key={idx} delay={idx * 100}>
              <a 
                href={item.href}
                className="flex flex-col items-center justify-center bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ease-out group text-center h-full"
              >
                <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-[#FF4D8D] mb-5 group-hover:bg-[#FF4D8D] group-hover:text-white transition-colors duration-500">
                  <item.icon size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">{item.label}</h3>
                <p className="text-lg font-bold text-gray-900">{item.value}</p>
              </a>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* SECTION 3: MAIN CONTACT SECTION */}
      <section className="py-16 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection className="max-w-3xl mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
            Send us a Message
          </h2>
          <p className="text-gray-500 font-medium text-lg">
            Fill out the form below and our team will get back to you within 24 hours.
          </p>
        </FadeInSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          
          {/* LEFT: FORM */}
          <div className="lg:col-span-3">
            <FadeInSection delay={100}>
              {status === "success" ? (
                <div className="bg-green-50 border border-green-100 p-8 rounded-[2rem] text-center animate-in fade-in slide-in-from-bottom-4">
                  <div className="inline-flex w-16 h-16 bg-white rounded-full items-center justify-center text-green-500 mb-4 shadow-sm">
                    <CheckCircle size={32} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 font-medium">We’ve received your message and will respond shortly.</p>
                  <button 
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-[#FF4D8D] font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50/50 p-6 md:p-10 rounded-[2.5rem] border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Full Name *</label>
                      <input 
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-[#FF4D8D] outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300 shadow-sm"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Email Address *</label>
                      <input 
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-[#FF4D8D] outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300 shadow-sm"
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Phone Number</label>
                      <input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-[#FF4D8D] outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300 shadow-sm"
                        placeholder="+234 803 123 4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Subject *</label>
                      <select 
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-[#FF4D8D] outline-none transition-all font-medium text-gray-900 shadow-sm appearance-none cursor-pointer"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Order Issue">Order Issue</option>
                        <option value="Booking Question">Booking Question</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Message *</label>
                    <textarea 
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-[#FF4D8D] outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300 shadow-sm resize-y"
                      placeholder="How can we help you today?"
                    />
                  </div>

                  {status === "error" && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                      {errorMessage}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-[#FF4D8D] text-white rounded-2xl px-8 py-5 font-black text-lg hover:bg-[#E6457E] hover:shadow-lg shadow-pink-200 transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>
                        Send Message
                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </FadeInSection>
          </div>

          {/* RIGHT: INFO BOX */}
          <div className="lg:col-span-2 flex flex-col">
            <FadeInSection delay={200} className="h-full">
              <div className="bg-gradient-to-br from-gray-900 to-black p-10 rounded-[2.5rem] shadow-xl text-white h-full flex flex-col justify-center">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-md">
                  <Clock size={28} />
                </div>
                <h3 className="text-2xl font-black mb-3">Ready for Glam?</h3>
                <p className="text-gray-400 font-medium mb-8">Skip the wait and secure your spot at our luxury studio today.</p>
                <Link 
                  href="/booking"
                  className="block w-full text-center bg-[#FF4D8D] text-white rounded-2xl px-6 py-4 font-black hover:bg-[#E6457E] transition-all transform hover:scale-105"
                >
                  Book Appointment
                </Link>
              </div>
            </FadeInSection>
          </div>

        </div>
      </section>



      {/* SECTION 4: FAQ PREVIEW */}
      <section className="py-16 md:py-24 bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">
              Common Questions
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              Quick answers to help you along your beauty journey.
            </p>
          </FadeInSection>

          <FadeInSection delay={100} className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
            <FAQItem 
              question="How long does delivery take?" 
              answer="Standard delivery takes 3-5 business days domestically. Express shipping options are available at checkout for 1-2 day delivery." 
            />
            <FAQItem 
              question="Do you accept returns?" 
              answer="Yes, we accept returns on unworn, unmodified hair within 14 days of receipt. Please ensure the hygiene seal remains intact." 
            />
            <FAQItem 
              question="How do I book a service?" 
              answer="You can book a service directly through our Booking portal. Simply select your desired service, choose a date and time, and confirm your appointment." 
            />
            <FAQItem 
              question="Do you offer custom wigs?" 
              answer="Absolutely. We offer fully customized wig construction. Please use the contact form above and select 'General Inquiry' to discuss your specific requirements." 
            />
          </FadeInSection>

          <div className="mt-10 text-center">
            <Link href="/faq" className="text-[#FF4D8D] font-bold hover:underline inline-flex items-center gap-2">
              View All FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: FINAL CTA */}
      <section className="py-24 w-full text-center">
        <FadeInSection>
          <div className="bg-gradient-to-br from-[#FFF0F5] to-pink-50 p-12 md:p-20 shadow-sm border-y border-pink-100/50 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-6">
                Ready to Transform?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 font-medium mb-10 max-w-xl mx-auto">
                Discover the difference of premium quality and expert styling.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <Link 
                  href="/booking"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-[#FF4D8D] text-white rounded-full px-8 py-4 font-black tracking-wide hover:bg-[#E6457E] hover:shadow-lg transition-all duration-300"
                >
                  Book Now
                </Link>
                <Link 
                  href="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-gray-900 rounded-full px-8 py-4 font-black tracking-wide border-2 border-gray-100 hover:border-gray-200 transition-all duration-300"
                >
                  Shop Products
                </Link>
              </div>
            </div>
            {/* Decorative background circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-100/50 rounded-full blur-3xl -z-0 pointer-events-none" />
          </div>
        </FadeInSection>
      </section>

    </div>
  );
}
