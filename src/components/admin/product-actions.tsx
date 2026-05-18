"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Loader2 } from "lucide-react";

interface ProductActionsProps {
  productId: string;
}

export function ProductActions({ productId }: ProductActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const err = await res.json();
        alert("Failed to delete: " + (err.error || "Unknown error"));
      }
    } catch (error) {
      alert("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link 
        href={`/admin/products/${productId}`}
        className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-white hover:text-gray-900 hover:shadow-md transition-all border border-transparent hover:border-gray-100"
      >
        <Edit size={18} />
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-3 bg-gray-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-100 transition-all border border-transparent disabled:opacity-50"
      >
        {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
      </button>
    </div>
  );
}
