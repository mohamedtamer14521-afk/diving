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
import { Course } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Plus, Edit2, Trash2, GraduationCap } from "lucide-react";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [formData, setFormData] = useState<Partial<Course>>({
    title: "",
    certification_agency: "PADI",
    level: "Beginner",
    duration: "3 Days",
    price: 450,
    price_note: "Includes digital materials",
    minimum_age: 10,
    prerequisites: "Basic swimming comfort",
    max_depth: "18m",
    short_description: "",
    description: "",
    featured_image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
    status: "published",
    is_featured: true,
  });

  useEffect(() => {
    setCourses(DataStore.getCourses(true));
  }, []);

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({
      title: "",
      certification_agency: "PADI",
      level: "Beginner",
      duration: "3 Days",
      price: 450,
      price_note: "Includes digital materials",
      minimum_age: 10,
      prerequisites: "Basic swimming comfort",
      max_depth: "18m",
      short_description: "",
      description: "",
      featured_image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
      status: "published",
      is_featured: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (crs: Course) => {
    setEditingCourse(crs);
    setFormData(crs);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      const updated = DataStore.deleteCourse(id);
      setCourses(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const toSave: Course = {
      id: editingCourse ? editingCourse.id : `crs-${Date.now()}`,
      title: formData.title || "Untitled Course",
      slug: formData.slug || formData.title?.toLowerCase().replace(/\s+/g, "-") || `crs-${Date.now()}`,
      certification_agency: (formData.certification_agency as any) || "PADI",
      level: (formData.level as any) || "Beginner",
      duration: formData.duration || "3 Days",
      minimum_age: Number(formData.minimum_age) || 10,
      prerequisites: formData.prerequisites,
      max_depth: formData.max_depth,
      price: Number(formData.price) || null,
      price_note: formData.price_note,
      short_description: formData.short_description || "",
      description: formData.description || "",
      featured_image: formData.featured_image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
      learning_outcomes: ["Core safety skills", "Open water dives", "Certification card"],
      certification_card_included: true,
      gear_included: true,
      is_featured: Boolean(formData.is_featured),
      status: (formData.status as any) || "published",
      display_order: editingCourse ? editingCourse.display_order : courses.length + 1,
    };

    const updated = DataStore.saveCourse(toSave);
    setCourses(updated);
    setModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-6xl">
        <PublishBar />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
              Certification Academy Courses CMS
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage PADI, SSI, and Technical diving syllabus, age limits, cloud images, and pricing.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Course
          </Button>
        </div>

        <div className="space-y-4">
          {courses.map((crs) => (
            <div
              key={crs.id}
              className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                  <Image src={crs.featured_image} alt={crs.title} fill className="object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                      {crs.certification_agency}
                    </span>
                    <h3 className="text-base font-bold text-white font-display">{crs.title}</h3>
                    <Badge variant={crs.status === "published" ? "success" : "subtle"}>
                      {crs.status}
                    </Badge>
                    {crs.has_unpublished_changes && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        Draft Changes
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{crs.short_description}</p>
                  <div className="flex items-center gap-3 text-xs text-cyan-300 font-mono">
                    <span>{crs.level}</span>
                    <span>•</span>
                    <span>{crs.duration}</span>
                    <span>•</span>
                    <span>{formatCurrency(crs.price)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <Button variant="glass" size="sm" onClick={() => handleOpenEdit(crs)}>
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(crs.id)}>
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
          title={editingCourse ? "Edit Academy Course" : "Create New Certification Course"}
          maxWidth="2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Course Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Certification Agency"
                value={formData.certification_agency}
                onChange={(e) => setFormData({ ...formData, certification_agency: e.target.value as any })}
                options={[
                  { label: "PADI", value: "PADI" },
                  { label: "SSI", value: "SSI" },
                  { label: "SDI", value: "SDI" },
                  { label: "NAUI", value: "NAUI" },
                  { label: "TDI (Technical)", value: "TDI" },
                ]}
              />
              <Select
                label="Course Tier"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                options={[
                  { label: "Beginner", value: "Beginner" },
                  { label: "Continuing Education", value: "Continuing Education" },
                  { label: "Rescue & Safety", value: "Rescue & Safety" },
                  { label: "Specialty", value: "Specialty" },
                  { label: "Professional", value: "Professional" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
              <Input
                label="Price (EUR)"
                type="number"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>

            <Input
              label="Prerequisites"
              value={formData.prerequisites || ""}
              onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
            />

            {/* Real Cloud Storage File Uploader */}
            <FileUploader
              label="Course Artwork / Cover"
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
                Save Course Draft
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
