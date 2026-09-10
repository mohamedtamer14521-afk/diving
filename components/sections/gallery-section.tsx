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
    if (initialItems) {
      setItems(initialItems);
    } else {
      setItems(DataStore.getGallery());
    }

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && (customEvent.detail.key === "diving_vision_gallery" || customEvent.detail.key === "aura_oceanics_gallery")) {
        setItems(DataStore.getGallery());
      }
    };
    window.addEventListener("store-sync", handleSync);
    return () => window.removeEventListener("store-sync", handleSync);
  }, [initialItems]);

  const categories = ["All", "Coral Reefs", "Shipwrecks", "Marine Encounters", "Boat Safaris", "Pelagic Life"];

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory || activeCategory === "All");

  const title = section?.title || "Moments from the Red Sea Abyss";
  const subtitle =
    section?.subtitle ||
    "Real underwater encounters captured during our daily safaris in Ras Mohammed, Tiran, and Dahab.";
  const badge = section?.badge || "Underwater Photo Gallery";

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
    <section id="gallery" className="py-24 relative bg-[#020610] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">
              <Camera className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
              {title}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2.5 max-w-xl font-light">
              {subtitle}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
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
              className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer border border-white/10 bg-slate-900/60 shadow-xl"
            >
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <Maximize2 className="w-4 h-4" />
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                  {item.category}
                </span>
                <h3 className="text-base font-bold text-white font-display truncate">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-xs text-slate-300 truncate mt-0.5">{item.caption}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {currentLightboxItem && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10 hidden sm:block"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10 hidden sm:block"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center">
            <div className="relative w-full h-[60vh] sm:h-[70vh] rounded-2xl overflow-hidden border border-white/15">
              <Image
                src={currentLightboxItem.image_url}
                alt={currentLightboxItem.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-bold text-white">{currentLightboxItem.title}</h3>
              {currentLightboxItem.caption && (
                <p className="text-xs text-slate-400 mt-1">{currentLightboxItem.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
