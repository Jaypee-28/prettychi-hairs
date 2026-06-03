"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Globe, X, Mail, Phone, MapPin, Sparkles } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const isExcludedPage = pathname?.startsWith("/admin") || pathname === "/login" || pathname === "/register";
  
  if (isExcludedPage) return null;

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-[#FF4D8D] rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-200 group-hover:rotate-12 transition-transform duration-500">
                <span className="text-xl font-black italic">P</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">PRETTY CHI HAIRS</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Experience the pinnacle of luxury hair. Sourced ethically, designed for perfection. Your journey to flawless hair starts here.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#FF4D8D] hover:text-white transition-all duration-300">
                <Camera size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#FF4D8D] hover:text-white transition-all duration-300">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#FF4D8D] hover:text-white transition-all duration-300">
                <X size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/products" className="text-gray-500 hover:text-[#FF4D8D] text-sm font-medium transition-colors">Shop Collection</Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-500 hover:text-[#FF4D8D] text-sm font-medium transition-colors">Booking Services</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-500 hover:text-[#FF4D8D] text-sm font-medium transition-colors">Our Story</Link>
              </li>
              <li>
                <Link href="/faqs" className="text-gray-500 hover:text-[#FF4D8D] text-sm font-medium transition-colors">FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Customer Support</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-[#FF4D8D] text-sm font-medium transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-500 hover:text-[#FF4D8D] text-sm font-medium transition-colors">Shipping & Returns</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-500 hover:text-[#FF4D8D] text-sm font-medium transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-[#FF4D8D] text-sm font-medium transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Store Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#FF4D8D] mt-0.5" />
                <span className="text-gray-500 text-sm">15 Chime Avenue, New Haven, Enugu, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#FF4D8D]" />
                <span className="text-gray-500 text-sm">+234 803 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#FF4D8D]" />
                <span className="text-gray-500 text-sm">hello@prettychihairs.com</span>
              </li>
            </ul>
            <div className="pt-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-full text-[#FF4D8D] text-xs font-bold uppercase tracking-widest">
                    <Sparkles size={14} />
                    <span>Premium Quality Guaranteed</span>
                </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs font-medium">
            © {currentYear} PRETTY CHI HAIRS. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Secure Payments via Paystack</span>
            {/* Add payment icons placeholder if needed */}
          </div>
        </div>
      </div>
    </footer>
  );
}
