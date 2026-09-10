"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, Maximize2, X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { DataStore } from "@/lib/data-store";
import { GalleryItem, HomepageSection } from "@/lib/types";
import { DEFAULT_GALLERY } from "@/lib/business-config";

export function GallerySection({
  section,
  initialItems,
}: {
  section?: HomepageSection;
  initialItems?: GalleryItem[];
}) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems || DEFAULT_GALLERY);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!initialItems) {
      setItems(DataStore.getGallery());
    }

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (
        customEvent.detail &&
        (customEvent.detail.key === "diving_vision_gallery" ||
          customEvent.detail.key === "aura_oceanics_gallery")
      ) {
        setItems(DataStore.getGallery());
      }
    };
    window.addEventListener("store-sync", handleSync);
    return () => window.removeEventListener("store-sync", handleSync);
  }, [initialItems]);

  const categories = ["All", "Reef", "Marine Life", "Wrecks", "Expeditions"];

  const filteredItems =
    activeCategory === "All" ? items : items.filter((item) => item.category === activeCategory);

  const title = section?.title || "Through the Lens of the Deep";
  const subtitle =
    section?.subtitle || "Unretouched moments captured across our signature dive sites.";
  const badge = section?.badge || "Underwater Gallery";

  const currentLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="gallery" className="section-spacious relative bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">
              <Camera className="w-3.5 h-3.5" />
              {badge}
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
              {title}
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mt-2 max-w-xl font-light">
              {subtitle}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold shadow-md shadow-sky-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative h-80 rounded-3xl overflow-hidden bg-slate-900 border border-white/10 cursor-pointer apple-card-hover"
            >
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Bottom Caption on Hover */}
              <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="flex items-center justify-between text-xs text-cyan-400 font-mono mb-1">
                  <span>{item.category}</span>
                  {item.location && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {item.location}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white font-display">{item.title}</h3>
                {item.caption && <p className="text-xs text-slate-400 mt-1 line-clamp-1">{item.caption}</p>}
              </div>

              {/* Maximize Icon */}
              <div className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {currentLightboxItem && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev / Next controls */}
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Active Image and details */}
          <div className="max-w-5xl w-full flex flex-col items-center">
            <div className="relative w-full h-[65vh] sm:h-[75vh] rounded-3xl overflow-hidden border border-white/15">
              <Image
                src={currentLightboxItem.image_url}
                alt={currentLightboxItem.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-center max-w-2xl">
              <h4 className="text-lg font-bold text-white font-display">
                {currentLightboxItem.title}
              </h4>
              {currentLightboxItem.caption && (
                <p className="text-sm text-slate-400 mt-1">{currentLightboxItem.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
