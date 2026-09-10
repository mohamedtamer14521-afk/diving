"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { PublishBar } from "@/components/admin/publish-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataStore } from "@/lib/data-store";
import { HomepageSection } from "@/lib/types";
import { ArrowUp, ArrowDown, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSections(DataStore.getSections().sort((a, b) => a.display_order - b.display_order));
  }, []);

  const handleToggleEnable = (id: string, currentVal: boolean) => {
    const updated = DataStore.updateSection(id, { is_enabled: !currentVal });
    setSections(updated.sort((a, b) => a.display_order - b.display_order));
    triggerSuccess();
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const list = [...sections];
    const [moved] = list.splice(index, 1);
    list.splice(newIndex, 0, moved);

    const reorderedIds = list.map((s) => s.id);
    const updated = DataStore.reorderSections(reorderedIds);
    setSections(updated);
    triggerSuccess();
  };

  const handleUpdateText = (id: string, field: "title" | "subtitle" | "badge", value: string) => {
    const updated = DataStore.updateSection(id, { [field]: value });
    setSections(updated.sort((a, b) => a.display_order - b.display_order));
  };

  const triggerSuccess = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-5xl">
        <PublishBar />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
              Homepage Section Hierarchy & Controls
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Enable/disable sections, reorder layout priority, and edit section headlines.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Section order saved as draft! Click &quot;Publish Changes Live&quot; to push to visitors.</span>
          </div>
        )}

        {/* Section List */}
        <div className="space-y-4">
          {sections.map((sec, idx) => (
            <div
              key={sec.id}
              className={`p-6 rounded-3xl border transition-all ${
                sec.is_enabled
                  ? "bg-slate-900/60 border-white/10"
                  : "bg-slate-950/40 border-white/5 opacity-60"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono text-cyan-400">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">{sec.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      Key: #{sec.section_key}
                    </span>
                  </div>
                </div>

                {/* Control Actions */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                  {/* Move Up */}
                  <button
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white disabled:opacity-30 border border-white/10"
                    title="Move Section Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  {/* Move Down */}
                  <button
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === sections.length - 1}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white disabled:opacity-30 border border-white/10"
                    title="Move Section Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  {/* Toggle Visibility */}
                  <button
                    onClick={() => handleToggleEnable(sec.id, sec.is_enabled)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      sec.is_enabled
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                        : "bg-rose-500/15 border-rose-500/30 text-rose-300"
                    }`}
                  >
                    {sec.is_enabled ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Enabled</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <Input
                  label="Section Title"
                  value={sec.title}
                  onChange={(e) => handleUpdateText(sec.id, "title", e.target.value)}
                />
                <Input
                  label="Section Subtitle"
                  value={sec.subtitle}
                  onChange={(e) => handleUpdateText(sec.id, "subtitle", e.target.value)}
                />
                <Input
                  label="Pill Badge Label"
                  value={sec.badge || ""}
                  onChange={(e) => handleUpdateText(sec.id, "badge", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
