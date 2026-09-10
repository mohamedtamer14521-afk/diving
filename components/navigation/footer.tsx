"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Phone, Mail, MapPin, ChevronRight, Instagram, Facebook, Award, Anchor } from "lucide-react";
import { DataStore } from "@/lib/data-store";
import { BusinessSettings } from "@/lib/types";
import { DEFAULT_BUSINESS_SETTINGS } from "@/lib/business-config";

export function Footer({ initialSettings }: { initialSettings?: BusinessSettings }) {
  const [settings, setSettings] = useState<BusinessSettings>(
    initialSettings || DEFAULT_BUSINESS_SETTINGS
  );

  useEffect(() => {
    if (!initialSettings) {
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
  }, [initialSettings]);

  return (
    <footer className="relative bg-[#020611] border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-cyan-600/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-400 p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <Compass className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="text-lg font-bold text-white font-display tracking-tight block leading-tight">
                  {settings.business_name}
                </span>
                <span className="text-[10px] text-cyan-400 font-medium tracking-wide">
                  PADI 5-Star Dive Resort
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {settings.description}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {settings.social_links?.instagram && (
                <a
                  href={settings.social_links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.social_links?.facebook && (
                <a
                  href={settings.social_links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-cyan-400 font-bold font-mono">Quick Navigation</p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                <a href="#trips" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" /> Daily Boat Safaris
                </a>
              </li>
              <li>
                <a href="#activities" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" /> Diving Experiences
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" /> PADI Diver Academy
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" /> Underwater Photo Gallery
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" /> Verified Guest Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Operating Hours */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-cyan-400 font-bold font-mono">Operating Hours</p>
            <div className="space-y-2 text-xs text-slate-300">
              {settings.opening_hours?.map((item, idx) => (
                <div key={idx} className="pb-1.5 border-b border-white/5">
                  <span className="block text-white font-medium">{item.days}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: Location & Contact */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-cyan-400 font-bold font-mono">Sharm El-Sheikh Base</p>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  {settings.address}, {settings.city}, {settings.country}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white font-mono transition-colors">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white font-mono transition-colors">
                  {settings.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {settings.business_name}. All rights reserved.</p>
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>PADI 5-Star Certified Dive Resort • Red Sea, Egypt</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
