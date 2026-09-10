"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Clock, Waves, ArrowRight, CheckCircle2, Sparkles, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [activeModalItem, setActiveModalItem] = useState<Activity | null>(null);

  useEffect(() => {
    if (!initialActivities) {
      setActivities(DataStore.getActivities());
    }

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.key === "diving_vision_activities") {
        setActivities(DataStore.getActivities());
      }
    };
    window.addEventListener("store-sync", handleSync);
    return () => window.removeEventListener("store-sync", handleSync);
  }, [initialActivities]);

  const title = section?.title || "Diving & Snorkeling Experiences";
  const subtitle =
    section?.subtitle ||
    "Tailored dive programs for certified divers, non-certified beginners, and marine enthusiasts of all ages.";
  const badge = section?.badge || "Signature Red Sea Dives";

  return (
    <section id="activities" className="py-24 relative bg-[#020712] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
              {title}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2.5 max-w-xl font-light">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((activity) => {
            const imgSrc =
              activity.image_url ||
              activity.featured_image ||
              "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop";

            return (
              <div
                key={activity.id}
                className="group relative rounded-3xl bg-slate-900/60 border border-white/10 overflow-hidden backdrop-blur-xl flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-300 shadow-xl"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={activity.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {activity.category && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                        {activity.category}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 text-white font-mono text-xs font-bold shadow-md">
                    {formatCurrency(activity.price, activity.currency || "EUR")}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {activity.duration}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 font-display tracking-tight group-hover:text-cyan-300 transition-colors">
                      {activity.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                      {activity.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveModalItem(activity)}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      Learn More
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <Button
                      size="sm"
                      variant="primary"
                      className="text-xs px-3 py-1.5 font-bold"
                      onClick={() => {
                        if (onSelectActivity) {
                          onSelectActivity(activity.title);
                        } else {
                          document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {activeModalItem && (
        <Modal
          isOpen={!!activeModalItem}
          onClose={() => setActiveModalItem(null)}
          title={activeModalItem.title}
          subtitle={activeModalItem.category || activeModalItem.duration}
          maxWidth="lg"
        >
          <div className="space-y-5">
            <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-white/10">
              <Image
                src={
                  activeModalItem.image_url ||
                  activeModalItem.featured_image ||
                  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop"
                }
                alt={activeModalItem.title}
                fill
                className="object-cover"
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{activeModalItem.description}</p>

            {(activeModalItem.highlights || activeModalItem.included_items) && (
              <div>
                <h4 className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-2.5">
                  Experience Inclusions
                </h4>
                <ul className="space-y-1.5">
                  {(activeModalItem.highlights || activeModalItem.included_items || []).map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-base font-bold text-white font-mono">
                {formatCurrency(activeModalItem.price, activeModalItem.currency || "EUR")}{" "}
                <span className="text-xs text-slate-400 font-normal">/ person</span>
              </span>

              <Button
                variant="primary"
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
                Reserve Slot
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
