import React from "react";
import { Shield, Sparkles, Users, Award, Radio, Heart } from "lucide-react";
import { HomepageSection } from "@/lib/types";

export function WhyUsSection({ section }: { section?: HomepageSection }) {
  const title = section?.title || "Engineered for Safety & Serenity";
  const subtitle =
    section?.subtitle ||
    "Every detail of our sanctuary is engineered around personal space, elite equipment, and uncompromising marine safety.";
  const badge = section?.badge || "The Sanctuary Difference";

  return (
    <section id="why-us" className="section-spacious relative bg-slate-950/90 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {badge}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            {title}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-3 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Card 1: Ratio (Large Bento) */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-white/10 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[90px] pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-4xl font-extrabold text-white font-mono block mb-2 tracking-tight">
                1 : 2 Private Ratio
              </span>
              <h3 className="text-xl font-bold text-white mb-2 font-display">
                Intimate Diver Pacing
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                We never herd divers in crowded packs. Certified dives operate at a maximum of 4 divers per guide, and student training strictly maintains a 1:2 instructor ratio.
              </p>
            </div>
          </div>

          {/* Card 2: Gear */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-6">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">
                Current-Season Gear
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Brand new Scubapro & Aqualung regulators, computers, and BCDs maintained to Swiss precision standards.
              </p>
            </div>
          </div>

          {/* Card 3: Satellite Safety */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">
                Satellite SOS Safety
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                All catamarans equipped with Garmin inReach SOS, 100% emergency oxygen redundancy, and first-aid response kits.
              </p>
            </div>
          </div>

          {/* Card 4: Marine Conservation */}
          <div className="md:col-span-2 lg:col-span-4 p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-slate-950/90 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  100% Coral Reef Protection Pledge
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  We enforce zero-touch reef policies, provide reef-safe sunscreen on all vessels, and actively participate in Red Sea nursery preservation projects.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
                Eco-Certified Operator
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
