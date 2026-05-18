"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Tag, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will affect products in this category.")) return;
    
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id));
      }
    } catch (err) {
      alert("Failed to delete category");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Categories</h1>
          <p className="text-gray-500 font-semibold mt-1">Manage your product organization and taxonomy.</p>
        </div>
        <Link 
          href="/admin/categories/new" 
          className="bg-[#FF4D8D] text-white px-6 py-3.5 rounded-2xl hover:bg-[#E6457E] transition shadow-lg shadow-pink-100 font-bold flex items-center justify-center gap-2"
        >
          <Plus size={20} strokeWidth={3} />
          Add Category
        </Link>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center bg-white px-4 py-2 rounded-xl border border-gray-200 w-80 shadow-sm">
            <Search size={16} className="text-gray-400" />
            <input type="text" placeholder="Filter categories..." className="bg-transparent border-none focus:ring-0 text-sm font-medium ml-2 w-full" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-500 font-bold text-sm hover:text-gray-900 transition shadow-sm">
            <Filter size={16} />
            Sort by: Newest
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-10 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Slug</th>
                <th className="px-10 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Products</th>
                <th className="px-10 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-10 py-6 h-20 bg-gray-50/20"></td>
                  </tr>
                ))
              ) : categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-10 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
                        {category.imageUrl ? (
                          <img src={category.imageUrl} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <Tag className="text-gray-300" size={24} />
                        )}
                      </div>
                      <span className="font-bold text-gray-900 text-lg">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-400 font-mono bg-gray-100 px-3 py-1 rounded-lg">/{category.slug}</span>
                  </td>
                  <td className="px-10 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-gray-900">0</span>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Items</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/categories/${category.id}`} className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-white hover:text-gray-900 hover:shadow-md transition-all border border-transparent hover:border-gray-100 block">
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        className="p-3 bg-gray-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-100 transition-all border border-transparent"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 border border-dashed border-gray-200">
                        <Tag size={32} />
                      </div>
                      <p className="font-bold text-gray-500">No categories found yet.</p>
                      <Link href="/admin/categories/new" className="text-[#FF4D8D] font-black text-sm hover:underline underline-offset-4">Create your first category</Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {loading ? (
          [1, 2].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 h-32 animate-pulse border border-gray-100" />
          ))
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <p className="font-bold text-gray-500">No categories found yet.</p>
          </div>
        ) : (
          categories.map(cat => (
            <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <Tag className="text-gray-300" size={24} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-900 text-lg truncate">{cat.name}</p>
                  <p className="text-xs font-semibold text-gray-400 font-mono">/{cat.slug}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-gray-900">0</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/categories/${cat.id}`} className="p-2.5 bg-gray-50 text-gray-500 rounded-xl">
                    <Edit size={18} />
                  </Link>
                  <button onClick={() => handleDelete(cat.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
