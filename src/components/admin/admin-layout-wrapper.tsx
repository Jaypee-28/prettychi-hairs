"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./admin-sidebar";
import AdminNavbar from "./admin-navbar";
import { AdminFooter } from "./admin-footer";

export default function AdminLayoutWrapper({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: { name?: string | null; email?: string | null; image?: string | null };
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Admin login page — render without dashboard shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#F8F9FB] text-gray-900 font-sans overflow-hidden">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <AdminNavbar toggleSidebar={() => setIsSidebarOpen(true)} user={user} />
        <div className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col">
          <div className="flex-1 p-4 md:p-10">
            {children}
          </div>
          <AdminFooter />
        </div>
      </main>
    </div>
  );
}
