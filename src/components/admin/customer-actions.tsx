"use client";

import React, { useState } from "react";
import { 
  MoreHorizontal, 
  Trash2, 
  Ban, 
  Unlock, 
  Loader2,
  AlertTriangle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CustomerActionsProps {
  userId: string;
  isBanned: boolean;
  userName: string;
}

export function CustomerActions({ userId, isBanned, userName }: CustomerActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingBan, setIsTogglingBan] = useState(false);
  const [showConfirm, setShowConfirm] = useState<"delete" | "ban" | null>(null);
  const router = useRouter();

  const handleToggleBan = async () => {
    setIsTogglingBan(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBanned: !isBanned }),
      });

      if (!response.ok) throw new Error("Failed to update user status");

      toast.success(`User ${isBanned ? "unbanned" : "banned"} successfully`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsTogglingBan(false);
      setShowConfirm(null);
      setIsOpen(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      toast.success("User deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete user. They may have active orders.");
    } finally {
      setIsDeleting(false);
      setShowConfirm(null);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-900"
      >
        <MoreHorizontal size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setShowConfirm("ban")}
            className="w-full text-left px-4 py-2.5 text-sm font-bold text-amber-600 hover:bg-amber-50 flex items-center gap-2 transition-colors"
          >
            {isBanned ? <Unlock size={16} /> : <Ban size={16} />}
            {isBanned ? "Unban User" : "Ban User"}
          </button>
          <button
            onClick={() => setShowConfirm("delete")}
            className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
          >
            <Trash2 size={16} />
            Delete User
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-gray-100">
            <div className="p-8 text-center">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border",
                showConfirm === "delete" ? "bg-red-50 text-red-600 border-red-100" : "bg-amber-50 text-amber-600 border-amber-100"
              )}>
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
                {showConfirm === "delete" ? "Delete User?" : isBanned ? "Unban User?" : "Ban User?"}
              </h3>
              <p className="text-gray-500 font-bold leading-relaxed mb-8">
                {showConfirm === "delete" 
                  ? `Are you sure you want to delete ${userName}? This action is permanent and will remove all their account data.`
                  : `Are you sure you want to ${isBanned ? "unban" : "ban"} ${userName}? ${isBanned ? "They will be able to log in again." : "They will be immediately logged out and blocked from logging in."}`}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowConfirm(null)}
                  className="px-6 py-3.5 rounded-xl bg-gray-50 text-gray-600 font-bold hover:bg-gray-100 transition-all border border-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={showConfirm === "delete" ? handleDelete : handleToggleBan}
                  disabled={isDeleting || isTogglingBan}
                  className={cn(
                    "px-6 py-3.5 rounded-xl text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2",
                    showConfirm === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"
                  )}
                >
                  {(isDeleting || isTogglingBan) ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    showConfirm === "delete" ? "Delete" : isBanned ? "Unban" : "Ban"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
