import { Suspense } from "react";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata = {
  title: "Register | Pretty Chi Hairs",
  description: "Create your Pretty Chi Hairs account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 mb-2">
            Pretty Chi Hairs
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Join the community of premium beauty
          </p>
        </div>
        <Suspense fallback={<div className="h-96" />}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
