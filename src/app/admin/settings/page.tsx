"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Settings,
  Loader2,
  Save,
  Store,
  Mail,
  Truck,
  Video,
  Type,
  Plus,
  X,
  GripVertical,
  Sparkles,
  Coins,
} from "lucide-react";
import { VideoUpload } from "@/components/ui/video-upload";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SettingsData {
  id: string;
  storeName: string | null;
  supportEmail: string | null;
  ukDeliveryFee: number;
  intlDeliveryFee: number;
  // Hero
  heroVideoUrl: string | null;
  heroTopLabel: string | null;
  heroTitle: string | null;
  heroWords: string[] | null;
  heroSubtitle: string | null;
  heroPrimaryCTA: string | null;
  heroSecondaryCTA: string | null;
  currency: string;
}

// ── Shared input style ────────────────────────────────────────────────────────

const INPUT =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D8D] focus:border-transparent transition-all placeholder:text-gray-300";

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Store / Delivery
  const [storeName, setStoreName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [ukDeliveryFee, setUkDeliveryFee] = useState("");
  const [intlDeliveryFee, setIntlDeliveryFee] = useState("");

  // Hero
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [heroTopLabel, setHeroTopLabel] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroWords, setHeroWords] = useState<string[]>([]);
  const [heroWordInput, setHeroWordInput] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroPrimaryCTA, setHeroPrimaryCTA] = useState("");
  const [heroSecondaryCTA, setHeroSecondaryCTA] = useState("");
  const [currency, setCurrency] = useState("GBP");

  useEffect(() => {
    fetchSettings();
  }, []);

  // ── Fetch ───────────────────────────────────────────────────────────────────

  async function fetchSettings() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data: SettingsData = await res.json();
      setSettings(data);

      // Store / Delivery
      setStoreName(data.storeName || "");
      setSupportEmail(data.supportEmail || "");
      setUkDeliveryFee(Number(data.ukDeliveryFee).toString());
      setIntlDeliveryFee(Number(data.intlDeliveryFee).toString());

      // Hero
      setHeroVideoUrl(data.heroVideoUrl || "");
      setHeroTopLabel(data.heroTopLabel || "");
      setHeroTitle(data.heroTitle || "");
      setHeroSubtitle(data.heroSubtitle || "");
      setHeroPrimaryCTA(data.heroPrimaryCTA || "");
      setHeroSecondaryCTA(data.heroSecondaryCTA || "");
      setCurrency(data.currency || "GBP");

      if (Array.isArray(data.heroWords) && data.heroWords.length > 0) {
        setHeroWords(data.heroWords as string[]);
      }
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Hero words helpers ──────────────────────────────────────────────────────

  function addHeroWord() {
    const word = heroWordInput.trim();
    if (!word || heroWords.includes(word)) return;
    setHeroWords([...heroWords, word]);
    setHeroWordInput("");
  }

  function removeHeroWord(index: number) {
    setHeroWords(heroWords.filter((_, i) => i !== index));
  }

  function moveHeroWord(from: number, to: number) {
    if (to < 0 || to >= heroWords.length) return;
    const next = [...heroWords];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setHeroWords(next);
  }

  // ── Save ────────────────────────────────────────────────────────────────────

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Store
          storeName: storeName || undefined,
          supportEmail: supportEmail || undefined,
          ukDeliveryFee: parseFloat(ukDeliveryFee),
          intlDeliveryFee: parseFloat(intlDeliveryFee),
          // Hero
          heroVideoUrl: heroVideoUrl || undefined,
          heroTopLabel: heroTopLabel || undefined,
          heroTitle: heroTitle || undefined,
          heroWords: heroWords.length > 0 ? heroWords : undefined,
          heroSubtitle: heroSubtitle || undefined,
          heroPrimaryCTA: heroPrimaryCTA || undefined,
          heroSecondaryCTA: heroSecondaryCTA || undefined,
          currency: currency || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update settings");
      }

      const updated: SettingsData = await res.json();
      setSettings(updated);
      toast.success("Settings saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  }

  // ── Loading state ───────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 size={24} className="animate-spin" />
          <p className="font-bold">Loading settings...</p>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 max-w-[800px]">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Settings
        </h1>
        <p className="text-gray-500 font-semibold mt-1">
          Configure store information, delivery fees, and the homepage hero.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── Store Information ─────────────────────────────────────────── */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-pink-50 rounded-xl flex items-center justify-center text-[#FF4D8D] border border-pink-100 shadow-sm">
                <Store size={18} strokeWidth={2.5} />
              </div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">
                Store Information
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-5 min-w-0">
            <div className="min-w-0">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Pretty Chi Hairs"
                className={`${INPUT} min-w-0`}
              />
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                <div className="flex items-center gap-1.5">
                  <Mail size={12} strokeWidth={2.5} />
                  Support Email
                </div>
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="hello@prettychihairs.com"
                className={`${INPUT} min-w-0`}
              />
            </div>
          </div>
        </div>

        {/* ── Delivery Fees ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                <Truck size={18} strokeWidth={2.5} />
              </div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">
                Delivery Fees
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Nationwide Delivery Fee (₦)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                  ₦
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={ukDeliveryFee}
                  onChange={(e) => setUkDeliveryFee(e.target.value)}
                  placeholder="2000"
                  className={`${INPUT} pl-8`}
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5 font-medium">
                Applied for standard nationwide deliveries.
              </p>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Special / Regional Delivery Fee (₦)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                  ₦
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={intlDeliveryFee}
                  onChange={(e) => setIntlDeliveryFee(e.target.value)}
                  placeholder="4000"
                  className={`${INPUT} pl-8`}
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5 font-medium">
                Applied for express, rural, or custom regional deliveries.
              </p>
            </div>
        </div>
      </div>

      {/* ── Currency & Localization ─────────────────────────────────── */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100 shadow-sm">
              <Coins size={18} strokeWidth={2.5} />
            </div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">
              Currency & Localization
            </h2>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Store Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={INPUT}
            >
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="NGN">NGN (₦) - Nigerian Naira</option>
              <option value="CAD">CAD ($) - Canadian Dollar</option>
              <option value="XAF">XAF (FCFA) - Central African CFA Franc</option>
            </select>
            <p className="text-xs text-gray-400 mt-1.5 font-medium">
              This will update the currency symbol displayed across the entire store.
            </p>
          </div>
        </div>
      </div>

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600 border border-violet-100 shadow-sm">
                <Sparkles size={18} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 tracking-tight">
                  Hero Section
                </h2>
                <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
                  Controls the full-screen hero on the homepage.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* ── Video ──────────────────────────────────────────────────── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-violet-50 rounded-lg flex items-center justify-center text-violet-600">
                  <Video size={14} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Background Video
                </span>
              </div>
              <VideoUpload
                value={heroVideoUrl}
                onChange={(url) => setHeroVideoUrl(url)}
                onRemove={() => setHeroVideoUrl("")}
                label=""
              />
              <p className="text-xs text-gray-400 mt-2 font-medium">
                Plays silently, muted, and looped behind the hero content. If
                none is set, a dark gradient is shown instead.
              </p>
            </div>

            <div className="h-px bg-gray-50" />

            {/* ── Text Content ───────────────────────────────────────────── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-violet-50 rounded-lg flex items-center justify-center text-violet-600">
                  <Type size={14} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Text Content
                </span>
              </div>

              <div className="space-y-4">
                {/* Top label */}
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                    Top Label
                  </label>
                  <input
                    type="text"
                    value={heroTopLabel}
                    onChange={(e) => setHeroTopLabel(e.target.value)}
                    placeholder="LUXURY BEAUTY EXPERIENCE"
                    className={INPUT}
                  />
                  <p className="text-[11px] text-gray-400 mt-1 font-medium">
                    Small uppercase tag shown above the main title.
                  </p>
                </div>

                {/* Main Title */}
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    placeholder="Welcome to Pretty Chi Hairs"
                    className={INPUT}
                  />
                </div>

                {/* Subtitle */}
                <div className="min-w-0">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                    Subtitle
                  </label>
                  <textarea
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    placeholder="Discover the pinnacle of luxury hair and beauty..."
                    rows={2}
                    className={`${INPUT} resize-none min-w-0`}
                  />
                </div>

                {/* CTA buttons */}
                <div className="grid grid-cols-2 gap-4 min-w-0">
                  <div className="min-w-0">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                      Primary CTA
                    </label>
                    <input
                      type="text"
                      value={heroPrimaryCTA}
                      onChange={(e) => setHeroPrimaryCTA(e.target.value)}
                      placeholder="Shop Now"
                      className={`${INPUT} min-w-0`}
                    />
                  </div>
                  <div className="min-w-0">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                      Secondary CTA
                    </label>
                    <input
                      type="text"
                      value={heroSecondaryCTA}
                      onChange={(e) => setHeroSecondaryCTA(e.target.value)}
                      placeholder="Book Appointment"
                      className={`${INPUT} min-w-0`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-50" />

            {/* ── Typewriter Words ────────────────────────────────────────── */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-violet-50 rounded-lg flex items-center justify-center text-violet-600">
                  <Settings size={14} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Typewriter Words
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mb-4 font-medium">
                Words that cycle through the animated typewriter line. Use the
                arrows to reorder them.
              </p>

              {/* Add word input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={heroWordInput}
                  onChange={(e) => setHeroWordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addHeroWord();
                    }
                  }}
                  placeholder="e.g. Premium Hair"
                  className={INPUT}
                />
                <button
                  type="button"
                  onClick={addHeroWord}
                  disabled={!heroWordInput.trim()}
                  className="flex items-center gap-1.5 px-5 py-3 bg-[#FF4D8D] text-white rounded-xl font-bold text-sm hover:bg-[#E6457E] transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <Plus size={16} strokeWidth={3} />
                  Add
                </button>
              </div>

              {/* Word tags list */}
              {heroWords.length > 0 ? (
                <div className="space-y-2">
                  {heroWords.map((word, i) => (
                    <div
                      key={`${word}-${i}`}
                      className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-violet-100 hover:bg-violet-50/30 transition-all"
                    >
                      {/* Order indicator */}
                      <span className="text-[10px] font-black text-gray-300 w-5 text-center">
                        {i + 1}
                      </span>

                      <GripVertical
                        size={14}
                        className="text-gray-300 flex-shrink-0"
                      />

                      <span className="flex-1 text-sm font-bold text-gray-800">
                        {word}
                      </span>

                      {/* Move up / down */}
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveHeroWord(i, i - 1)}
                          disabled={i === 0}
                          className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-all disabled:opacity-20 disabled:cursor-not-allowed text-xs font-black"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveHeroWord(i, i + 1)}
                          disabled={i === heroWords.length - 1}
                          className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-all disabled:opacity-20 disabled:cursor-not-allowed text-xs font-black"
                          title="Move down"
                        >
                          ↓
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeHeroWord(i)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Remove word"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-100 rounded-2xl text-center">
                  <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-3">
                    <Type size={20} />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    No typewriter words yet
                  </p>
                  <p className="text-[11px] text-gray-300 mt-1">
                    Add words above — defaults will be used until you save.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Save Button ───────────────────────────────────────────────── */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#FF4D8D] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-[#E6457E] transition-all shadow-lg shadow-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} strokeWidth={2.5} />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
