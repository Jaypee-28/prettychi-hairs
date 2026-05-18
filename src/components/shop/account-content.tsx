"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Sparkles,
  User,
  Mail,
  Phone,
  Save,
  Loader2,
  LogOut,
  Trash2,
  AlertTriangle,
  X,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";

// ── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: string;
}

interface AccountContentProps {
  user: UserProfile;
}

// ── Delete Confirmation Modal ────────────────────────────────────────────────

function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h3 className="text-xl font-black text-gray-900 uppercase mb-2">
            Delete Account
          </h3>
          <p className="text-sm font-medium text-gray-500 mb-8 max-w-sm">
            This action is <strong className="text-red-600">permanent and irreversible</strong>. Your
            profile, login sessions, and all account data will be removed. Your
            order history will be preserved anonymously.
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Trash2 size={14} />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export function AccountContent({ user }: AccountContentProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: "", // Phone is not stored on User model yet, but we allow editing
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsUpdating(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name || undefined,
          email: formData.email || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          Array.isArray(data.error) ? data.error[0]?.message : data.error
        );
      }

      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete account");
      }

      toast.success("Account deleted successfully");
      await signOut({ callbackUrl: "/" });
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-[#FBFCFD] pb-20">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <div className="space-y-1 mb-12">
          <div className="flex items-center gap-2 text-[#FF4D8D]">
            <Sparkles size={14} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              My Account
            </span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
            YOUR <span className="text-[#FF4D8D]">PROFILE</span>
          </h1>
        </div>

        {/* Avatar & Join Date */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-[#FF4D8D] to-violet-500 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-pink-200 uppercase">
              {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xl font-black text-gray-900 uppercase">
                {user.name || "Pretty Chi Hairs Guest"}
              </p>
              <p className="text-sm font-bold text-gray-400 mt-1">
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <Calendar size={12} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-400">
                  Member since {format(new Date(user.createdAt), "MMMM yyyy")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleUpdateProfile}>
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10 mb-8">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-50 mb-8">
              <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#FF4D8D]">
                <User size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase">
                  Profile Information
                </h3>
                <p className="text-xs font-bold text-gray-400 mt-0.5">
                  Update your personal details
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <User size={12} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-bold text-gray-900",
                    errors.name && "border-red-300 bg-red-50/50"
                  )}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="text-xs font-bold text-red-500 ml-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <Mail size={12} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-bold text-gray-900",
                    errors.email && "border-red-300 bg-red-50/50"
                  )}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-xs font-bold text-red-500 ml-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full sm:w-auto px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#FF4D8D] transition-all duration-300 shadow-lg shadow-gray-200 hover:shadow-pink-200 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isUpdating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Account Actions */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-50 mb-8">
            <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#FF4D8D]">
              <ShieldCheck size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 uppercase">
                Account Actions
              </h3>
              <p className="text-xs font-bold text-gray-400 mt-0.5">
                Manage your account
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-gray-200 transition-colors">
                  <LogOut size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-gray-900 uppercase">
                    Sign Out
                  </p>
                  <p className="text-xs font-medium text-gray-400">
                    Log out of your account
                  </p>
                </div>
              </div>
            </button>

            {/* Delete Account */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-red-100 hover:border-red-200 hover:bg-red-50/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                  <Trash2 size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-red-600 uppercase">
                    Delete Account
                  </p>
                  <p className="text-xs font-medium text-gray-400">
                    Permanently remove your account and data
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        isDeleting={isDeleting}
      />
    </div>
  );
}
