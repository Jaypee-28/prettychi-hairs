"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Users, 
  Settings, 
  LogOut, 
  ShoppingBag,
  Scissors,
  Calendar,
  X,
  MessageSquareQuote,
  Mail,
  HelpCircle
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Services", href: "/admin/services", icon: Scissors },
  { label: "Bookings", href: "/admin/bookings", icon: Calendar },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({
  isOpen,
  setIsOpen
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-gray-100 flex flex-col shadow-2xl lg:shadow-none lg:static lg:flex transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo Section */}
        <div className="h-16 lg:h-20 flex items-center justify-between px-8 shrink-0">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#FF4D8D] to-[#FF80AC] rounded-[14px] flex items-center justify-center text-white shadow-lg shadow-pink-200 group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag size={20} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900">LIZZY&apos;S<span className="text-[#FF4D8D]">.</span></span>
          </Link>
          
          <button 
            className="lg:hidden p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-3">Main Menu</p>
          <nav className="space-y-1.5">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
                    isActive 
                      ? "bg-[#FF4D8D]/10 text-[#FF4D8D] font-bold" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 w-1.5 h-8 bg-[#FF4D8D] rounded-r-full shadow-[0_0_10px_rgba(255,77,141,0.5)]"></div>
                  )}
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={cn(
                    "transition-transform duration-300",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} />
                  <span className="tracking-wide">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-5 mt-auto shrink-0 border-t border-gray-100/50">

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center justify-center gap-3 px-4 py-3.5 w-full text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all font-bold tracking-wide"
          >
            <LogOut size={18} strokeWidth={2.5} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
