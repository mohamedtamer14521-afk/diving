"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Menu, X, Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataStore } from "@/lib/data-store";
import { BusinessSettings } from "@/lib/types";
import { DEFAULT_BUSINESS_SETTINGS } from "@/lib/business-config";

export function Navbar({
  initialSettings,
  onOpenBooking,
}: {
  initialSettings?: BusinessSettings;
  onOpenBooking?: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<BusinessSettings>(
    initialSettings || DEFAULT_BUSINESS_SETTINGS
  );

  useEffect(() => {
    // If not provided via prop, get from store on client
    if (!initialSettings) {
      setSettings(DataStore.getSettings());
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);

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

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("store-sync", handleSync);
    };
  }, [initialSettings]);

  const navLinks = [
    { label: "Experiences", href: "#activities" },
    { label: "Academy", href: "#courses" },
    { label: "Expeditions", href: "#trips" },
    { label: "Why Us", href: "#why-us" },
    { label: "Gallery", href: "#gallery" },
    { label: "FAQ", href: "#faqs" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
          scrolled ? "py-3" : "py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            className={`flex items-center justify-between px-5 py-3 rounded-full transition-all duration-500 ${
              scrolled
                ? "bg-slate-950/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50"
                : "bg-slate-950/40 backdrop-blur-md border border-white/5"
            }`}
          >
            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-400 p-[1px] shadow-glow-cyan flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <Compass className="w-5 h-5 text-cyan-400 transition-transform duration-700 group-hover:rotate-180" />
                </div>
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white block leading-none font-display">
                  {settings.business_name}
                </span>
                <span className="text-[10px] tracking-widest text-cyan-400 uppercase font-medium mt-0.5 block">
                  Sanctuary & Expeditions
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/admin"
                className="text-xs text-slate-400 hover:text-cyan-400 font-medium px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors"
                title="Admin Control Center"
              >
                <Shield className="w-3.5 h-3.5 inline mr-1" />
                Admin
              </Link>
              <Button
                size="sm"
                variant="primary"
                onClick={
                  onOpenBooking ||
                  (() => {
                    const el = document.getElementById("booking");
                    el?.scrollIntoView({ behavior: "smooth" });
                  })
                }
              >
                <Calendar className="w-3.5 h-3.5 mr-1" />
                Reserve Slot
              </Button>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Fullscreen Glass Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-slate-950/95 backdrop-blur-2xl md:hidden flex flex-col justify-between p-6 pt-24 animate-in fade-in duration-300">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold px-2">Navigation</p>
            <div className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-2xl font-bold text-slate-200 hover:text-cyan-300 py-2 px-2 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
              <span>Direct Concierge:</span>
              <a href={`tel:${settings.phone}`} className="text-white font-medium hover:text-cyan-400">
                {settings.phone}
              </a>
            </div>

            <Button
              className="w-full py-4 text-base"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenBooking) {
                  onOpenBooking();
                } else {
                  document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book An Expedition
            </Button>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center text-xs text-slate-500 hover:text-slate-300 py-2"
            >
              Admin Dashboard Login &rarr;
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
