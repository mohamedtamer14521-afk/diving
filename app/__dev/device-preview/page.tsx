"use client";

import React, { useState } from "react";
import { DeviceControls, DEVICE_PRESETS, DevicePreset } from "@/components/device-preview/device-controls";
import { IPhoneFrame } from "@/components/device-preview/iphone-frame";

export default function DevicePreviewPage() {
  const [currentPreset, setCurrentPreset] = useState<DevicePreset>(DEVICE_PRESETS[0]);
  const [isLandscape, setIsLandscape] = useState(false);
  const [scale, setScale] = useState(0.9);
  const [showSafeArea, setShowSafeArea] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("/");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-[#050a14] to-[#02050b] flex flex-col items-center justify-center p-4 pt-24 pb-12 overflow-hidden relative select-none">
      {/* Ambient Ocean Glows in background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Dev Controls Header Bar */}
      <DeviceControls
        currentPreset={currentPreset}
        onSelectPreset={setCurrentPreset}
        isLandscape={isLandscape}
        onToggleOrientation={() => setIsLandscape(!isLandscape)}
        scale={scale}
        onScaleChange={setScale}
        showSafeArea={showSafeArea}
        onToggleSafeArea={() => setShowSafeArea(!showSafeArea)}
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
        onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
      />

      {/* Main Center Stage: Live Phone Simulator */}
      <main className="relative z-10 flex items-center justify-center my-auto">
        <IPhoneFrame
          preset={currentPreset}
          isLandscape={isLandscape}
          scale={scale}
          showSafeArea={showSafeArea}
          route={currentRoute}
          refreshTrigger={refreshTrigger}
        />
      </main>
    </div>
  );
}
