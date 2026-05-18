"use client";

import React, { useEffect, useState } from "react";
import { Send, Trash2, Mail, Users, Loader2 } from "lucide-react";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch("/api/newsletter");
      const data = await res.json();
      if (Array.isArray(data)) setSubscribers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    try {
      const res = await fetch(`/api/newsletter/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      alert("Failed to delete subscriber");
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return alert("Please fill out both subject and message.");
    if (subscribers.length === 0) return alert("No subscribers to email.");
    if (!confirm(`Are you sure you want to email all ${subscribers.length} subscribers?`)) return;
    
    setSending(true);
    try {
      const res = await fetch("/api/newsletter/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      
      const data = await res.json();
      if (res.ok) {
        alert(`Email sent to ${data.successCount} subscribers 🎉 (${data.failCount} failed)`);
        setSubject("");
        setMessage("");
      } else {
        alert(data.error || "Failed to send broadcast");
      }
    } catch (err) {
      alert("An error occurred while sending the broadcast.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Newsletter & Marketing</h1>
          <p className="text-gray-500 font-semibold mt-1">Manage subscribers and broadcast emails.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Broadcast Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleBroadcast} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
              <Mail className="text-[#FF4D8D]" size={24} />
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Email Broadcast</h2>
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. 💖 New Arrivals are here!"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your email content here... (HTML or plain text)"
                rows={10}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FF4D8D] outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300 resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={sending || subscribers.length === 0}
              className="w-full bg-[#FF4D8D] text-white p-5 rounded-2xl hover:bg-[#E6457E] transition shadow-lg shadow-pink-100 font-black text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {sending ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Send to {subscribers.length} Subscribers
                </>
              )}
            </button>
          </form>
        </div>

        {/* Subscribers List */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
            <div className="flex items-center gap-3">
              <Users className="text-[#FF4D8D]" size={20} />
              <h2 className="text-xl font-black text-gray-900">Subscribers</h2>
            </div>
            <span className="bg-pink-100 text-[#FF4D8D] px-3 py-1 rounded-full font-black text-sm">
              {subscribers.length} Total
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 min-w-0">
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#FF4D8D]" /></div>
            ) : subscribers.length === 0 ? (
              <div className="text-center py-10 text-gray-400 font-medium">No subscribers yet.</div>
            ) : (
              <ul className="space-y-3 min-w-0">
                {subscribers.map((sub) => (
                  <li key={sub.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-sm transition-all min-w-0">
                    <div className="min-w-0 flex-1 mr-4">
                      <p className="font-bold text-gray-900 text-sm truncate">{sub.email}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(sub.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(sub.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
