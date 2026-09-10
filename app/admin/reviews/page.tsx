"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea, Select } from "@/components/ui/input";
import { DataStore } from "@/lib/data-store";
import { Review } from "@/lib/types";
import { Plus, Trash2, Star, CheckCircle, MessageSquareQuote } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    author_name: "",
    diver_certification: "PADI Advanced Diver",
    rating: 5,
    review_text: "",
    trip_or_course: "Ras Mohammed Luxury Safari",
    is_verified: true,
  });

  useEffect(() => {
    setReviews(DataStore.getReviews(true));
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Delete this review?")) {
      const updated = DataStore.deleteReview(id);
      setReviews(updated);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author_name: formData.author_name,
      diver_certification: formData.diver_certification,
      rating: Number(formData.rating),
      review_text: formData.review_text,
      trip_or_course: formData.trip_or_course,
      date: new Date().toISOString().split("T")[0],
      source: "Direct Guest",
      is_verified: Boolean(formData.is_verified),
      is_featured: true,
      status: "published",
    };
    const updated = DataStore.saveReview(newRev);
    setReviews(updated);
    setModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
              Guest Testimonials Moderation CMS
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Verify authentic guest feedback, star ratings, and diver credential endorsements.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Verified Review
          </Button>
        </div>

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/20 transition-all"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <h3 className="text-base font-bold text-white font-display">{rev.author_name}</h3>
                  {rev.is_verified && (
                    <Badge variant="success">
                      <CheckCircle className="w-3 h-3 mr-1" /> Verified
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed">
                  &ldquo;{rev.review_text}&rdquo;
                </p>

                <div className="text-[11px] text-cyan-300 font-mono">
                  {rev.diver_certification} • {rev.trip_or_course}
                </div>
              </div>

              <Button variant="danger" size="sm" onClick={() => handleDelete(rev.id)}>
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Add Verified Guest Review"
          maxWidth="lg"
        >
          <form onSubmit={handleAdd} className="space-y-4">
            <Input
              label="Author Full Name"
              value={formData.author_name}
              onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Diver Certification"
                value={formData.diver_certification}
                onChange={(e) => setFormData({ ...formData, diver_certification: e.target.value })}
              />
              <Select
                label="Rating (Stars)"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                options={[
                  { label: "5 Stars (Exceptional)", value: 5 },
                  { label: "4 Stars (Very Good)", value: 4 },
                  { label: "3 Stars", value: 3 },
                ]}
              />
            </div>

            <Input
              label="Experience / Course Attended"
              value={formData.trip_or_course}
              onChange={(e) => setFormData({ ...formData, trip_or_course: e.target.value })}
            />

            <Textarea
              label="Guest Review Text"
              rows={4}
              value={formData.review_text}
              onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
              required
            />

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <Button type="button" variant="glass" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Publish Review
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
