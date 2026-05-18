import React from "react";
import AdminLayoutWrapper from "@/components/admin/admin-layout-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Pretty Chi Hairs",
  description: "Pretty Chi Hairs Admin Dashboard",
};

import { auth } from "@/auth.node";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  return (
    <AdminLayoutWrapper user={session?.user}>
      {children}
    </AdminLayoutWrapper>
  );
}
