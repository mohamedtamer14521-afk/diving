"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea, Select } from "@/components/ui/input";
import { DataStore } from "@/lib/data-store";
import { FAQ } from "@/lib/types";
import { Plus, Edit2, Trash2, HelpCircle } from "lucide-react";

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "General" as FAQ["category"],
  });

  useEffect(() => {
    setFaqs(DataStore.getFaqs(true));
  }, []);

  const handleOpenCreate = () => {
    setEditingFaq(null);
    setFormData({
      question: "",
      answer: "",
      category: "General",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
    });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this FAQ?")) {
      const updated = DataStore.deleteFaq(id);
      setFaqs(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const toSave: FAQ = {
      id: editingFaq ? editingFaq.id : `faq-${Date.now()}`,
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
      status: "published",
      display_order: editingFaq ? editingFaq.display_order : faqs.length + 1,
      created_at: new Date().toISOString(),
    };

    const updated = DataStore.saveFaq(toSave);
    setFaqs(updated);
    setModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
              Knowledge Base & FAQ CMS
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage client questions regarding logistics, safety gear, medicals, and policies.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Question
          </Button>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:border-white/20 transition-all"
            >
              <div className="space-y-2 max-w-2xl">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {faq.category}
                </span>
                <h3 className="text-base font-bold text-white font-display mt-1">{faq.question}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <Button variant="glass" size="sm" onClick={() => handleOpenEdit(faq)}>
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(faq.id)}>
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
          title={editingFaq ? "Edit FAQ" : "Create New FAQ"}
          maxWidth="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              required
            />

            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              options={[
                { label: "General", value: "General" },
                { label: "Equipment & Safety", value: "Equipment & Safety" },
                { label: "Trips & Booking", value: "Trips & Booking" },
                { label: "Courses & Certification", value: "Courses & Certification" },
                { label: "Medical & Prerequisites", value: "Medical & Prerequisites" },
              ]}
            />

            <Textarea
              label="Clear Answer"
              rows={5}
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              required
            />

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <Button type="button" variant="glass" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save FAQ
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
