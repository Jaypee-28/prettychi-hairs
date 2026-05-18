"use client";

import React, { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  label?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  label = "Upload Image",
  className
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
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
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{label}</label>}
      
      <div className="relative group">
        {value ? (
          <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-gray-100 shadow-sm transition-all group-hover:shadow-md">
            <img 
              src={value} 
              alt="Uploaded" 
              className="w-full h-full object-cover"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                onRemove();
              }}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
            >
              <X size={18} strokeWidth={3} />
            </button>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none"></div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "aspect-video rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF4D8D] hover:bg-pink-50/30 transition-all group relative overflow-hidden",
              isUploading && "pointer-events-none opacity-70"
            )}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={32} className="text-[#FF4D8D] animate-spin" />
                <p className="text-sm font-bold text-[#FF4D8D]">Uploading your file...</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-[#FF4D8D] group-hover:scale-110 transition-all shadow-sm mb-4">
                  <Upload size={28} strokeWidth={2.5} />
                </div>
                <p className="text-sm font-bold text-gray-900">Click or drag to upload</p>
                <p className="text-xs font-semibold text-gray-400 mt-1">SVG, PNG, JPG (max. 10MB)</p>
              </>
            )}
            
            {/* Ambient effects */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#FF4D8D]/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden" 
          accept="image/*"
        />
      </div>
    </div>
  );
}
