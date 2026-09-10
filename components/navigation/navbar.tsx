"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Menu, X, Calendar, Phone } from "lucide-react";
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
    if (!initialSettings) {
      setSettings(DataStore.getSettings());
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.key === "diving_vision_settings") {
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
    { label: "Boat Safaris", href: "#trips" },
    { label: "Diving Dives", href: "#activities" },
    { label: "PADI Courses", href: "#courses" },
    { label: "Why Us", href: "#why-us" },
    { label: "Gallery", href: "#gallery" },
    { label: "Reviews", href: "#reviews" },
    { label: "FAQ", href: "#faqs" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
          scrolled ? "py-2 sm:py-3" : "py-4 sm:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            className={`flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-500 ${
              scrolled
                ? "bg-slate-950/85 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/60"
                : "bg-slate-950/45 backdrop-blur-md border border-white/10"
            }`}
          >
            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-gradient-to-tr from-sky-500 via-cyan-400 to-teal-300 p-[1px] shadow-glow-cyan flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <Compass className="w-4 sm:w-5 h-4 sm:h-5 text-cyan-400 transition-transform duration-700 group-hover:rotate-180" />
                </div>
              </div>
              <div>
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-white block leading-none font-display">
                  {settings.business_name}
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-wider text-cyan-400 font-medium mt-0.5 block">
                  PADI 5-Star Resort • Sharm El-Sheikh
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 bg-white/[0.04] px-3 py-1 rounded-full border border-white/5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-cyan-300 rounded-full hover:bg-white/10 transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                href={`tel:${settings.phone}`}
                className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>{settings.phone}</span>
              </a>

              <Button
                size="sm"
                variant="primary"
                className="font-bold shadow-md shadow-cyan-500/20"
                onClick={
                  onOpenBooking ||
                  (() => {
                    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                  })
                }
              >
                <Calendar className="w-3.5 h-3.5 mr-1" />
                Reserve Dive Slot
              </Button>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Fullscreen Glass Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-slate-950/95 backdrop-blur-2xl lg:hidden flex flex-col justify-between p-6 pt-24 animate-in fade-in duration-300">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold px-2">Navigation</p>
            <div className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-2xl font-bold text-slate-200 hover:text-cyan-300 py-2 px-2 transition-colors font-display"
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
              className="w-full py-4 text-base font-bold"
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
          </div>
        </div>
      )}
    </>
  );
}
