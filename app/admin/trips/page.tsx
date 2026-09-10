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
import { Trip } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Plus, Edit2, Trash2, Ship } from "lucide-react";

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const [formData, setFormData] = useState<Partial<Trip>>({
    title: "",
    destination: "Ras Mohammed",
    boat_name: "Aura Oceanics Yacht I",
    duration: "Full Day",
    departure_time: "08:00 AM",
    price: 160,
    dives_included: 2,
    description: "",
    featured_image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
    status: "published",
    is_featured: true,
  });

  useEffect(() => {
    setTrips(DataStore.getTrips(true));
  }, []);

  const handleOpenCreate = () => {
    setEditingTrip(null);
    setFormData({
      title: "",
      destination: "Ras Mohammed",
      boat_name: "Aura Oceanics Yacht I",
      duration: "Full Day",
      departure_time: "08:00 AM",
      price: 160,
      dives_included: 2,
      description: "",
      featured_image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
      status: "published",
      is_featured: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (trp: Trip) => {
    setEditingTrip(trp);
    setFormData(trp);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this expedition?")) {
      const updated = DataStore.deleteTrip(id);
      setTrips(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const toSave: Trip = {
      id: editingTrip ? editingTrip.id : `trp-${Date.now()}`,
      title: formData.title || "Untitled Safari",
      slug: formData.slug || formData.title?.toLowerCase().replace(/\s+/g, "-") || `trp-${Date.now()}`,
      destination: formData.destination || "Red Sea Reserve",
      boat_name: formData.boat_name,
      duration: formData.duration || "Full Day",
      departure_time: formData.departure_time,
      return_time: "04:30 PM",
      price: Number(formData.price) || null,
      dives_included: Number(formData.dives_included) || 2,
      meals_included: ["Gourmet Lunch on Board", "Artisan Coffee", "Fruit Refreshments"],
      itinerary: [
        { time: "08:00", activity: "Departure from private jetty" },
        { time: "10:00", activity: "Morning Wall Dive" },
        { time: "12:30", activity: "Chef-prepared lunch buffet" },
        { time: "14:00", activity: "Afternoon Reef Exploration" },
      ],
      description: formData.description || "",
      featured_image: formData.featured_image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
      gallery_images: [],
      is_featured: Boolean(formData.is_featured),
      status: (formData.status as any) || "published",
      display_order: editingTrip ? editingTrip.display_order : trips.length + 1,
    };

    const updated = DataStore.saveTrip(toSave);
    setTrips(updated);
    setModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-6xl">
        <PublishBar />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
              Expedition Voyages & Safaris CMS
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage liveaboards, custom catamarans, wreck trips, and daily departures.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Expedition
          </Button>
        </div>

        <div className="space-y-4">
          {trips.map((trp) => (
            <div
              key={trp.id}
              className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                  <Image src={trp.featured_image || trp.image_url || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop"} alt={trp.title} fill className="object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                      {trp.destination}
                    </span>
                    <h3 className="text-base font-bold text-white font-display">{trp.title}</h3>
                    <Badge variant={trp.status === "published" ? "success" : "subtle"}>
                      {trp.status}
                    </Badge>
                    {trp.has_unpublished_changes && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        Draft Changes
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{trp.boat_name || trp.description}</p>
                  <div className="flex items-center gap-3 text-xs text-cyan-300 font-mono">
                    <span>{trp.duration}</span>
                    <span>•</span>
                    <span>{trp.dives_included} Dives</span>
                    <span>•</span>
                    <span>{formatCurrency(trp.price)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <Button variant="glass" size="sm" onClick={() => handleOpenEdit(trp)}>
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(trp.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
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
          title={editingTrip ? "Edit Expedition" : "Create New Sea Expedition"}
          maxWidth="2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Expedition Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Destination / Marine Reserve"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
              />
              <Input
                label="Vessel Name"
                placeholder="e.g. Diving Vision Catamaran I"
                value={formData.boat_name || ""}
                onChange={(e) => setFormData({ ...formData, boat_name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
              <Input
                label="Departure Time"
                value={formData.departure_time || ""}
                onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
              />
              <Input
                label="Price (EUR)"
                type="number"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>

            {/* Real Cloud Storage File Uploader */}
            <FileUploader
              label="Expedition Image Asset"
              currentUrl={formData.featured_image}
              onUploadComplete={(url) => setFormData({ ...formData, featured_image: url })}
            />

            <Textarea
              label="Full Expedition Narrative"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              options={[
                { label: "Published (Visible publicly)", value: "published" },
                { label: "Draft (Hidden)", value: "draft" },
                { label: "Archived", value: "archived" },
              ]}
            />

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <Button type="button" variant="glass" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Expedition Draft
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
