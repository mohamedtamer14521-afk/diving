"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { PublishBar } from "@/components/admin/publish-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/input";
import { DataStore } from "@/lib/data-store";
import { THEME_PRESETS } from "@/lib/theme-presets";
import { ThemeConfig } from "@/lib/types";
import { Palette, CheckCircle2, Layout, Sliders, Smartphone } from "lucide-react";
import Link from "next/link";

export default function AdminAppearancePage() {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(DataStore.getTheme());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setCurrentTheme(DataStore.getTheme());
  }, []);

  const handleSelectPreset = (presetKey: string) => {
    const updated = DataStore.setTheme(presetKey);
    setCurrentTheme(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleUpdateCustomColor = (key: keyof ThemeConfig["colors"], value: string) => {
    const updated = {
      ...currentTheme,
      colors: {
        ...currentTheme.colors,
        [key]: value,
      },
    };
    setCurrentTheme(updated);
    DataStore.updateCustomTheme(updated);
  };

  const handleUpdateStyling = (key: keyof ThemeConfig["styling"], value: any) => {
    const updated = {
      ...currentTheme,
      styling: {
        ...currentTheme.styling,
        [key]: value,
      },
    };
    setCurrentTheme(updated);
    DataStore.updateCustomTheme(updated);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-6xl">
        <PublishBar />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
              Appearance & Theme Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Switch curated Apple-inspired presets or tune bespoke design tokens with live synchronization.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/__dev/device-preview" target="_blank">
              <Button size="sm" variant="glass" className="text-xs">
                <Smartphone className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                Preview in iPhone
              </Button>
            </Link>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Theme draft saved! Click &quot;Publish Changes Live&quot; to apply to public visitors.</span>
          </div>
        )}

        {/* 1. Theme Presets Picker */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <Palette className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white font-display">
              1. Curated Luxury Theme Presets
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(THEME_PRESETS).map((preset) => {
              const isSelected = currentTheme.preset_key === preset.preset_key;
              return (
                <div
                  key={preset.preset_key}
                  onClick={() => handleSelectPreset(preset.preset_key)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-sky-500/15 border-sky-400 shadow-lg shadow-sky-500/20"
                      : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-white">{preset.name}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                  </div>

                  {/* Swatches */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <div
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: preset.colors.background }}
                      title="Background"
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: preset.colors.surface }}
                      title="Surface"
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: preset.colors.primary }}
                      title="Primary"
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: preset.colors.accent }}
                      title="Accent"
                    />
                  </div>

                  <p className="text-[11px] text-slate-400">
                    {preset.styling.dark_mode ? "Dark Mode" : "Light Mode"} • {preset.styling.border_radius} radius
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Side-by-Side Live Component Preview & Fine Tuning */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Live Interactive Component Preview Box */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-sky-400" />
                <h2 className="text-base font-bold text-white font-display">
                  Live UI Component Test Bench
                </h2>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">Realtime Tokens</span>
            </div>

            {/* Test Card */}
            <div
              className="p-6 rounded-2xl border transition-all space-y-4"
              style={{
                backgroundColor: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border_subtle,
              }}
            >
              <div className="flex items-center justify-between">
                <Badge variant="cyan">Sample Experience Card</Badge>
                <span className="text-xs font-mono font-bold" style={{ color: currentTheme.colors.primary }}>
                  €120
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold" style={{ color: currentTheme.colors.text_primary }}>
                  Nocturnal Fluorescence Reef
                </h3>
                <p className="text-xs mt-1" style={{ color: currentTheme.colors.text_muted }}>
                  Ultraviolet illumination of coral formations with private dive guides.
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <Button variant="glass" size="sm">
                  Secondary Action
                </Button>
                <Button variant="primary" size="sm">
                  Reserve Expedition
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Design Token Fine Tuner */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white font-display">
                Fine-Tune Design Tokens
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentTheme.colors.primary.startsWith("#") ? currentTheme.colors.primary : "#0ea5e9"}
                      onChange={(e) => handleUpdateCustomColor("primary", e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono text-slate-300">
                      {currentTheme.colors.primary}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentTheme.colors.background.startsWith("#") ? currentTheme.colors.background : "#040914"}
                      onChange={(e) => handleUpdateCustomColor("background", e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono text-slate-300">
                      {currentTheme.colors.background}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Corner Border Radius"
                  value={currentTheme.styling.border_radius}
                  onChange={(e) => handleUpdateStyling("border_radius", e.target.value)}
                  options={[
                    { label: "Small (6px)", value: "sm" },
                    { label: "Medium (12px)", value: "md" },
                    { label: "Luxury Large (20px)", value: "lg" },
                    { label: "Ultra Round (28px)", value: "xl" },
                  ]}
                />

                <Select
                  label="Section Spacing"
                  value={currentTheme.styling.section_spacing}
                  onChange={(e) => handleUpdateStyling("section_spacing", e.target.value)}
                  options={[
                    { label: "Spacious (Apple Editorial)", value: "spacious" },
                    { label: "Normal (Standard)", value: "normal" },
                    { label: "Compact", value: "compact" },
                  ]}
                />
              </div>

              <Select
                label="Frosted Glass Intensity"
                value={currentTheme.styling.glass_intensity}
                onChange={(e) => handleUpdateStyling("glass_intensity", e.target.value)}
                options={[
                  { label: "Subtle (Crisp)", value: "subtle" },
                  { label: "Medium (Luxury Apple)", value: "medium" },
                  { label: "Heavy (Deep Blur)", value: "heavy" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
