"use client";

import React, { useRef, useState, useEffect } from "react";
import { Wifi, BatteryMedium, Signal } from "lucide-react";
import { DevicePreset } from "./device-controls";

interface IPhoneFrameProps {
  preset: DevicePreset;
  isLandscape: boolean;
  scale: number;
  showSafeArea: boolean;
  route: string;
  refreshTrigger: number;
}

export function IPhoneFrame({
  preset,
  isLandscape,
  scale,
  showSafeArea,
  route,
  refreshTrigger,
}: IPhoneFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [timeString, setTimeString] = useState("9:41");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const width = isLandscape ? preset.height : preset.width;
  const height = isLandscape ? preset.width : preset.height;
  const bezelPadding = 12;

  return (
    <div
      className="relative flex items-center justify-center transition-transform duration-300 origin-center"
      style={{
        transform: `scale(${scale})`,
      }}
    >
      {/* Physical Outer Chassis (Titanium Slate) */}
      <div
        className="relative bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 p-[12px] shadow-2xl transition-all duration-300"
        style={{
          width: width + bezelPadding * 2,
          height: height + bezelPadding * 2,
          borderRadius: preset.bezelRadius,
          boxShadow:
            "0 35px 80px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.18), inset 0 0 6px 2px rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Physical Side Buttons (Left) */}
        {!isLandscape && (
          <>
            {/* Action button */}
            <div className="absolute -left-[14px] top-28 w-[3px] h-7 bg-slate-600 rounded-l-md border-l border-white/20" />
            {/* Volume Up */}
            <div className="absolute -left-[14px] top-40 w-[3px] h-12 bg-slate-600 rounded-l-md border-l border-white/20" />
            {/* Volume Down */}
            <div className="absolute -left-[14px] top-56 w-[3px] h-12 bg-slate-600 rounded-l-md border-l border-white/20" />
            {/* Sleep / Power Button (Right) */}
            <div className="absolute -right-[14px] top-44 w-[3px] h-16 bg-slate-600 rounded-r-md border-r border-white/20" />
          </>
        )}

        {/* Screen Bezel (Matte Black Inner Frame) */}
        <div
          className="relative w-full h-full bg-black overflow-hidden flex flex-col justify-between select-none"
          style={{
            borderRadius: preset.screenRadius,
          }}
        >
          {/* Top Status Bar & Dynamic Island */}
          <div className="relative z-40 h-11 w-full flex items-center justify-between px-7 text-white text-[13px] font-semibold tracking-tight">
            {/* Time */}
            <span className="font-mono">{timeString}</span>

            {/* Dynamic Island Capsule */}
            {!isLandscape && (
              <div className="absolute left-1/2 -translate-x-1/2 top-2.5 h-[28px] w-[115px] bg-black rounded-full border border-white/10 flex items-center justify-between px-3 shadow-lg z-50">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-sky-950/80" />
              </div>
            )}

            {/* Status Icons */}
            <div className="flex items-center gap-2">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <BatteryMedium className="w-4 h-4" />
            </div>
          </div>

          {/* Safe Area Guide Overlay (If enabled) */}
          {showSafeArea && (
            <div className="absolute inset-0 z-30 pointer-events-none border-2 border-cyan-400/40 border-dashed rounded-[40px] m-2 flex flex-col justify-between p-4">
              <span className="text-[10px] font-mono text-cyan-400 bg-black/60 px-2 py-0.5 rounded self-start">
                Safe Area Top: 44px
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-black/60 px-2 py-0.5 rounded self-center">
                Safe Area Bottom: 34px
              </span>
            </div>
          )}

          {/* REAL LIVE APPLICATION IFRAME */}
          <div className="relative flex-1 w-full h-full overflow-hidden bg-slate-950">
            <iframe
              key={refreshTrigger}
              ref={iframeRef}
              src={route}
              title="Live Website Phone Viewport"
              className="w-full h-full border-0 bg-slate-950"
              style={{
                borderRadius: `0 0 ${preset.screenRadius}px ${preset.screenRadius}px`,
              }}
            />
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="relative z-40 h-5 w-full flex items-center justify-center pb-1 pointer-events-none">
            <div className="w-32 h-1 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
