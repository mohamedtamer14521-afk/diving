"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Ship, Clock, Waves, ArrowRight, CheckCircle } from "lucide-react";
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
    if (!initialTrips) {
      setTrips(DataStore.getTrips());
    }

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (
        customEvent.detail &&
        (customEvent.detail.key === "diving_vision_trips" ||
          customEvent.detail.key === "aura_oceanics_trips")
      ) {
        setTrips(DataStore.getTrips());
      }
    };
    window.addEventListener("store-sync", handleSync);
    return () => window.removeEventListener("store-sync", handleSync);
  }, [initialTrips]);

  const title = section?.title || "Day Expeditions & Safaris";
  const subtitle =
    section?.subtitle ||
    "Explore remote drop-offs, historic shipwrecks, and protected marine reserves aboard custom luxury catamarans.";
  const badge = section?.badge || "Sea Voyages";

  return (
    <section id="trips" className="section-spacious relative bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">
              <Ship className="w-3.5 h-3.5" />
              {badge}
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
              {title}
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mt-2 max-w-2xl font-light">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="group relative rounded-3xl bg-slate-900/60 border border-white/10 overflow-hidden backdrop-blur-xl flex flex-col justify-between apple-card-hover"
            >
              {/* Image Preview */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={trip.featured_image}
                  alt={trip.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                <div className="absolute top-4 left-4">
                  <Badge variant="cyan">{trip.destination}</Badge>
                </div>

                <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-white font-mono text-sm font-semibold">
                  {formatCurrency(trip.price)}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-2 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {trip.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Waves className="w-3.5 h-3.5 text-sky-400" />
                      {trip.dives_included} Dives Included
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 font-display tracking-tight group-hover:text-cyan-300 transition-colors">
                    {trip.title}
                  </h3>

                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {trip.description}
                  </p>

                  {/* Highlights */}
                  {trip.boat_name && (
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 flex items-center gap-2 mb-4">
                      <Ship className="w-4 h-4 text-sky-400 flex-shrink-0" />
                      <span className="line-clamp-1">{trip.boat_name}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveModalTrip(trip)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    View Itinerary
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      if (onSelectTrip) {
                        onSelectTrip(trip.title);
                      } else {
                        document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    Reserve Voyage
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trip Itinerary Modal */}
      {activeModalTrip && (
        <Modal
          isOpen={!!activeModalTrip}
          onClose={() => setActiveModalTrip(null)}
          title={activeModalTrip.title}
          subtitle={`${activeModalTrip.destination} • ${activeModalTrip.duration}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="relative h-60 w-full rounded-2xl overflow-hidden border border-white/10">
              <Image
                src={activeModalTrip.featured_image}
                alt={activeModalTrip.title}
                fill
                className="object-cover"
              />
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{activeModalTrip.description}</p>

            {/* Timeline Itinerary */}
            {activeModalTrip.itinerary.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-4">
                  Expedition Schedule & Itinerary
                </h4>
                <div className="relative pl-6 space-y-4 border-l border-white/15 ml-2">
                  {activeModalTrip.itinerary.map((item, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-glow-cyan" />
                      <span className="text-xs font-mono font-bold text-white block">{item.time}</span>
                      <p className="text-xs text-slate-300 mt-0.5">{item.activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meals & Amenities */}
            {activeModalTrip.meals_included.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">
                  On-Board Dining & Amenities
                </h4>
                <div className="space-y-1.5">
                  {activeModalTrip.meals_included.map((meal, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{meal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-white font-mono">
                  {formatCurrency(activeModalTrip.price)}
                </span>
                <span className="text-xs text-slate-400 block">per diver / full day</span>
              </div>

              <Button
                variant="primary"
                size="md"
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
                Inquire For This Trip
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
