"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/cart-context";
import { 
  ShoppingCart, 
  Search, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  UserCircle, 
  Package,
  ChevronRight,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isHome = pathname === "/";
  const showTransparent = isHome && !isScrolled;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search focus
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close menus on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setIsSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  const isExcludedPage = pathname?.startsWith("/admin") || pathname === "/login" || pathname === "/register";
  
  if (isExcludedPage) return null;

  return (
    <>
      <header 
        className={cn(
          isHome ? "fixed" : "sticky",
          "top-0 z-[60] w-full transition-all duration-300",
          showTransparent 
            ? "bg-transparent border-transparent py-6" 
            : "bg-white/95 backdrop-blur-xl border-b border-gray-100 py-3 shadow-sm"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-xl transition-colors text-black hover:bg-black/5"
          >
            <Menu size={24} strokeWidth={2.5} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="text-xl md:text-2xl font-serif font-bold tracking-tight text-black transition-colors duration-300">
              Pretty Chi Hairs
            </span>
          </Link>

          {/* Center Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/products" },
              { label: "Services", href: "/services" },
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" }
            ].map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={cn(
                  "text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors",
                  pathname === link.href ? "text-black border-b border-black pb-0.5" : "text-black/70 hover:text-black"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions (Right) */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            <Link 
              href="/booking" 
              className="hidden lg:flex text-[11px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-full border border-black text-white bg-black hover:bg-white hover:text-black transition-all mr-2"
            >
              Book Appointment
            </Link>

            {/* Search Icon */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-xl transition-all text-black hover:bg-black/5"
            >
              <Search size={20} strokeWidth={2} />
            </button>

            {/* Profile Dropdown */}
            <div 
              className="relative group py-2"
              onMouseEnter={() => setActiveDropdown('profile')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="p-2 rounded-xl transition-all text-black hover:bg-black/5">
                <User size={20} strokeWidth={2} />
              </button>

              <div className={cn(
                "absolute top-full right-0 w-64 pt-2 transition-all duration-200 origin-top-right",
                activeDropdown === 'profile' ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95 pointer-events-none"
              )}>
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  {status === "authenticated" ? (
                    <div className="p-2">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Signed in as</p>
                        <p className="text-sm font-bold text-black truncate">{session.user?.name || session.user?.email}</p>
                      </div>
                      <Link href="/account" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
                        <UserCircle size={16} /> Account Profile
                      </Link>
                      <Link href="/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
                        <Package size={16} /> My Orders
                      </Link>
                      <button 
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-1"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="p-2">
                      <div className="px-4 py-4 text-center space-y-2 border-b border-gray-50 mb-2">
                         <p className="text-sm font-bold text-black">Welcome to Pretty Chi</p>
                      </div>
                      <Link href="/login" className="block w-full text-center px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-all mb-2">
                        Login
                      </Link>
                      <Link href="/register" className="block w-full text-center px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest bg-white text-black border border-black hover:bg-gray-50 transition-all">
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 rounded-xl transition-all group shrink-0 text-black hover:bg-black/5">
              <ShoppingCart size={20} strokeWidth={2} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Expandable Search Bar Overlay */}
        <div className={cn(
          "absolute top-0 left-0 w-full bg-white z-[70] transition-all duration-300 ease-in-out border-b border-gray-100",
          isSearchOpen ? "h-full opacity-100 translate-y-0" : "h-0 opacity-0 -translate-y-4 overflow-hidden"
        )}>
          <div className="max-w-[1400px] mx-auto h-full px-6 md:px-12 flex items-center gap-6">
            <Search className="text-black" size={20} />
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search for premium products..."
                className="w-full h-full bg-transparent border-none outline-none text-base font-medium text-black placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-black hover:opacity-70 transition-opacity"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation */}
      <div 
        className={cn(
          "fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-all duration-300",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={cn(
            "absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out p-8 flex flex-col",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-12">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="text-xl font-serif font-bold tracking-tight text-black">Pretty Chi Hairs</span>
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-black hover:opacity-70 transition-opacity"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          <nav className="flex-1 space-y-6">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-xl font-semibold text-black tracking-tight hover:opacity-70">Home</Link>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="block text-xl font-semibold text-black tracking-tight hover:opacity-70">Shop</Link>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="block text-xl font-semibold text-black tracking-tight hover:opacity-70">Services</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block text-xl font-semibold text-black tracking-tight hover:opacity-70">About</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block text-xl font-semibold text-black tracking-tight hover:opacity-70">Contact</Link>
            <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)} className="inline-block mt-4 px-6 py-3 bg-black text-white rounded-full text-sm font-bold uppercase tracking-widest">Book Appointment</Link>
          </nav>

        </div>
      </div>
    </>
  );
}
