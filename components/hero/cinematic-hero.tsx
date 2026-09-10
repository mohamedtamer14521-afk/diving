"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, Sparkles, ArrowUpRight } from "lucide-react";
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
      if (
        customEvent.detail &&
        (customEvent.detail.key === "diving_vision_settings" ||
          customEvent.detail.key === "aura_oceanics_settings")
      ) {
        setSettings(customEvent.detail.value);
      }
    };
    window.addEventListener("store-sync", handleSync);
    return () => window.removeEventListener("store-sync", handleSync);
  }, [businessSettings]);

  const title = section?.title || "Descend into Pure Silence.";
  const subtitle =
    section?.subtitle ||
    "Bespoke underwater expeditions, private guide services, and master certifications in crystal-clear waters.";
  const badge = section?.badge || "Exclusive Marine Expeditions";

  const waterTemp = (section?.settings as any)?.water_temp || "27.5°C / 81°F";
  const visibility = (section?.settings as any)?.visibility || "35m+ Crystal";
  const guideRatio = (section?.settings as any)?.guide_ratio || "1 : 2 Private";
  const gearTier = (section?.settings as any)?.gear_tier || "Scubapro Pro";

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2000&auto=format&fit=crop"
          alt="Deep ocean coral wall"
          fill
          priority
          className="object-cover object-center scale-105 filter brightness-[0.42] contrast-[1.1] transition-transform duration-1000 ease-out"
        />

        {/* Ambient Gradient Masks */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
        <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 via-transparent to-slate-950/90 pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Apple-style Top Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/15 mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-semibold tracking-wide text-cyan-200 uppercase">
            {badge}
          </span>
          <span className="w-1 h-1 rounded-full bg-cyan-400" />
          <span className="text-xs text-slate-300 font-medium">Red Sea Sanctuary</span>
        </div>

        {/* Cinematic Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl font-display mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {title.split(" ").map((word, i) =>
            i === title.split(" ").length - 1 ? (
              <span key={i} className="text-gradient-cyan block sm:inline">
                {" " + word}
              </span>
            ) : (
              word + " "
            )
          )}
        </h1>

        {/* Subtle Luxury Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl font-light leading-relaxed mb-10 text-subtle animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
          <Button
            size="lg"
            variant="primary"
            className="w-full sm:w-auto text-base shadow-xl shadow-sky-500/30"
            onClick={
              onOpenBooking ||
              (() => {
                document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
              })
            }
          >
            Reserve Private Expedition
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Button>

          <a href="#activities" className="w-full sm:w-auto">
            <Button size="lg" variant="glass" className="w-full sm:w-auto text-base">
              Explore Experiences
            </Button>
          </a>
        </div>

        {/* Live Ocean Sanctuary Conditions Pill Dock */}
        <div className="mt-14 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl animate-in fade-in duration-1000 delay-300">
          <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 text-left">
            <span className="block text-[10px] tracking-wider uppercase text-slate-400 font-semibold">
              Water Temp
            </span>
            <span className="text-sm font-bold text-white mt-0.5 block font-mono">{waterTemp}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 text-left">
            <span className="block text-[10px] tracking-wider uppercase text-slate-400 font-semibold">
              Visibility
            </span>
            <span className="text-sm font-bold text-cyan-300 mt-0.5 block font-mono">{visibility}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 text-left">
            <span className="block text-[10px] tracking-wider uppercase text-slate-400 font-semibold">
              Guide Ratio
            </span>
            <span className="text-sm font-bold text-white mt-0.5 block font-mono">{guideRatio}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 text-left">
            <span className="block text-[10px] tracking-wider uppercase text-slate-400 font-semibold">
              Gear Tier
            </span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block font-mono">{gearTier}</span>
          </div>
        </div>
      </div>

      {/* Down Chevron Indicator */}
      <a
        href="#narrative"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 p-2 rounded-full text-slate-400 hover:text-white transition-colors animate-bounce"
        aria-label="Scroll to narrative"
      >
        <ChevronDown className="w-5 h-5" />
      </a>
    </section>
  );
}
