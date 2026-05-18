"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Loader2,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        ...formData,
        isAdmin: "true",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials", {
          description: "Access to the management portal is restricted to authorized staff."
        });
      } else {
        toast.success("Welcome back", {
          description: "Authenticated as Pretty Chi Hairs Administrator"
        });
        router.push("/admin");
      }
    } catch (error) {
      toast.error("An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF4D8D]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-900/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[480px] z-10">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-[#FF4D8D] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <ShieldCheck size={12} />
            <span>Management Portal</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
            Pretty Chi Hairs&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D8D] to-pink-400">Studio</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm tracking-wide">
            Authorized Personnel Access Only
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative group">
          {/* Subtle Border Glow */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Staff Email</label>
                <div className="relative group/field">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/field:text-[#FF4D8D] transition-colors" size={18} />
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white font-bold text-sm focus:outline-none focus:border-[#FF4D8D]/40 focus:ring-4 focus:ring-[#FF4D8D]/5 transition-all placeholder:text-gray-700" 
                    placeholder="name@lizzystudio.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Secure Password</label>
                <div className="relative group/field">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/field:text-[#FF4D8D] transition-colors" size={18} />
                  <input 
                    required
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white font-bold text-sm focus:outline-none focus:border-[#FF4D8D]/40 focus:ring-4 focus:ring-[#FF4D8D]/5 transition-all placeholder:text-gray-700" 
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#FF4D8D] to-pink-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-pink-900/20 active:scale-[0.98] transition-all disabled:opacity-70 group/btn"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 text-white font-black text-xs">
                <Sparkles size={14} />
                SECURE
             </div>
             <div className="flex items-center gap-2 text-white font-black text-xs">
                <Lock size={14} />
                ENCRYPTED
             </div>
          </div>
          <p className="text-[10px] font-bold text-gray-600 text-center uppercase tracking-widest">
            © 2026 Pretty Chi Hairs Internal Systems
          </p>
        </div>
      </div>
    </div>
  );
}
