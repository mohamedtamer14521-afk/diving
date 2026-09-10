"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Check, Image as ImageIcon, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataStore } from "@/lib/data-store";
import { MediaAsset } from "@/lib/types";

interface FileUploaderProps {
  currentUrl?: string;
  onUploadComplete: (url: string, mediaAsset?: MediaAsset) => void;
  label?: string;
  hint?: string;
  aspectRatio?: "video" | "square" | "banner";
}

export function FileUploader({
  currentUrl,
  onUploadComplete,
  label = "Upload Image / Media Asset",
  hint = "Supports JPG, PNG, WEBP, AVIF up to 25MB (Direct Cloud Storage Upload)",
  aspectRatio = "video",
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>(currentUrl || "");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelected = async (file: File) => {
    if (!file) return;

    // Validate size (25MB)
    if (file.size > 26214400) {
      setErrorMsg("File size exceeds 25MB maximum limit.");
      return;
    }

    setErrorMsg(null);
    setIsUploading(true);
    setUploadProgress(20);

    // Instant local object preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      setUploadProgress(50);
      const media = await DataStore.uploadFile(file, altText, caption);
      setUploadProgress(100);
      setPreviewUrl(media.url);
      onUploadComplete(media.url, media);
    } catch (err: any) {
      console.error("Upload failure:", err);
      setErrorMsg(err.message || "Failed to upload to cloud storage.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const ratioClasses = {
    video: "h-48 sm:h-56",
    square: "h-44 w-44",
    banner: "h-36 sm:h-44",
  };

  return (
    <div className="space-y-2 w-full">
      {label && <label className="block text-xs font-semibold text-slate-300 tracking-wide">{label}</label>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml,video/mp4"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelected(e.target.files[0]);
          }
        }}
      />

      {/* Main Upload Drop Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative w-full ${ratioClasses[aspectRatio]} rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-4 cursor-pointer overflow-hidden group ${
          isDragging
            ? "border-cyan-400 bg-cyan-500/10"
            : previewUrl
            ? "border-white/15 bg-slate-950/60 hover:border-cyan-400/50"
            : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20"
        }`}
      >
        {previewUrl ? (
          <>
            <Image src={previewUrl} alt={altText || "Uploaded preview"} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 text-center z-10 backdrop-blur-sm">
              <Upload className="w-6 h-6 text-cyan-400 animate-bounce" />
              <span className="text-xs font-bold text-white">Click or Drag to Replace File</span>
              <span className="text-[11px] text-slate-300">Uploads directly to Cloud Storage</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center space-y-2 select-none">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Select File from Device</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">{hint}</span>
            </div>
          </div>
        )}

        {/* Uploading Progress Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-20 p-6">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <span className="text-xs font-bold text-white font-mono">
              Uploading to Supabase Storage ({uploadProgress}%)...
            </span>
            <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-cyan-400 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {errorMsg && <p className="text-xs text-rose-400 mt-1">{errorMsg}</p>}
    </div>
  );
}
