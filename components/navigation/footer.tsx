"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Phone, Mail, MapPin, Shield, ChevronRight, Instagram, Facebook } from "lucide-react";
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
  }, [initialSettings]);

  return (
    <footer className="relative bg-slate-950 border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-sky-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          {/* Col 1: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-400 p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <Compass className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white font-display tracking-tight">
                {settings.business_name}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
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
            <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">Expeditions</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#activities" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-400/60" /> Daily Dives
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-400/60" /> PADI Academy
                </a>
              </li>
              <li>
                <a href="#trips" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-400/60" /> Liveaboard Safaris
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-cyan-400/60" /> Marine Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Sanctuary Hours */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">Operating Hours</p>
            <div className="space-y-2 text-xs text-slate-400">
              {settings.opening_hours?.map((item, idx) => (
                <div key={idx} className="pb-1 border-b border-white/[0.04]">
                  <span className="block text-slate-300 font-medium">{item.days}</span>
                  <span className="text-slate-500">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: Location & Concierge */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">Location & Contact</p>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>
                  {settings.address}, {settings.city}, {settings.country}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.business_name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-600">Enterprise White-Label Architecture</span>
            <Link href="/admin" className="hover:text-slate-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
