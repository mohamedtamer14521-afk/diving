"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AdminLayout } from "@/components/admin/admin-layout";
import { PublishBar } from "@/components/admin/publish-bar";
import { FileUploader } from "@/components/admin/file-uploader";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { DataStore } from "@/lib/data-store";
import { MediaAsset } from "@/lib/types";
import { Plus, Trash2, Copy, Check, FolderOpen } from "lucide-react";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1400&auto=format&fit=crop",
    alt_text: "",
    caption: "",
  });

  useEffect(() => {
    setMedia(DataStore.getMedia());
  }, []);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove this media asset?")) {
      const updated = DataStore.deleteMedia(id);
      setMedia(updated);
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    DataStore.addMedia({
      name: formData.name || `asset-${Date.now()}.jpg`,
      url: formData.url,
      file_size: 1500000,
      file_type: "image/jpeg",
      alt_text: formData.alt_text,
      caption: formData.caption,
    });
    setMedia(DataStore.getMedia());
    setModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-6xl">
        <PublishBar />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
              Cloud Media Asset Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Store, stream, and manage assets directly in Supabase Storage with instant CDN URLs.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Upload File from Device
          </Button>
        </div>

        {/* Quick Drag & Drop Banner */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
          <FileUploader
            label="Direct Cloud Storage Dropzone"
            hint="Upload high-res images directly to Supabase Storage bucket 'media'"
            aspectRatio="banner"
            onUploadComplete={(url, mediaAsset) => {
              setMedia(DataStore.getMedia());
            }}
          />
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {media.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3"
            >
              <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-white/10">
                <Image src={item.url} alt={item.alt_text || item.name} fill className="object-cover" />
              </div>

              <div>
                <h3 className="text-xs font-mono font-bold text-white truncate">{item.name}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{item.caption || item.url}</p>
                {item.storage_path && (
                  <span className="text-[10px] text-cyan-400 font-mono block mt-1">
                    Bucket: {item.bucket_name || "media"}
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopyUrl(item.url, item.id)}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy CDN URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-slate-400 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Upload Asset to Cloud"
          maxWidth="md"
        >
          <div className="space-y-4">
            <FileUploader
              onUploadComplete={(url, mediaAsset) => {
                setMedia(DataStore.getMedia());
                setModalOpen(false);
              }}
            />

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-[11px] text-slate-500 uppercase">Or Link Remote URL</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-4">
              <Input
                label="Asset Name"
                placeholder="e.g. reef-photo.jpg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Image URL"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
              <Input
                label="Alt Text"
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
              />

              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="glass" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save URL Asset
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
