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
  Settings,
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
          "top-0 z-[60] w-full transition-all duration-500",
          showTransparent 
            ? "bg-transparent border-transparent py-6" 
            : "bg-white/95 backdrop-blur-xl border-b border-gray-100 py-3 shadow-lg shadow-black/5"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className={cn(
                "lg:hidden p-2 -ml-2 rounded-xl transition-colors",
                showTransparent ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-50"
            )}
          >
            <Menu size={24} strokeWidth={2.5} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 bg-[#FF4D8D] rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-200 group-hover:rotate-12 transition-transform duration-500">
              <span className="text-xl font-black italic">P</span>
            </div>
            <span className={cn(
                "text-2xl font-black tracking-tighter uppercase hidden lg:block transition-colors duration-500",
                showTransparent ? "text-white" : "text-gray-900"
            )}>PRETTY CHI HAIRS</span>
          </Link>

          {/* Center Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              href="/" 
              className={cn(
                "text-[13px] font-black uppercase tracking-widest transition-all",
                pathname === "/" 
                  ? (showTransparent ? "text-white/60" : "text-[#FF4D8D]") 
                  : (showTransparent ? "text-white hover:text-white/80" : "text-gray-900 hover:text-[#FF4D8D]")
              )}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className={cn(
                "text-[13px] font-black uppercase tracking-widest transition-all",
                pathname === "/products" 
                  ? "text-[#FF4D8D]" 
                  : (showTransparent ? "text-white hover:text-white/80" : "text-gray-900 hover:text-[#FF4D8D]")
              )}
            >
              Shop
            </Link>
            <Link 
              href="/services" 
              className={cn(
                "text-[13px] font-black uppercase tracking-widest transition-all",
                pathname === "/services" 
                  ? "text-[#FF4D8D]" 
                  : (showTransparent ? "text-white hover:text-white/80" : "text-gray-900 hover:text-[#FF4D8D]")
              )}
            >
              Services
            </Link>
            <Link 
              href="/about" 
              className={cn(
                "text-[13px] font-black uppercase tracking-widest transition-all",
                pathname === "/about" 
                  ? "text-[#FF4D8D]" 
                  : (showTransparent ? "text-white hover:text-white/80" : "text-gray-900 hover:text-[#FF4D8D]")
              )}
            >
              About Us
            </Link>

            {/* Pages Dropdown */}
            <div 
              className="relative group py-2"
              onMouseEnter={() => setActiveDropdown('pages')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={cn(
                  "flex items-center gap-1 text-[13px] font-black uppercase tracking-widest transition-all",
                  showTransparent ? "text-white hover:text-white/80" : "text-gray-900 hover:text-[#FF4D8D]"
              )}>
                Pages
                <ChevronDown size={14} className={cn("transition-transform duration-300", activeDropdown === 'pages' && "rotate-180")} />
              </button>
              
              <div className={cn(
                "absolute top-full left-0 w-56 pt-2 transition-all duration-300 origin-top-left",
                activeDropdown === 'pages' ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95 pointer-events-none"
              )}>
                <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden p-2">
                  <Link href="/about" className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#FF4D8D] transition-all">
                    About Us <ChevronRight size={14} />
                  </Link>
                  <Link href="/faqs" className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#FF4D8D] transition-all">
                    FAQs <ChevronRight size={14} />
                  </Link>
                  <Link href="/contact" className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#FF4D8D] transition-all">
                    Contact <ChevronRight size={14} />
                  </Link>
                  <Link href="/privacy" className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#FF4D8D] transition-all">
                    Privacy Policy <ChevronRight size={14} />
                  </Link>
                  <Link href="/terms" className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#FF4D8D] transition-all">
                    Terms & Conditions <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            <Link 
              href="/booking" 
              className={cn(
                "text-[13px] font-black uppercase tracking-widest transition-all px-4 py-2 rounded-xl",
                pathname === "/booking" 
                  ? "bg-[#FF4D8D] text-white" 
                  : showTransparent
                    ? "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                    : "bg-gray-900 text-white hover:bg-[#FF4D8D] hover:shadow-lg hover:shadow-pink-100"
              )}
            >
              Book Now
            </Link>
          </nav>

          {/* Actions (Right) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Icon */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn(
                  "p-2.5 rounded-xl transition-all",
                  showTransparent ? "text-white hover:bg-white/10" : "text-gray-500 hover:text-[#FF4D8D] hover:bg-pink-50"
              )}
            >
              <Search size={22} strokeWidth={2.5} />
            </button>

            {/* Profile Dropdown */}
            <div 
              className="relative group py-2"
              onMouseEnter={() => setActiveDropdown('profile')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={cn(
                  "p-2.5 rounded-xl transition-all",
                  showTransparent ? "text-white hover:bg-white/10" : "text-gray-500 hover:text-[#FF4D8D] hover:bg-pink-50"
              )}>
                <User size={22} strokeWidth={2.5} />
              </button>

              <div className={cn(
                "absolute top-full right-0 w-64 pt-2 transition-all duration-300 origin-top-right",
                activeDropdown === 'profile' ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95 pointer-events-none"
              )}>
                <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                  {status === "authenticated" ? (
                    <div className="p-2">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Signed in as</p>
                        <p className="text-sm font-black text-gray-900 truncate">{session.user?.name || session.user?.email}</p>
                      </div>
                      <Link href="/account" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#FF4D8D] transition-all">
                        <UserCircle size={18} /> Account Profile
                      </Link>
                      <Link href="/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#FF4D8D] transition-all">
                        <Package size={18} /> My Orders
                      </Link>
                      <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#FF4D8D] transition-all">
                        <Heart size={18} /> My Wishlist
                      </Link>

                      <button 
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all mt-1"
                      >
                        <LogOut size={18} /> Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="p-2">
                      <div className="px-4 py-4 text-center space-y-2 border-b border-gray-50 mb-2">
                         <p className="text-sm font-bold text-gray-900">Welcome to Pretty Chi Hairs</p>
                         <p className="text-xs text-gray-500">Sign in to track orders and manage your profile.</p>
                      </div>
                      <Link href="/login" className="block w-full text-center px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest bg-gray-900 text-white hover:bg-gray-800 transition-all mb-2">
                        Login
                      </Link>
                      <Link href="/register" className="block w-full text-center px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest bg-white text-[#FF4D8D] border-2 border-[#FF4D8D] hover:bg-pink-50 transition-all">
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cart Icon */}
            <Link href="/cart" className={cn(
                "relative p-2.5 rounded-xl transition-all group shrink-0",
                showTransparent ? "text-white hover:bg-white/10" : "text-gray-900 hover:text-[#FF4D8D] hover:bg-pink-50"
            )}>
              <ShoppingCart size={22} strokeWidth={2.5} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-[#FF4D8D] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-pink-200 border-2 border-white animate-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Expandable Search Bar Overlay */}
        <div className={cn(
          "absolute top-0 left-0 w-full bg-white z-[70] transition-all duration-500 ease-in-out border-b border-gray-100",
          isSearchOpen ? "h-full opacity-100 translate-y-0" : "h-0 opacity-0 -translate-y-4 overflow-hidden"
        )}>
          <div className="max-w-[1400px] mx-auto h-full px-6 md:px-12 flex items-center gap-6">
            <Search className="text-gray-400" size={24} />
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search for premium products, wigs, care..."
                className="w-full h-full bg-transparent border-none outline-none text-lg font-bold text-gray-900 placeholder:text-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation */}
      <div 
        className={cn(
          "fixed inset-0 z-[100] bg-gray-900/40 backdrop-blur-sm transition-all duration-500",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={cn(
            "absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out p-8 flex flex-col",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-12">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="w-10 h-10 bg-[#FF4D8D] rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-200">
                <span className="text-xl font-black italic">P</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">PRETTY CHI HAIRS</span>
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
          </div>

          <nav className="flex-1 space-y-6">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-2xl font-black text-gray-900 uppercase tracking-tight hover:text-[#FF4D8D] transition-colors">Home</Link>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="block text-2xl font-black text-gray-900 uppercase tracking-tight hover:text-[#FF4D8D] transition-colors">Shop</Link>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="block text-2xl font-black text-gray-900 uppercase tracking-tight hover:text-[#FF4D8D] transition-colors">Services</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block text-2xl font-black text-gray-900 uppercase tracking-tight hover:text-[#FF4D8D] transition-colors">About Us</Link>
            <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)} className="inline-block px-6 py-4 bg-[#FF4D8D] text-white rounded-2xl text-xl font-black uppercase tracking-tight shadow-lg shadow-pink-200">Book Now</Link>
            
            <div className="pt-6 border-t border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Discovery</p>
                <div className="space-y-4">
                    <Link href="/faqs" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-bold text-gray-600 hover:text-[#FF4D8D]">FAQs</Link>
                    <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-bold text-gray-600 hover:text-[#FF4D8D]">My Wishlist</Link>
                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-bold text-gray-600 hover:text-[#FF4D8D]">Contact</Link>
                    <Link href="/privacy" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-bold text-gray-600 hover:text-[#FF4D8D]">Privacy Policy</Link>
                </div>
            </div>
          </nav>

          <div className="pt-8 mt-auto border-t border-gray-100">
             {status === "authenticated" ? (
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FF4D8D] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-pink-200 uppercase">
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-sm font-black text-gray-900 truncate">{session.user?.name || session.user?.email}</p>
                    <button onClick={() => signOut()} className="text-xs font-bold text-red-500 uppercase tracking-wider">Sign Out</button>
                  </div>
               </div>
             ) : (
               <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center py-4 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest">Login</Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center py-4 border-2 border-[#FF4D8D] text-[#FF4D8D] rounded-2xl text-xs font-black uppercase tracking-widest">Register</Link>
               </div>
             )}
          </div>
        </div>
      </div>
    </>
  );
}
