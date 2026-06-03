"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  User as UserIcon, 
  LogOut, 
  Info, 
  X,
  ChevronDown
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function AdminNavbar({
  toggleSidebar,
  user
}: {
  toggleSidebar: () => void;
  user?: { name?: string | null; email?: string | null; image?: string | null };
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileSearch(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real implementation, this would toggle a class on the html/body
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 flex items-center justify-between px-4 lg:px-10 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button 
          className="lg:hidden p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
          onClick={toggleSidebar}
        >
          <Menu size={24} strokeWidth={2.5} />
        </button>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden sm:flex items-center bg-gray-50/80 hover:bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 w-full max-w-md group focus-within:bg-white focus-within:border-[#FF4D8D]/30 focus-within:ring-4 focus-within:ring-[#FF4D8D]/5 transition-all">
          <Search size={18} strokeWidth={2.5} className="text-gray-400 group-focus-within:text-[#FF4D8D] transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, orders..." 
            className="bg-transparent border-none focus:ring-0 text-sm font-medium ml-3 w-full text-gray-700 placeholder:text-gray-400"
          />
        </form>

        {/* Mobile Search Overlay */}
        {showMobileSearch && (
          <div className="absolute inset-0 bg-white z-50 flex items-center px-4 sm:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearch} className="flex items-center flex-1 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
              <Search size={18} strokeWidth={2.5} className="text-gray-400" />
              <input 
                autoFocus
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..." 
                className="bg-transparent border-none focus:ring-0 text-sm font-medium ml-3 w-full text-gray-700"
              />
            </form>
            <button 
              onClick={() => setShowMobileSearch(false)}
              className="ml-2 p-2 text-gray-400 hover:text-gray-900"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 lg:gap-6 ml-4">
        {/* Mobile Search Trigger */}
        <button 
          onClick={() => setShowMobileSearch(true)}
          className="sm:hidden p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
        >
          <Search size={22} strokeWidth={2.5} />
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 text-gray-500 hover:text-[#FF4D8D] hover:bg-pink-50/50 rounded-xl transition-all duration-300"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={22} strokeWidth={2.5} /> : <Moon size={22} strokeWidth={2.5} />}
        </button>
        
        <div className="hidden lg:block h-8 w-px bg-gray-200/60"></div>

        {/* Profile Menu */}
        <div className="relative" ref={profileMenuRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3.5 pl-2 cursor-pointer group focus:outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-tight group-hover:text-[#FF4D8D] transition-colors">{user?.name || "Admin User"}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Administrator</p>
            </div>
            <div className={cn(
              "w-11 h-11 rounded-xl border shadow-sm flex items-center justify-center transition-all duration-300",
              showProfileMenu 
                ? "bg-[#FF4D8D] text-white border-transparent ring-4 ring-pink-50" 
                : "bg-pink-50 text-[#FF4D8D] border-pink-100 group-hover:shadow-md group-hover:scale-105"
            )}>
              {user?.image ? (
                <img src={user.image} alt="" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <UserIcon size={22} strokeWidth={2.5} />
              )}
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-3 w-64 origin-top-right z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden ring-1 ring-black/5">
                <div className="p-5 border-b border-gray-50 bg-gray-50/30">
                  <p className="text-sm font-bold text-gray-900">{user?.name || "Admin User"}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{user?.email || "admin@prettychihairs.com"}</p>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => {
                      router.push("/admin/settings");
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#FF4D8D] transition-all"
                  >
                    <Info size={18} strokeWidth={2.5} />
                    Account Information
                  </button>
                  <div className="my-1 h-px bg-gray-50"></div>
                  <button 
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut size={18} strokeWidth={2.5} />
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
