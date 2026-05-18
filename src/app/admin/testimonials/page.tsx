"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Trash2, Loader2, Star, MessageSquareQuote, Plus } from "lucide-react";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add form state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials/admin");
      const data = await res.json();
      if (Array.isArray(data)) setTestimonials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleApproval = async (id: string, isApproved: boolean) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved }),
      });
      if (res.ok) {
        setTestimonials((prev) => 
          prev.map((t) => (t.id === id ? { ...t, isApproved } : t))
        );
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      alert("Failed to delete testimonial");
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail || "admin@added.com", // fallback if empty since schema requires it
          message: newMessage,
          rating: newRating
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Auto approve since it's added by admin
        await fetch(`/api/testimonials/${data.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isApproved: true }),
        });
        
        setTestimonials((prev) => [{...data, isApproved: true}, ...prev]);
        setIsAdding(false);
        setNewName("");
        setNewEmail("");
        setNewMessage("");
        setNewRating(5);
      } else {
        alert(data.error ? JSON.stringify(data.error) : "Failed to add testimonial");
      }
    } catch (err) {
      alert("Error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Testimonials</h1>
          <p className="text-gray-500 font-semibold mt-1">Approve and manage client reviews.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#FF4D8D] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#E6457E] transition shadow-sm shadow-pink-200"
        >
          <Plus size={18} strokeWidth={3} />
          Add Testimonial
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm animate-in fade-in slide-in-from-top-4 min-w-0">
          <h3 className="text-lg font-black text-gray-900 mb-4">Add New Testimonial</h3>
          <form onSubmit={handleAddTestimonial} className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
            <div className="min-w-0">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name</label>
              <input 
                required 
                value={newName} 
                onChange={e => setNewName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 rounded-xl border-2 border-transparent focus:border-pink-300 outline-none min-w-0" 
              />
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email (Optional)</label>
              <input 
                type="email"
                value={newEmail} 
                onChange={e => setNewEmail(e.target.value)}
                placeholder="client@email.com"
                className="w-full px-4 py-2 bg-gray-50 rounded-xl border-2 border-transparent focus:border-pink-300 outline-none min-w-0" 
              />
            </div>
            <div className="md:col-span-2 min-w-0">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Message</label>
              <textarea 
                required 
                rows={3}
                value={newMessage} 
                onChange={e => setNewMessage(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 rounded-xl border-2 border-transparent focus:border-pink-300 outline-none min-w-0 resize-y" 
              />
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Rating (1-5)</label>
              <input 
                type="number" 
                min="1" max="5" required 
                value={newRating} 
                onChange={e => setNewRating(Number(e.target.value))}
                className="w-full px-4 py-2 bg-gray-50 rounded-xl border-2 border-transparent focus:border-pink-300 outline-none min-w-0" 
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-5 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gray-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-black transition flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Save & Approve"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Client</th>
                <th className="px-10 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest w-1/2">Message</th>
                <th className="px-10 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-10 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-10 py-6 h-24 bg-gray-50/20"></td>
                  </tr>
                ))
              ) : testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition group">
                  <td className="px-10 py-6 whitespace-nowrap">
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.email}</p>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col gap-2">
                      {t.rating && (
                        <div className="flex items-center gap-1">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      )}
                      <p className="text-gray-600 text-sm line-clamp-2 italic">"{t.message}"</p>
                    </div>
                  </td>
                  <td className="px-10 py-6 whitespace-nowrap">
                    {t.isApproved ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-50 text-green-600 font-bold text-xs uppercase tracking-wider">
                        <CheckCircle size={14} /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-600 font-bold text-xs uppercase tracking-wider">
                        <Loader2 size={14} className="animate-spin" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-10 py-6 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {t.isApproved ? (
                        <button 
                          onClick={() => handleApproval(t.id, false)}
                          className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-amber-50 hover:text-amber-600 transition-all border border-transparent"
                          title="Reject Testimonial"
                        >
                          <XCircle size={18} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleApproval(t.id, true)}
                          className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-green-50 hover:text-green-600 transition-all border border-transparent"
                          title="Approve Testimonial"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="p-3 bg-gray-50 text-red-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all border border-transparent"
                        title="Delete Testimonial"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && testimonials.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 border border-dashed border-gray-200">
                        <MessageSquareQuote size={32} />
                      </div>
                      <p className="font-bold text-gray-500">No testimonials found.</p>
                    </div>
                  </td>
                </tr>
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
        ) : testimonials.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <p className="font-bold text-gray-500">No testimonials found.</p>
          </div>
        ) : (
          testimonials.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-900 text-base">{t.name}</p>
                  <p className="text-xs text-gray-400 truncate">{t.email}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic">"{t.message}"</p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  {t.isApproved ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 text-green-600 font-bold text-[10px] uppercase tracking-wider">
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-600 font-bold text-[10px] uppercase tracking-wider">
                      Pending
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleApproval(t.id, !t.isApproved)} 
                    className="p-2.5 bg-gray-50 text-gray-500 rounded-xl"
                  >
                    {t.isApproved ? <XCircle size={18} /> : <CheckCircle size={18} />}
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl">
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
