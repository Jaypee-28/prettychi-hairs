"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Video, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  label?: string;
  className?: string;
}

export function VideoUpload({
  value,
  onChange,
  onRemove,
  label = "Upload Video",
  className,
}: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onChange(data.url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload video. Try pasting a URL instead.");
    } finally {
      setIsUploading(false);
      // Reset the file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleManualSubmit = () => {
    const trimmed = manualUrl.trim();
    if (trimmed) {
      onChange(trimmed);
      setManualUrl("");
      setShowManualInput(false);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="relative group">
        {value ? (
          <div className="relative rounded-3xl overflow-hidden border-2 border-gray-100 shadow-sm bg-black">
            <video
              src={value}
              controls
              muted
              className="w-full max-h-[280px] object-cover"
            />
            {/* Remove button */}
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg z-10"
            >
              <X size={18} strokeWidth={3} />
            </button>
            {/* Open in new tab */}
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="absolute top-4 right-16 p-2 bg-white/90 backdrop-blur-sm rounded-xl text-gray-600 hover:bg-gray-800 hover:text-white transition-all shadow-lg z-10"
              title="Open video in new tab"
            >
              <ExternalLink size={18} strokeWidth={2.5} />
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "aspect-video rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF4D8D] hover:bg-pink-50/30 transition-all relative overflow-hidden",
                isUploading && "pointer-events-none opacity-70"
              )}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={32} className="text-[#FF4D8D] animate-spin" />
                  <p className="text-sm font-bold text-[#FF4D8D]">
                    Uploading video...
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-[#FF4D8D] group-hover:scale-110 transition-all shadow-sm mb-4">
                    <Video size={28} strokeWidth={2} />
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    Click to upload video
                  </p>
                  <p className="text-xs font-semibold text-gray-400 mt-1">
                    MP4, WebM, MOV (max. 100MB)
                  </p>
                </>
              )}
              {/* Ambient glow */}
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#FF4D8D]/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </div>

            {/* Paste URL toggle */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-100" />
              <button
                type="button"
                onClick={() => setShowManualInput((v) => !v)}
                className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#FF4D8D] transition-colors"
              >
                {showManualInput ? "Hide" : "Or paste a URL"}
              </button>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {showManualInput && (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                  placeholder="https://example.com/hero.mp4"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D8D] focus:border-transparent transition-all placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={handleManualSubmit}
                  className="px-5 py-3 bg-[#FF4D8D] text-white rounded-xl font-bold text-sm hover:bg-[#E6457E] transition-all"
                >
                  Set
                </button>
              </div>
            )}
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          accept="video/*"
        />
      </div>
    </div>
  );
}
