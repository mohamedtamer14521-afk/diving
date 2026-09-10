import React from "react";
import { ShieldCheck, Anchor, HeartHandshake, Eye } from "lucide-react";
import { HomepageSection } from "@/lib/types";

export function NarrativeSection({ section }: { section?: HomepageSection }) {
  const title = section?.title || "Where oceanic majesty meets understated precision.";
  const subtitle =
    section?.subtitle ||
    "We believe diving should be an unhurried, private, and deeply transformative encounter with the deep.";
  const badge = section?.badge || "The Sanctuary Standard";

  const pillars = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
      title: "Zero Compromise Safety",
      description: "Redundant high-oxygen blend analyzers, emergency satellite SOS beacons on all vessels, and certified technical divemaster supervision.",
    },
    {
      icon: <Anchor className="w-6 h-6 text-sky-400" />,
      title: "Private Custom Vessels",
      description: "Our 32-meter custom catamarans limit passenger counts to a third of standard capacity, guaranteeing vast deck space and calm briefings.",
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-emerald-400" />,
      title: "Active Marine Stewardship",
      description: "10% of all expedition proceeds directly fund coral reef rehabilitation and artificial nursery nurseries in the Red Sea reserve.",
    },
  ];

  return (
    <section id="narrative" className="section-spacious relative bg-slate-950/60 border-y border-white/5 overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/5 blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">
            <Eye className="w-3.5 h-3.5" />
            {badge}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-display mb-6">
            {title}
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed font-light">
            {subtitle}
          </p>
        </div>

        {/* 3 Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight font-display">
                {pillar.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
