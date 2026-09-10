import React from "react";
import { ShieldCheck, Sparkles, Users, Award, Radio, Heart, Anchor, Waves } from "lucide-react";
import { HomepageSection } from "@/lib/types";

export function WhyUsSection({ section }: { section?: HomepageSection }) {
  const title = section?.title || "Engineered for Safety, Luxury & Conservation";
  const subtitle =
    section?.subtitle ||
    "Why divers from around the world choose Diving Vision as their premier home base in Sharm El-Sheikh.";
  const badge = section?.badge || "The Diving Vision Standard";

  return (
    <section id="why-us" className="py-24 relative bg-[#020713] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            {title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Card 1: Small Dive Groups */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/10 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[90px] pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono block mb-2 tracking-tight">
                Max 4 Divers / Guide
              </span>
              <h3 className="text-xl font-bold text-white mb-2 font-display">
                Intimate Diver Attention
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                We never herd divers in crowded packs. Guided boat dives maintain a strict maximum of 4 divers per guide, matched by experience level for calm, extended bottom times.
              </p>
            </div>
          </div>

          {/* Card 2: Premium Gear */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-6">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">
                Scubapro & Aqualung
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Fully serviced, top-tier balanced regulators, BCDs, and 5mm wetsuits maintained to European safety standards.
              </p>
            </div>
          </div>

          {/* Card 3: Safety & Oxygen */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">
                100% Medical O2 & VHF
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                All dive boats equipped with emergency medical oxygen kits, AED defibrillators, marine VHF radio, and first-aid kits.
              </p>
            </div>
          </div>

          {/* Card 4: Marine Conservation */}
          <div className="md:col-span-2 lg:col-span-4 p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  100% Red Sea Coral Reef Protection Pledge
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  We enforce strict zero-touch reef policies, promote reef-safe practices on all our yachts, and support South Sinai marine reserve preservation.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-mono text-cyan-300 font-bold">
                PADI Green Star Certified
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
