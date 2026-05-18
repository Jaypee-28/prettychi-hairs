"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Sparkles } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, imageUrl }),
      });

      if (res.ok) {
        router.push("/admin/categories");
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create category");
      }
    } catch (err) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <button 
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-all mb-8 font-bold text-sm"
      >
        <div className="p-2 bg-white rounded-xl border border-gray-100 group-hover:bg-gray-50 transition-colors shadow-sm">
          <ArrowLeft size={16} strokeWidth={3} />
        </div>
        Back to Categories
      </button>

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            New Category
            <Sparkles className="text-amber-400" size={24} />
          </h1>
          <p className="text-gray-500 font-semibold mt-2 text-lg">Define a new category to organize your premium hair products.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <div className="space-y-4">
              <label htmlFor="name" className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                Category Name
                <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                required
                type="text"
                placeholder="e.g. Luxury Lace Frontals"
                className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-bold text-lg text-gray-900 placeholder:text-gray-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="p-6 bg-pink-50 rounded-2xl border border-pink-100">
              <p className="text-sm font-semibold text-[#FF4D8D]">
                <span className="font-black underline mr-2">Tip:</span> 
                Categories help customers browse your store more effectively. 
                Keep names descriptive and SEO-friendly.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <ImageUpload 
              label="Thumbnail"
              value={imageUrl}
              onChange={setImageUrl}
              onRemove={() => setImageUrl("")}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name}
            className="w-full bg-[#FF4D8D] text-white p-6 rounded-[2rem] hover:bg-[#E6457E] transition shadow-xl shadow-pink-100 font-black text-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} strokeWidth={3} />
            ) : (
              <>
                <Save size={24} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                Create Category
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
