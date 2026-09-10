"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AdminLayout } from "@/components/admin/admin-layout";
import { PublishBar } from "@/components/admin/publish-bar";
import { FileUploader } from "@/components/admin/file-uploader";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Select } from "@/components/ui/input";
import { DataStore } from "@/lib/data-store";
import { GalleryItem } from "@/lib/types";
import { Plus, Trash2, Image as ImageIcon, MapPin } from "lucide-react";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
    category: "Reef" as GalleryItem["category"],
    location: "Red Sea Sanctuary",
  });

  useEffect(() => {
    setItems(DataStore.getGallery(true));
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Delete this gallery image?")) {
      const updated = DataStore.deleteGalleryItem(id);
      setItems(updated);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: formData.title || "Sanctuary Photography",
      caption: formData.caption,
      image_url: formData.image_url,
      category: formData.category,
      location: formData.location,
      status: "published",
      display_order: items.length + 1,
      last_modified_at: new Date().toISOString(),
      has_unpublished_changes: true,
      created_at: new Date().toISOString(),
    };
    const updated = DataStore.saveGalleryItem(newItem);
    setItems(updated);
    setModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-6xl">
        <PublishBar />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
              Visual Gallery CMS
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Curate high-definition photography of reefs, wrecks, and marine encounters.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Upload New Photo
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3 relative group"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                <Image src={item.image_url || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop"} alt={item.title} fill className="object-cover" />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-cyan-400 font-mono mb-1">
                  <span>{item.category}</span>
                  {item.location && (
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {item.location}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white font-display">{item.title}</h3>
                {item.caption && <p className="text-xs text-slate-400 line-clamp-1">{item.caption}</p>}
                {item.has_unpublished_changes && (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 mt-1 inline-block">
                    Draft Changes
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-white/5 flex justify-end">
                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Upload Gallery Photograph"
          maxWidth="lg"
        >
          <form onSubmit={handleAdd} className="space-y-4">
            <Input
              label="Photo Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              options={[
                { label: "Reef", value: "Reef" },
                { label: "Marine Life", value: "Marine Life" },
                { label: "Wrecks", value: "Wrecks" },
                { label: "Expeditions", value: "Expeditions" },
                { label: "Divers", value: "Divers" },
                { label: "Aerial", value: "Aerial" },
              ]}
            />

            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            {/* Cloud File Uploader */}
            <FileUploader
              label="Select Image from Device (Cloud Upload)"
              currentUrl={formData.image_url}
              onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
            />

            <Input
              label="Caption"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            />

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <Button type="button" variant="glass" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add Photo Draft
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
