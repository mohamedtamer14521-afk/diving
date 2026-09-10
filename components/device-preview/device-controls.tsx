"use client";

import React from "react";
import {
  Smartphone,
  RotateCw,
  RefreshCw,
  Sun,
  Moon,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  Shield,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DevicePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  bezelRadius: number;
  screenRadius: number;
}

export const DEVICE_PRESETS: DevicePreset[] = [
  {
    id: "iphone-15-pro",
    name: "iPhone 15/16 Pro",
    width: 393,
    height: 852,
    bezelRadius: 54,
    screenRadius: 46,
  },
  {
    id: "iphone-standard",
    name: "iPhone Standard",
    width: 390,
    height: 844,
    bezelRadius: 50,
    screenRadius: 44,
  },
  {
    id: "iphone-pro-max",
    name: "iPhone Pro Max (Large)",
    width: 430,
    height: 932,
    bezelRadius: 56,
    screenRadius: 48,
  },
  {
    id: "iphone-se",
    name: "Compact Phone (Small)",
    width: 375,
    height: 667,
    bezelRadius: 44,
    screenRadius: 36,
  },
];

interface DeviceControlsProps {
  currentPreset: DevicePreset;
  onSelectPreset: (preset: DevicePreset) => void;
  isLandscape: boolean;
  onToggleOrientation: () => void;
  scale: number;
  onScaleChange: (scale: number) => void;
  showSafeArea: boolean;
  onToggleSafeArea: () => void;
  currentRoute: string;
  onRouteChange: (route: string) => void;
  onRefresh: () => void;
}

export function DeviceControls({
  currentPreset,
  onSelectPreset,
  isLandscape,
  onToggleOrientation,
  scale,
  onScaleChange,
  showSafeArea,
  onToggleSafeArea,
  currentRoute,
  onRouteChange,
  onRefresh,
}: DeviceControlsProps) {
  const routes = [
    { label: "Homepage (/) ", path: "/" },
    { label: "Activities (#activities)", path: "/#activities" },
    { label: "Courses (#courses)", path: "/#courses" },
    { label: "Expeditions (#trips)", path: "/#trips" },
    { label: "Reservation (#booking)", path: "/#booking" },
    { label: "Admin Portal (/admin)", path: "/admin" },
  ];

  return (
    <header className="fixed top-4 inset-x-4 sm:inset-x-8 z-50 flex items-center justify-between p-3 px-5 rounded-2xl bg-slate-950/85 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/80">
      {/* Brand & Dev Flag */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-xs font-semibold">
          <Smartphone className="w-3.5 h-3.5" />
          <span>LIVE PHONE SIMULATOR</span>
        </div>
        <span className="hidden md:inline text-xs text-slate-400">
          Realtime interactive viewport
        </span>
      </div>

      {/* Center Controls */}
      <div className="flex items-center gap-2">
        {/* Preset Selector */}
        <select
          value={currentPreset.id}
          onChange={(e) => {
            const found = DEVICE_PRESETS.find((p) => p.id === e.target.value);
            if (found) onSelectPreset(found);
          }}
          className="bg-slate-900 border border-white/15 text-white text-xs font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400"
        >
          {DEVICE_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.width}x{p.height})
            </option>
          ))}
        </select>

        {/* Route Selector */}
        <select
          value={currentRoute}
          onChange={(e) => onRouteChange(e.target.value)}
          className="hidden lg:inline-block bg-slate-900 border border-white/15 text-white text-xs font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400"
        >
          {routes.map((r) => (
            <option key={r.path} value={r.path}>
              {r.label}
            </option>
          ))}
        </select>

        {/* Rotate Button */}
        <button
          onClick={onToggleOrientation}
          title="Rotate Device"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        {/* Refresh Iframe */}
        <button
          onClick={onRefresh}
          title="Reload Preview"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Safe Area Guide Toggle */}
        <button
          onClick={onToggleSafeArea}
          title="Toggle Safe Area Overlay"
          className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
            showSafeArea
              ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          Safe Area
        </button>

        {/* Zoom Controls */}
        <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
          <button
            onClick={() => onScaleChange(Math.max(0.6, scale - 0.1))}
            className="p-1 text-slate-400 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-300 px-1">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => onScaleChange(Math.min(1.2, scale + 0.1))}
            className="p-1 text-slate-400 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Open Direct Tab */}
      <div className="flex items-center gap-2">
        <a
          href={currentRoute}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors"
        >
          <span>Open Clean Tab</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
}
