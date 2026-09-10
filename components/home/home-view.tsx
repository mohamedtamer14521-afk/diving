"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { CinematicHero } from "@/components/hero/cinematic-hero";
import { NarrativeSection } from "@/components/sections/narrative-section";
import { ActivitiesSection } from "@/components/sections/activities-section";
import { CoursesSection } from "@/components/sections/courses-section";
import { TripsSection } from "@/components/sections/trips-section";
import { WhyUsSection } from "@/components/sections/why-us-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { FAQSection } from "@/components/sections/faqs-section";
import { BookingSection } from "@/components/sections/booking-section";
import { FloatingWhatsApp } from "@/components/whatsapp/floating-whatsapp";
import { DataStore } from "@/lib/data-store";
import {
  BusinessSettings,
  HomepageSection,
  Activity,
  Course,
  Trip,
  GalleryItem,
  Review,
  FAQ,
} from "@/lib/types";

interface HomeViewProps {
  initialSettings: BusinessSettings;
  initialSections: HomepageSection[];
  initialActivities: Activity[];
  initialCourses: Course[];
  initialTrips: Trip[];
  initialGallery: GalleryItem[];
  initialReviews: Review[];
  initialFaqs: FAQ[];
}

export function HomeView({
  initialSettings,
  initialSections,
  initialActivities,
  initialCourses,
  initialTrips,
  initialGallery,
  initialReviews,
  initialFaqs,
}: HomeViewProps) {
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [sections, setSections] = useState<HomepageSection[]>(initialSections);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);

  const [prefilledBookingItem, setPrefilledBookingItem] = useState<string>("");

  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      const key = customEvent.detail?.key;
      if (!key) return;

      if (key === "diving_vision_settings" || key === "aura_oceanics_settings") {
        setSettings(DataStore.getSettings());
      } else if (key === "diving_vision_sections" || key === "aura_oceanics_sections") {
        setSections(DataStore.getSections());
      } else if (key === "diving_vision_activities" || key === "aura_oceanics_activities") {
        setActivities(DataStore.getActivities());
      } else if (key === "diving_vision_courses" || key === "aura_oceanics_courses") {
        setCourses(DataStore.getCourses());
      } else if (key === "diving_vision_trips" || key === "aura_oceanics_trips") {
        setTrips(DataStore.getTrips());
      } else if (key === "diving_vision_gallery" || key === "aura_oceanics_gallery") {
        setGallery(DataStore.getGallery());
      } else if (key === "diving_vision_reviews" || key === "aura_oceanics_reviews") {
        setReviews(DataStore.getReviews());
      } else if (key === "diving_vision_faqs" || key === "aura_oceanics_faqs") {
        setFaqs(DataStore.getFaqs());
      }
    };

    window.addEventListener("store-sync", handleSync);
    return () => window.removeEventListener("store-sync", handleSync);
  }, []);

  const handleSelectItemForBooking = (title: string) => {
    setPrefilledBookingItem(title);
    const bookingEl = document.getElementById("booking");
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Map section keys to components
  const renderSection = (sec: HomepageSection) => {
    if (!sec.is_enabled) return null;

    switch (sec.section_key) {
      case "hero":
        return (
          <CinematicHero
            key={sec.id}
            section={sec}
            businessSettings={settings}
            onOpenBooking={() => handleSelectItemForBooking("")}
          />
        );
      case "narrative":
        return <NarrativeSection key={sec.id} section={sec} />;
      case "activities":
        return (
          <ActivitiesSection
            key={sec.id}
            section={sec}
            initialActivities={activities}
            onSelectActivity={handleSelectItemForBooking}
          />
        );
      case "courses":
        return (
          <CoursesSection
            key={sec.id}
            section={sec}
            initialCourses={courses}
            onSelectCourse={handleSelectItemForBooking}
          />
        );
      case "trips":
        return (
          <TripsSection
            key={sec.id}
            section={sec}
            initialTrips={trips}
            onSelectTrip={handleSelectItemForBooking}
          />
        );
      case "why-us":
        return <WhyUsSection key={sec.id} section={sec} />;
      case "gallery":
        return <GallerySection key={sec.id} section={sec} initialItems={gallery} />;
      case "reviews":
        return <ReviewsSection key={sec.id} section={sec} initialReviews={reviews} />;
      case "faqs":
        return <FAQSection key={sec.id} section={sec} initialFaqs={faqs} />;
      case "booking":
        return (
          <BookingSection
            key={sec.id}
            section={sec}
            businessSettings={settings}
            initialActivities={activities}
            initialCourses={courses}
            initialTrips={trips}
            prefilledItemTitle={prefilledBookingItem}
          />
        );
      default:
        return null;
    }
  };

  // Sort enabled sections by display_order
  const sortedSections = [...sections]
    .filter((s) => s.is_enabled)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="min-h-screen bg-[#040914] text-slate-100 flex flex-col justify-between">
      <Navbar
        initialSettings={settings}
        onOpenBooking={() => handleSelectItemForBooking("")}
      />

      <main className="flex-1">
        {sortedSections.map((sec) => renderSection(sec))}
      </main>

      <Footer initialSettings={settings} />

      <FloatingWhatsApp initialSettings={settings} />
    </div>
  );
}
