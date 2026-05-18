import { Suspense } from "react";
import AdminLoginContent from "./admin-login-content";

export const metadata = {
  title: "Admin Login | Pretty Chi Hairs",
  description: "Sign in to manage your premium hair store",
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <AdminLoginContent />
    </Suspense>
  );
}
