"use client";

import React, { useEffect, useState } from "react";
import { Plus, Loader2, CheckCircle, XCircle, Trash2, Edit2, CheckCircle2 } from "lucide-react";

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    isActive: true,
  });

  const fetchFaqs = async () => {
    try {
      const res = await fetch("/api/faqs/admin");
      const data = await res.json();
      if (Array.isArray(data)) setFaqs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const seedFaqs = async () => {
    try {
      await fetch("/api/faqs/seed", { method: "POST" });
      fetchFaqs();
    } catch (err) {
      console.error("Seed failed", err);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenModal = (faq?: any) => {
    if (faq) {
      setEditingId(faq.id);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        isActive: faq.isActive,
      });
    } else {
      setEditingId(null);
      setFormData({ question: "", answer: "", category: "", isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ question: "", answer: "", category: "", isActive: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = editingId ? `/api/faqs/${editingId}` : "/api/faqs";
      const method = editingId ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchFaqs();
        handleCloseModal();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save FAQ");
      }
    } catch (err) {
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setFaqs((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (err) {
      alert("Failed to delete FAQ");
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/faqs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        setFaqs((prev) => prev.map((f) => f.id === id ? { ...f, isActive: !currentStatus } : f));
      }
    } catch (err) {
      alert("Failed to toggle status");
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">FAQs</h1>
          <p className="text-gray-500 font-semibold mt-1">Manage frequently asked questions and categories.</p>
        </div>
        <div className="flex gap-3">
          {faqs.length === 0 && !loading && (
            <button 
              onClick={seedFaqs}
              className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition shadow-sm"
            >
              Seed Default FAQs
            </button>
          )}
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#FF4D8D] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#E6457E] transition shadow-sm shadow-pink-200"
          >
            <Plus size={18} strokeWidth={3} />
            Add FAQ
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest w-[40%]">Question</th>
                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-8 py-6 h-20 bg-gray-50/20"></td>
                  </tr>
                ))
              ) : faqs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="font-bold text-gray-500">No FAQs found.</p>
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-gray-50/50 transition group">
                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-900 text-sm line-clamp-1">{faq.question}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-1">{faq.answer}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                        {faq.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <button 
                        onClick={() => toggleStatus(faq.id, faq.isActive)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors ${
                          faq.isActive ? "bg-green-50 text-green-600 hover:bg-red-50 hover:text-red-600" : "bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600"
                        }`}
                      >
                        {faq.isActive ? <><CheckCircle2 size={14} /> Active</> : <><XCircle size={14} /> Hidden</>}
                      </button>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(faq)}
                          className="p-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-pink-50 hover:text-[#FF4D8D] transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(faq.id)}
                          className="p-2 bg-gray-50 text-red-400 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {loading ? (
          [1, 2].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 h-32 animate-pulse border border-gray-100" />
          ))
        ) : faqs.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <p className="font-bold text-gray-500">No FAQs found.</p>
          </div>
        ) : (
          faqs.map(faq => (
            <div key={faq.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-900 text-sm">{faq.question}</p>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{faq.answer}</p>
                </div>
                <span className="flex-shrink-0 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
                  {faq.category}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <button 
                  onClick={() => toggleStatus(faq.id, faq.isActive)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-colors ${
                    faq.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {faq.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {faq.isActive ? "Active" : "Hidden"}
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenModal(faq)} className="p-2.5 bg-gray-50 text-gray-500 rounded-xl">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(faq.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">
                {editingId ? "Edit FAQ" : "Add New FAQ"}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-900 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 min-w-0">
              <div className="min-w-0">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Category</label>
                <input 
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="e.g. Orders, Delivery, Products"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#FF4D8D] outline-none font-medium text-gray-900 min-w-0"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Question</label>
                <input 
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#FF4D8D] outline-none font-bold text-gray-900 min-w-0"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Answer</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#FF4D8D] outline-none font-medium text-gray-900 resize-y min-w-0"
                />
              </div>

              <div className="flex items-center gap-3 py-2 min-w-0">
                <input 
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-[#FF4D8D] focus:ring-[#FF4D8D] shrink-0"
                />
                <label htmlFor="isActive" className="font-bold text-gray-900 cursor-pointer truncate">
                  Visible to public
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#FF4D8D] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#E6457E] transition disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Save FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
