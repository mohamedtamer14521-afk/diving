"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AdminLayout } from "@/components/admin/admin-layout";
import { PublishBar } from "@/components/admin/publish-bar";
import { FileUploader } from "@/components/admin/file-uploader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea, Select } from "@/components/ui/input";
import { DataStore } from "@/lib/data-store";
import { Activity } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Plus, Edit2, Trash2, Sparkles, CheckCircle2 } from "lucide-react";

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Activity | null>(null);

  const [formData, setFormData] = useState<Partial<Activity>>({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    featured_image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
    duration: "2 Hours",
    depth_max: "18m",
    experience_level: "All Levels",
    price: 90,
    price_note: "Includes gear set",
    status: "published",
    is_featured: true,
  });

  useEffect(() => {
    setActivities(DataStore.getActivities(true));
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      slug: "",
      short_description: "",
      description: "",
      featured_image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
      duration: "2 Hours",
      depth_max: "18m",
      experience_level: "All Levels",
      price: 90,
      price_note: "Includes gear set",
      status: "published",
      is_featured: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (act: Activity) => {
    setEditingItem(act);
    setFormData(act);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      const updated = DataStore.deleteActivity(id);
      setActivities(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemToSave: Activity = {
      id: editingItem ? editingItem.id : `act-${Date.now()}`,
      title: formData.title || "Untitled Activity",
      slug: formData.slug || formData.title?.toLowerCase().replace(/\s+/g, "-") || `act-${Date.now()}`,
      short_description: formData.short_description || "",
      description: formData.description || "",
      featured_image: formData.featured_image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
      gallery_images: [],
      duration: formData.duration || "2 Hours",
      depth_max: formData.depth_max,
      experience_level: (formData.experience_level as any) || "All Levels",
      price: Number(formData.price) || null,
      price_note: formData.price_note,
      included_items: ["Dedicated PADI Master Guide", "Complete Gear Set", "12L Tank"],
      requirements: ["Valid certification or medical form"],
      is_featured: Boolean(formData.is_featured),
      status: (formData.status as any) || "published",
      display_order: editingItem ? editingItem.display_order : activities.length + 1,
    };

    const updated = DataStore.saveActivity(itemToSave);
    setActivities(updated);
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
              Activities & Diving Experiences CMS
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage dive profiles, depths, pricing, cloud photography, and publication status.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Activity
          </Button>
        </div>

        {/* Table / Cards List */}
        <div className="space-y-4">
          {activities.map((act) => (
            <div
              key={act.id}
              className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                  <Image src={act.featured_image || act.image_url || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop"} alt={act.title} fill className="object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white font-display">{act.title}</h3>
                    <Badge variant={act.status === "published" ? "success" : "subtle"}>
                      {act.status}
                    </Badge>
                    {act.has_unpublished_changes && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        Draft Changes
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{act.short_description}</p>
                  <div className="flex items-center gap-3 text-xs text-cyan-300 font-mono">
                    <span>{act.experience_level}</span>
                    <span>•</span>
                    <span>{act.duration}</span>
                    <span>•</span>
                    <span>{formatCurrency(act.price)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <Button variant="glass" size="sm" onClick={() => handleOpenEdit(act)}>
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(act.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit/Create Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingItem ? "Edit Activity" : "Create New Dive Activity"}
          maxWidth="2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Activity Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Experience Level"
                value={formData.experience_level}
                onChange={(e) => setFormData({ ...formData, experience_level: e.target.value as any })}
                options={[
                  { label: "All Levels", value: "All Levels" },
                  { label: "Beginner", value: "Beginner" },
                  { label: "Intermediate", value: "Intermediate" },
                  { label: "Advanced", value: "Advanced" },
                ]}
              />
              <Input
                label="Duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Price (EUR)"
                type="number"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
              <Input
                label="Max Depth"
                placeholder="e.g. 18m / 60ft"
                value={formData.depth_max || ""}
                onChange={(e) => setFormData({ ...formData, depth_max: e.target.value })}
              />
            </div>

            {/* Real Cloud Storage File Uploader */}
            <FileUploader
              label="Activity Featured Image"
              currentUrl={formData.featured_image}
              onUploadComplete={(url) => setFormData({ ...formData, featured_image: url })}
            />

            <Textarea
              label="Short Summary"
              rows={2}
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            />

            <Textarea
              label="Full Description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Select
              label="Publication Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              options={[
                { label: "Published (Visible publicly)", value: "published" },
                { label: "Draft (Hidden from public)", value: "draft" },
                { label: "Archived", value: "archived" },
              ]}
            />

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <Button type="button" variant="glass" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Activity Draft
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
