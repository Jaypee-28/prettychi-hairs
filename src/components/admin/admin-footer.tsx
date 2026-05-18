import React from "react";
import Link from "next/link";

export function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-100/50 bg-white/50 backdrop-blur-xl px-6 md:px-10 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span>&copy; {currentYear}</span>
          <span className="text-gray-900">Pretty Chi Hairs</span>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-200"></span>
          <span className="hidden sm:inline-block">Administrative Panel</span>
        </div>
        
        <div className="flex items-center gap-6">
          {/* <Link href="/admin/settings" className="hover:text-[#FF4D8D] transition-colors">Settings</Link>
          <Link href="/help" className="hover:text-[#FF4D8D] transition-colors">Support</Link> */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className="text-emerald-600">System Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
