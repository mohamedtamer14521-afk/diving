"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { DataStore } from "@/lib/data-store";
import { BusinessSettings, WhatsAppConfig } from "@/lib/types";
import { DEFAULT_BUSINESS_SETTINGS } from "@/lib/business-config";

interface FloatingWhatsAppProps {
  initialSettings?: BusinessSettings;
  customContext?: string;
  itemTitle?: string;
  bookingRef?: string;
}

export function FloatingWhatsApp({
  initialSettings,
  customContext,
  itemTitle,
  bookingRef,
}: FloatingWhatsAppProps) {
  const [settings, setSettings] = useState<BusinessSettings>(
    initialSettings || DEFAULT_BUSINESS_SETTINGS
  );
  const [isHovered, setIsHovered] = useState(false);

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

  const config: WhatsAppConfig = settings.whatsapp_config || {
    phone_number: settings.whatsapp_number || "201008924410",
    button_label: "Chat With Us",
    default_message:
      settings.whatsapp_default_message ||
      `Hello ${settings.business_name}, I would like to inquire about booking a diving experience.`,
    is_enabled: true,
    position: "bottom-right",
    animation_intensity: "subtle",
    show_on_mobile: true,
    show_on_desktop: true,
  };

  if (!config.is_enabled) return null;

  const handleOpenWhatsApp = () => {
    let message = config.default_message;

    if (itemTitle) {
      message = `Hello ${settings.business_name}, I would like to inquire regarding "${itemTitle}"${
        bookingRef ? ` (Booking Ref: #${bookingRef})` : ""
      }.`;
    } else if (customContext) {
      message = `Hello ${settings.business_name}, I would like to ask about ${customContext}.`;
    }

    const cleanNumber = (config.phone_number || settings.whatsapp_number || "201008924410").replace(/[^0-9]/g, "");
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanNumber}?text=${encoded}`, "_blank", "noopener,noreferrer");
  };

  const positionClass =
    config.position === "bottom-left"
      ? "left-5 sm:left-8 bottom-6 sm:bottom-8"
      : "right-5 sm:right-8 bottom-6 sm:bottom-8";

  const visibilityClass = `${config.show_on_mobile ? "flex" : "hidden sm:flex"} ${
    config.show_on_desktop ? "sm:flex" : "sm:hidden"
  }`;

  const animationClass =
    config.animation_intensity === "normal"
      ? "animate-pulse"
      : config.animation_intensity === "subtle"
      ? "animate-pulse-subtle"
      : "";

  return (
    <aside
      aria-label="Concierge WhatsApp Contact"
      className={`fixed ${positionClass} ${visibilityClass} z-40 items-center pointer-events-auto pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)]`}
    >
      <button
        onClick={handleOpenWhatsApp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`${config.button_label || "Chat With Us"} on WhatsApp`}
        className={`group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-950/80 backdrop-blur-xl border border-emerald-400/40 text-white shadow-2xl shadow-emerald-950/60 transition-all duration-500 hover:scale-[1.04] active:scale-[0.98] hover:border-emerald-300 hover:bg-slate-900/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 select-none ${animationClass}`}
        style={{
          boxShadow: isHovered
            ? "0 20px 40px -10px rgba(16, 185, 129, 0.35), 0 0 30px -5px rgba(16, 185, 129, 0.4)"
            : "0 12px 32px -8px rgba(0, 0, 0, 0.7), 0 0 20px -8px rgba(16, 185, 129, 0.25)",
        }}
      >
        {/* Subtle breathing glow ring around button */}
        <span className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-emerald-500/20 via-teal-400/30 to-emerald-500/20 opacity-70 blur-sm pointer-events-none group-hover:opacity-100 transition-opacity" />

        {/* WhatsApp Icon with Luxury Inner Badge */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-500/30 flex-shrink-0 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105">
          <MessageCircle className="w-4 h-4 fill-white" />

          {/* Micro Active Beacon */}
          <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-300 border-2 border-slate-950 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-80" />
          </span>
        </div>

        {/* Branded Label */}
        <div className="flex flex-col items-start pr-1">
          <span className="text-xs font-bold tracking-tight text-white font-display group-hover:text-emerald-200 transition-colors leading-none">
            {config.button_label || "Chat With Us"}
          </span>
          <span className="text-[10px] text-emerald-400/90 font-mono tracking-wider uppercase mt-0.5 leading-none">
            VIP Concierge
          </span>
        </div>
      </button>
    </aside>
  );
}
