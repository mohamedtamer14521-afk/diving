"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, Sparkles, ArrowRight, ShieldCheck, Compass, Anchor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataStore } from "@/lib/data-store";
import { HomepageSection, BusinessSettings } from "@/lib/types";
import { DEFAULT_BUSINESS_SETTINGS } from "@/lib/business-config";

interface CinematicHeroProps {
  section?: HomepageSection;
  businessSettings?: BusinessSettings;
  onOpenBooking?: () => void;
}

export function CinematicHero({ section, businessSettings, onOpenBooking }: CinematicHeroProps) {
  const [settings, setSettings] = useState<BusinessSettings>(
    businessSettings || DEFAULT_BUSINESS_SETTINGS
  );

  useEffect(() => {
    if (!businessSettings) {
      setSettings(DataStore.getSettings());
    }

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.key === "diving_vision_settings") {
        setSettings(customEvent.detail.value);
      }
    };
    window.addEventListener("store-sync", handleSync);
    return () => window.removeEventListener("store-sync", handleSync);
  }, [businessSettings]);

  const title = section?.title || "Discover the Red Sea's Ultimate Depths.";
  const subtitle =
    section?.subtitle ||
    "PADI 5-Star Dive Resort in Sharm El-Sheikh. World-class coral reefs, legendary WW2 wrecks, and daily private boat safaris.";
  const badge = section?.badge || "PADI 5-Star Dive Center #34281 • Sharm El-Sheikh";

  const waterTemp = (section?.settings as any)?.water_temp || "28°C / 82°F";
  const visibility = (section?.settings as any)?.visibility || "35m+ Crystal";
  const guideRatio = (section?.settings as any)?.guide_ratio || "Max 1:4 Ratio";
  const gearTier = (section?.settings as any)?.gear_tier || "Scubapro & Aqualung";

  return (
    <section className="relative min-h-[95vh] sm:min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2000&auto=format&fit=crop"
          alt="Red Sea coral reef diving in Sharm El Sheikh"
          fill
          priority
          className="object-cover object-center scale-105 animate-subtle-zoom brightness-[0.45]"
        />
        {/* Multilayer gradient depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/50 to-[#030712]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/40 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Top Verified Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold tracking-wide uppercase shadow-lg shadow-cyan-950/50 backdrop-blur-md mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>{badge}</span>
        </div>

        {/* Dynamic Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white font-display tracking-tight leading-[1.1] max-w-4xl text-balance drop-shadow-2xl">
          {title}
        </h1>

        {/* Dynamic Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl text-balance leading-relaxed font-normal drop-shadow-md">
          {subtitle}
        </p>

        {/* Primary Call to Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            size="lg"
            variant="primary"
            className="w-full sm:w-auto px-8 py-4 text-base font-bold shadow-2xl shadow-cyan-500/25 group"
            onClick={
              onOpenBooking ||
              (() => {
                document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
              })
            }
          >
            <span>Book Expedition / Course</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <a
            href="#trips"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/10 border border-white/15 text-white text-sm font-semibold backdrop-blur-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Anchor className="w-4 h-4 text-cyan-400" />
            <span>Daily Boat Safaris</span>
          </a>
        </div>

        {/* Live Marine Telemetry Bar */}
        <div className="mt-14 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Water Temp
            </span>
            <span className="text-sm sm:text-base font-bold text-cyan-300 font-mono mt-0.5 block">
              {waterTemp}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Visibility
            </span>
            <span className="text-sm sm:text-base font-bold text-cyan-300 font-mono mt-0.5 block">
              {visibility}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Guide Ratio
            </span>
            <span className="text-sm sm:text-base font-bold text-cyan-300 font-mono mt-0.5 block">
              {guideRatio}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Dive Gear
            </span>
            <span className="text-sm sm:text-base font-bold text-cyan-300 font-mono mt-0.5 block">
              {gearTier}
            </span>
          </div>
        </div>
      </div>

      {/* Down Arrow */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-500 animate-bounce hidden sm:block">
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  );
}
