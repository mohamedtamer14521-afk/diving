"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Clock, Waves, ArrowRight, CheckCircle2, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { DataStore } from "@/lib/data-store";
import { Activity, HomepageSection } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { DEFAULT_ACTIVITIES } from "@/lib/business-config";

interface ActivitiesSectionProps {
  section?: HomepageSection;
  initialActivities?: Activity[];
  onSelectActivity?: (activityTitle: string) => void;
}

export function ActivitiesSection({
  section,
  initialActivities,
  onSelectActivity,
}: ActivitiesSectionProps) {
  const [activities, setActivities] = useState<Activity[]>(
    initialActivities || DEFAULT_ACTIVITIES
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("All Levels");
  const [activeModalItem, setActiveModalItem] = useState<Activity | null>(null);

  useEffect(() => {
    if (!initialActivities) {
      setActivities(DataStore.getActivities());
    }

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (
        customEvent.detail &&
        (customEvent.detail.key === "diving_vision_activities" ||
          customEvent.detail.key === "aura_oceanics_activities")
      ) {
        setActivities(DataStore.getActivities());
      }
    };
    window.addEventListener("store-sync", handleSync);
    return () => window.removeEventListener("store-sync", handleSync);
  }, [initialActivities]);

  const categories = ["All Levels", "Beginner", "Intermediate", "Advanced"];

  const filteredActivities =
    selectedCategory === "All Levels"
      ? activities
      : activities.filter(
          (a) => a.experience_level === selectedCategory || a.experience_level === "All Levels"
        );

  const title = section?.title || "Curated Diving Experiences";
  const subtitle =
    section?.subtitle || "From private house-reef immersion to nocturnal fluorescence expeditions.";
  const badge = section?.badge || "Signature Dives";

  return (
    <section id="activities" className="section-spacious relative bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              {badge}
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
              {title}
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mt-2 max-w-xl font-light">
              {subtitle}
            </p>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold shadow-md shadow-sky-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/10 text-center">
            <p className="text-slate-400">No published activities in this category yet.</p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="group relative rounded-3xl bg-slate-900/60 border border-white/10 overflow-hidden backdrop-blur-xl flex flex-col justify-between apple-card-hover"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={act.featured_image}
                  alt={act.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Level Badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant="cyan">{act.experience_level}</Badge>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-white font-mono text-sm font-semibold">
                  {formatCurrency(act.price)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-2 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {act.duration}
                    </span>
                    {act.depth_max && (
                      <span className="flex items-center gap-1">
                        <Waves className="w-3.5 h-3.5 text-sky-400" />
                        Max {act.depth_max}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 font-display tracking-tight group-hover:text-cyan-300 transition-colors">
                    {act.title}
                  </h3>

                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {act.short_description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveModalItem(act)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    View Specs
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      if (onSelectActivity) {
                        onSelectActivity(act.title);
                      } else {
                        const el = document.getElementById("booking");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    Book Slot
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Details Modal */}
      {activeModalItem && (
        <Modal
          isOpen={!!activeModalItem}
          onClose={() => setActiveModalItem(null)}
          title={activeModalItem.title}
          subtitle={`${activeModalItem.experience_level} • ${activeModalItem.duration}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-white/10">
              <Image
                src={activeModalItem.featured_image}
                alt={activeModalItem.title}
                fill
                className="object-cover"
              />
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{activeModalItem.description}</p>

            {/* Inclusions */}
            {activeModalItem.included_items.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-3">
                  Included Amenities & Gear
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModalItem.included_items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prerequisites */}
            {activeModalItem.requirements.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-3">
                  Safety Prerequisites
                </h4>
                <div className="space-y-1.5">
                  {activeModalItem.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <Shield className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price & Action */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-white font-mono">
                  {formatCurrency(activeModalItem.price)}
                </span>
                {activeModalItem.price_note && (
                  <p className="text-xs text-slate-400">{activeModalItem.price_note}</p>
                )}
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  const title = activeModalItem.title;
                  setActiveModalItem(null);
                  if (onSelectActivity) {
                    onSelectActivity(title);
                  } else {
                    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Inquire For This Dive
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
