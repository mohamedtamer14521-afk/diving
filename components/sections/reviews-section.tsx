"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquareQuote, CheckCircle } from "lucide-react";
import { DataStore } from "@/lib/data-store";
import { Review, HomepageSection } from "@/lib/types";
import { DEFAULT_REVIEWS } from "@/lib/business-config";

export function ReviewsSection({
  section,
  initialReviews,
}: {
  section?: HomepageSection;
  initialReviews?: Review[];
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews || DEFAULT_REVIEWS);

  useEffect(() => {
    if (!initialReviews) {
      setReviews(DataStore.getReviews());
    }

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (
        customEvent.detail &&
        (customEvent.detail.key === "diving_vision_reviews" ||
          customEvent.detail.key === "aura_oceanics_reviews")
      ) {
        setReviews(DataStore.getReviews());
      }
    };
    window.addEventListener("store-sync", handleSync);
    return () => window.removeEventListener("store-sync", handleSync);
  }, [initialReviews]);

  const title = section?.title || "Voices from the Depths";
  const subtitle =
    section?.subtitle ||
    "Authentic testimonials from certified divers, students, and private charter guests.";
  const badge = section?.badge || "Verified Guest Experiences";

  return (
    <section id="reviews" className="section-spacious relative bg-slate-950/80 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            {badge}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            {title}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-3 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Empty State */}
        {reviews.length === 0 && (
          <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/10 text-center max-w-md mx-auto">
            <p className="text-slate-400 text-sm">Guest reviews are currently undergoing annual verification moderation.</p>
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl flex flex-col justify-between apple-card-hover"
            >
              <div>
                {/* Rating Stars & Source */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  {rev.is_verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" /> Verified Guest
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                  &ldquo;{rev.review_text}&rdquo;
                </p>
              </div>

              {/* Author Details */}
              <div className="pt-4 border-t border-white/5">
                <h4 className="text-base font-bold text-white font-display">{rev.author_name}</h4>
                {rev.diver_certification && (
                  <p className="text-xs text-cyan-400 mt-0.5">{rev.diver_certification}</p>
                )}
                {rev.trip_or_course && (
                  <p className="text-[11px] text-slate-500 mt-1">{rev.trip_or_course}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
