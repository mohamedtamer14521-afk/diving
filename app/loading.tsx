import React from "react";
import { Compass } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#040914] text-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative flex flex-col items-center space-y-4 z-10 animate-in fade-in duration-500">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-400 p-[1px] shadow-glow-cyan flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
            <Compass className="w-7 h-7 text-cyan-400 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm font-bold tracking-widest text-white uppercase font-display">
            Diving Vision Center
          </p>
          <p className="text-xs text-cyan-400 font-mono mt-1">
            Preparing Sanctuary Expeditions...
          </p>
        </div>
      </div>
    </div>
  );
}
