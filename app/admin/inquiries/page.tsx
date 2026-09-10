"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Textarea, Select } from "@/components/ui/input";
import { DataStore } from "@/lib/data-store";
import { BookingInquiry, InquiryStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Inbox, MessageCircle, Phone, Mail, Calendar, Users, Edit2, Trash2, CheckCircle2 } from "lucide-react";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<BookingInquiry[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [activeModalInquiry, setActiveModalInquiry] = useState<BookingInquiry | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [editingStatus, setEditingStatus] = useState<InquiryStatus>("New");

  useEffect(() => {
    setInquiries(DataStore.getInquiries());
  }, []);

  const statuses: (InquiryStatus | "All")[] = [
    "All",
    "New",
    "Contacted",
    "Confirmed",
    "Completed",
    "Cancelled",
  ];

  const filteredInquiries =
    filterStatus === "All"
      ? inquiries
      : inquiries.filter((i) => i.status === filterStatus);

  const handleOpenDetail = (inq: BookingInquiry) => {
    setActiveModalInquiry(inq);
    setEditingNotes(inq.admin_notes || "");
    setEditingStatus(inq.status);
  };

  const handleSaveStatus = () => {
    if (!activeModalInquiry) return;
    const updated = DataStore.updateInquiryStatus(
      activeModalInquiry.id,
      editingStatus,
      editingNotes
    );
    setInquiries(updated);
    setActiveModalInquiry(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this inquiry record?")) {
      const updated = DataStore.deleteInquiry(id);
      setInquiries(updated);
    }
  };

  const handleDirectWhatsApp = (phone: string, name: string, itemTitle?: string) => {
    const cleanNumber = phone.replace(/[^0-9]/g, "");
    const businessName = DataStore.getSettings().business_name || "Diving Vision Center";
    const text = encodeURIComponent(
      `Hello ${name}, thank you for your inquiry regarding ${itemTitle || "our diving experiences"} at ${businessName}. We'd love to confirm your reservation details.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, "_blank");
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
              Inquiries & Booking Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Track guest inquiries, manage confirmation stages, and initiate direct concierge follow-ups.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === st
                  ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {st} {st !== "All" && `(${inquiries.filter((i) => i.status === st).length})`}
            </button>
          ))}
        </div>

        {/* List of Inquiries */}
        <div className="space-y-4">
          {filteredInquiries.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-white/10 text-center">
              <p className="text-slate-400 text-sm">No reservations found in this stage.</p>
            </div>
          ) : (
            filteredInquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-white/20 transition-all"
              >
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-base font-bold text-white font-display">
                      {inq.customer_name}
                    </span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
                        inq.status === "New"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
                          : inq.status === "Confirmed"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : inq.status === "Contacted"
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "bg-white/10 text-slate-300"
                      }`}
                    >
                      {inq.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Ref: #{inq.id.slice(-6)}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-cyan-300">
                    {inq.item_title} ({inq.interest_type})
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      Date: {formatDate(inq.preferred_date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      {inq.participants_count} Guest(s)
                    </span>
                    <span className="flex items-center gap-1.5 truncate">
                      Level: {inq.diver_level}
                    </span>
                  </div>

                  {inq.special_requests && (
                    <p className="text-xs text-slate-300 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                      <strong>Special Request:</strong> {inq.special_requests}
                    </p>
                  )}

                  {inq.admin_notes && (
                    <p className="text-xs text-amber-300/80 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                      <strong>Admin Notes:</strong> {inq.admin_notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
                  <button
                    onClick={() =>
                      handleDirectWhatsApp(inq.customer_phone, inq.customer_name, inq.item_title)
                    }
                    className="p-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Direct WhatsApp Message"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>

                  <Button variant="glass" size="sm" onClick={() => handleOpenDetail(inq)}>
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    Update Status
                  </Button>

                  <Button variant="danger" size="sm" onClick={() => handleDelete(inq.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Status Modal */}
      {activeModalInquiry && (
        <Modal
          isOpen={!!activeModalInquiry}
          onClose={() => setActiveModalInquiry(null)}
          title={`Manage Inquiry #${activeModalInquiry.id.slice(-6)}`}
          subtitle={`Guest: ${activeModalInquiry.customer_name} • ${activeModalInquiry.customer_phone}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <Select
              label="Lifecycle Status"
              value={editingStatus}
              onChange={(e) => setEditingStatus(e.target.value as InquiryStatus)}
              options={[
                { label: "New (Unprocessed)", value: "New" },
                { label: "Contacted (Follow-up sent)", value: "Contacted" },
                { label: "Confirmed (Deposit / Slot secured)", value: "Confirmed" },
                { label: "Completed (Expedition executed)", value: "Completed" },
                { label: "Cancelled", value: "Cancelled" },
              ]}
            />

            <Textarea
              label="Internal Concierge Notes"
              rows={4}
              placeholder="Record deposit payment status, assigned guide, or medical confirmation details..."
              value={editingNotes}
              onChange={(e) => setEditingNotes(e.target.value)}
            />

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <Button variant="glass" onClick={() => setActiveModalInquiry(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveStatus}>
                Update Inquiry Status
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
