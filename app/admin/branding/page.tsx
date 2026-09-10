"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { PublishBar } from "@/components/admin/publish-bar";
import { FileUploader } from "@/components/admin/file-uploader";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { DataStore } from "@/lib/data-store";
import { BusinessSettings, WhatsAppConfig } from "@/lib/types";
import { Save, CheckCircle2, Building, Phone, Mail, MapPin, Globe, MessageCircle } from "lucide-react";

export default function AdminBrandingPage() {
  const [settings, setSettings] = useState<BusinessSettings>(DataStore.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSettings(DataStore.getSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    DataStore.updateSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const whatsAppConfig: WhatsAppConfig = settings.whatsapp_config || {
    phone_number: settings.whatsapp_number,
    button_label: "Chat With Us",
    default_message: settings.whatsapp_default_message,
    is_enabled: true,
    position: "bottom-right",
    animation_intensity: "subtle",
    show_on_mobile: true,
    show_on_desktop: true,
  };

  const updateWhatsApp = (partial: Partial<WhatsAppConfig>) => {
    const updatedConfig = { ...whatsAppConfig, ...partial };
    setSettings({
      ...settings,
      whatsapp_config: updatedConfig,
      whatsapp_number: updatedConfig.phone_number || settings.whatsapp_number,
      whatsapp_default_message: updatedConfig.default_message || settings.whatsapp_default_message,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        <PublishBar />

        <form onSubmit={handleSave} className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
                Site Settings & White-Label Branding
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Configure business identity, cloud assets, and high-end WhatsApp concierge pill.
              </p>
            </div>

            <Button type="submit" variant="primary" size="md" className="self-start sm:self-auto">
              <Save className="w-4 h-4 mr-1.5" />
              Save Draft Changes
            </Button>
          </div>

          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Draft settings saved! Click &quot;Publish Changes Live&quot; to apply to public visitors.</span>
            </div>
          )}

          {/* Section 1: Core Brand Identity & Logo Upload */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Building className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white font-display">1. Brand Identity & Logo Asset</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Business / Sanctuary Name"
                value={settings.business_name}
                onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                required
              />
              <Input
                label="Luxury Tagline"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                required
              />
            </div>

            <Textarea
              label="Brand Overview / Mission Statement"
              rows={3}
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
            />

            {/* Logo Cloud Upload */}
            <div className="pt-2">
              <FileUploader
                label="Upload Sanctuary Logo to Cloud Storage"
                currentUrl={settings.logo_url}
                onUploadComplete={(url) => setSettings({ ...settings, logo_url: url })}
                aspectRatio="banner"
              />
            </div>
          </div>

          {/* Section 2: Premium Floating WhatsApp CTA Configurator */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white font-display">
                  2. Premium Floating WhatsApp Action Pill
                </h2>
              </div>
              <span className="text-xs font-mono text-emerald-400">Live Configurable</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Concierge WhatsApp Number (with country code)"
                hint="e.g. 201008924410"
                value={whatsAppConfig.phone_number}
                onChange={(e) => updateWhatsApp({ phone_number: e.target.value })}
                required
              />

              <Input
                label="Pill Button Label"
                placeholder="Chat With Us"
                value={whatsAppConfig.button_label}
                onChange={(e) => updateWhatsApp({ button_label: e.target.value })}
                required
              />
            </div>

            <Textarea
              label="Default Introductory WhatsApp Message"
              rows={2}
              value={whatsAppConfig.default_message}
              onChange={(e) => updateWhatsApp({ default_message: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Widget Position"
                value={whatsAppConfig.position}
                onChange={(e) => updateWhatsApp({ position: e.target.value as any })}
                options={[
                  { label: "Bottom Right (Standard)", value: "bottom-right" },
                  { label: "Bottom Left", value: "bottom-left" },
                ]}
              />

              <Select
                label="Breathing Glow Animation"
                value={whatsAppConfig.animation_intensity}
                onChange={(e) => updateWhatsApp({ animation_intensity: e.target.value as any })}
                options={[
                  { label: "Subtle (Apple Luxury)", value: "subtle" },
                  { label: "Normal (Pulse)", value: "normal" },
                  { label: "Disabled (Static)", value: "none" },
                ]}
              />

              <Select
                label="Enabled Status"
                value={whatsAppConfig.is_enabled ? "true" : "false"}
                onChange={(e) => updateWhatsApp({ is_enabled: e.target.value === "true" })}
                options={[
                  { label: "Enabled (Active)", value: "true" },
                  { label: "Disabled (Hidden)", value: "false" },
                ]}
              />
            </div>
          </div>

          {/* Section 3: Concierge Phone, Email & Location */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Phone className="w-5 h-5 text-sky-400" />
              <h2 className="text-base font-bold text-white font-display">
                3. Direct Contact & Coordinates
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Voice Phone Number"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                required
              />
              <Input
                label="Concierge Email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Input
                label="Street Address / Marina"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                required
              />
              <Input
                label="City / Port"
                value={settings.city}
                onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                required
              />
              <Input
                label="Country"
                value={settings.country}
                onChange={(e) => setSettings({ ...settings, country: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Section 4: Social Links & Base Currency */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Globe className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white font-display">
                4. Social Media Profiles & Base Currency
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Instagram URL"
                value={settings.social_links.instagram || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, instagram: e.target.value },
                  })
                }
              />
              <Input
                label="Facebook URL"
                value={settings.social_links.facebook || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social_links: { ...settings.social_links, facebook: e.target.value },
                  })
                }
              />
            </div>

            <div className="w-full sm:w-1/3">
              <Input
                label="Base Currency Symbol (EUR, USD, GBP, EGP)"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value.toUpperCase() })}
              />
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
