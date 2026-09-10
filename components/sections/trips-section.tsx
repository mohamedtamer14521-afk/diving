"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Ship, Clock, Waves, ArrowRight, CheckCircle2, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { DataStore } from "@/lib/data-store";
import { Trip, HomepageSection } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { DEFAULT_TRIPS } from "@/lib/business-config";

interface TripsSectionProps {
  section?: HomepageSection;
  initialTrips?: Trip[];
  onSelectTrip?: (tripTitle: string) => void;
}

export function TripsSection({ section, initialTrips, onSelectTrip }: TripsSectionProps) {
  const [trips, setTrips] = useState<Trip[]>(initialTrips || DEFAULT_TRIPS);
  const [activeModalTrip, setActiveModalTrip] = useState<Trip | null>(null);

  useEffect(() => {
    if (initialTrips) {
      setTrips(initialTrips);
    } else {
      setTrips(DataStore.getTrips());
    }

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && (customEvent.detail.key === "diving_vision_trips" || customEvent.detail.key === "aura_oceanics_trips")) {
        setTrips(DataStore.getTrips());
      }
    };
    window.addEventListener("store-sync", handleSync);
    return () => window.removeEventListener("store-sync", handleSync);
  }, [initialTrips]);

  const title = section?.title || "Daily Boat Safaris & Wreck Expeditions";
  const subtitle =
    section?.subtitle ||
    "Cruise aboard our spacious double-deck dive yachts with freshly prepared hot lunch, shade sundecks, and top-tier safety gear.";
  const badge = section?.badge || "Red Sea Boat Safaris";

  return (
    <section id="trips" className="py-24 relative bg-[#030816] overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">
              <Ship className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
              {title}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2.5 max-w-2xl font-light">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {trips.map((trip) => {
            const imgSrc =
              trip.image_url ||
              trip.featured_image ||
              "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop";

            return (
              <div
                key={trip.id}
                className="group relative rounded-3xl bg-slate-900/60 border border-white/10 overflow-hidden backdrop-blur-xl flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-300 shadow-xl"
              >
                {/* Image Preview */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={trip.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-cyan-300 text-xs font-semibold font-mono">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {trip.destination}
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4 px-4 py-1.5 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 text-white font-mono text-sm font-bold shadow-lg">
                    {formatCurrency(trip.price, trip.currency || "EUR")}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-2.5 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {trip.duration}
                      </span>
                      {trip.boat_name && (
                        <span className="flex items-center gap-1.5">
                          <Ship className="w-3.5 h-3.5 text-sky-400" />
                          {trip.boat_name}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2.5 font-display tracking-tight group-hover:text-cyan-300 transition-colors">
                      {trip.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                      {trip.description}
                    </p>

                    {/* Highlights Preview */}
                    {trip.highlights && trip.highlights.length > 0 && (
                      <ul className="space-y-1.5 mb-5">
                        {trip.highlights.slice(0, 3).map((hl, i) => (
                          <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setActiveModalTrip(trip)}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      Trip Details & Schedule
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <Button
                      size="sm"
                      variant="primary"
                      className="font-bold shadow-md shadow-cyan-500/20"
                      onClick={() => {
                        if (onSelectTrip) {
                          onSelectTrip(trip.title);
                        } else {
                          const el = document.getElementById("booking");
                          el?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      Book Safari
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trip Modal */}
      {activeModalTrip && (
        <Modal
          isOpen={!!activeModalTrip}
          onClose={() => setActiveModalTrip(null)}
          title={activeModalTrip.title}
          subtitle={`${activeModalTrip.destination} • ${activeModalTrip.duration}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-white/10">
              <Image
                src={
                  activeModalTrip.image_url ||
                  activeModalTrip.featured_image ||
                  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop"
                }
                alt={activeModalTrip.title}
                fill
                className="object-cover"
              />
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{activeModalTrip.description}</p>

            {activeModalTrip.highlights && activeModalTrip.highlights.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-3">
                  Safari Inclusions & Highlights
                </h4>
                <ul className="space-y-2">
                  {activeModalTrip.highlights.map((hl, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeModalTrip.schedule_details && (
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-300">
                <span className="font-bold text-cyan-300 block mb-1">Departure Schedule:</span>
                <p>{activeModalTrip.schedule_details}</p>
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-lg font-bold text-white font-mono">
                {formatCurrency(activeModalTrip.price, activeModalTrip.currency || "EUR")}{" "}
                <span className="text-xs text-slate-400 font-normal">/ person</span>
              </span>

              <Button
                variant="primary"
                onClick={() => {
                  const title = activeModalTrip.title;
                  setActiveModalTrip(null);
                  if (onSelectTrip) {
                    onSelectTrip(title);
                  } else {
                    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Reserve This Trip
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
