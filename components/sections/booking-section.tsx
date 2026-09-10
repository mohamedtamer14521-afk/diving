"use client";

import React, { useState, useEffect } from "react";
import { Send, CheckCircle2, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { DataStore } from "@/lib/data-store";
import { HomepageSection, Activity, Course, Trip, BusinessSettings } from "@/lib/types";
import {
  DEFAULT_BUSINESS_SETTINGS,
  DEFAULT_ACTIVITIES,
  DEFAULT_COURSES,
  DEFAULT_TRIPS,
} from "@/lib/business-config";

interface BookingSectionProps {
  section?: HomepageSection;
  businessSettings?: BusinessSettings;
  initialActivities?: Activity[];
  initialCourses?: Course[];
  initialTrips?: Trip[];
  prefilledItemTitle?: string;
}

export function BookingSection({
  section,
  businessSettings,
  initialActivities,
  initialCourses,
  initialTrips,
  prefilledItemTitle,
}: BookingSectionProps) {
  const [settings, setSettings] = useState<BusinessSettings>(
    businessSettings || DEFAULT_BUSINESS_SETTINGS
  );
  const [activities, setActivities] = useState<Activity[]>(
    initialActivities || DEFAULT_ACTIVITIES
  );
  const [courses, setCourses] = useState<Course[]>(
    initialCourses || DEFAULT_COURSES
  );
  const [trips, setTrips] = useState<Trip[]>(
    initialTrips || DEFAULT_TRIPS
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interestType: "Activity" as "Activity" | "Course" | "Trip" | "Custom Private Charter" | "General Inquiry",
    itemTitle: prefilledItemTitle || "",
    preferredDate: "",
    participantsCount: 1,
    diverLevel: "Beginner (First Time)",
    specialRequests: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<{ id: string; reference_code?: string } | null>(null);

  useEffect(() => {
    if (!businessSettings) setSettings(DataStore.getSettings());
    if (!initialActivities) setActivities(DataStore.getActivities());
    if (!initialCourses) setCourses(DataStore.getCourses());
    if (!initialTrips) setTrips(DataStore.getTrips());

    const handleSync = () => {
      setActivities(DataStore.getActivities());
      setCourses(DataStore.getCourses());
      setTrips(DataStore.getTrips());
      setSettings(DataStore.getSettings());
    };
    window.addEventListener("store-sync", handleSync);
    return () => window.removeEventListener("store-sync", handleSync);
  }, [businessSettings, initialActivities, initialCourses, initialTrips]);

  useEffect(() => {
    if (prefilledItemTitle) {
      setFormData((prev) => ({ ...prev, itemTitle: prefilledItemTitle }));
    }
  }, [prefilledItemTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in your name, email, and phone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Post to Server API for unique reference generation (DV-XXXXXX)
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          interest_type: formData.interestType,
          item_title: formData.itemTitle || `${formData.interestType} Inquiry`,
          preferred_date: formData.preferredDate || new Date().toISOString().split("T")[0],
          participants_count: Number(formData.participantsCount),
          diver_level: formData.diverLevel,
          special_requests: formData.specialRequests,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmittedInquiry({
          id: data.inquiry.id,
          reference_code: data.reference_code || data.inquiry.id,
        });

        // Also add to local storage DataStore for admin view
        DataStore.addInquiry(data.inquiry);
      } else {
        // Fallback to local DataStore
        const fallback = DataStore.addInquiry({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          interest_type: formData.interestType,
          item_title: formData.itemTitle || `${formData.interestType} Inquiry`,
          preferred_date: formData.preferredDate || new Date().toISOString().split("T")[0],
          participants_count: Number(formData.participantsCount),
          diver_level: formData.diverLevel,
          special_requests: formData.specialRequests,
          status: "New",
        });
        setSubmittedInquiry({ id: fallback.id, reference_code: fallback.id });
      }
    } catch (err) {
      // Fallback
      const fallback = DataStore.addInquiry({
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        interest_type: formData.interestType,
        item_title: formData.itemTitle || `${formData.interestType} Inquiry`,
        preferred_date: formData.preferredDate || new Date().toISOString().split("T")[0],
        participants_count: Number(formData.participantsCount),
        diver_level: formData.diverLevel,
        special_requests: formData.specialRequests,
        status: "New",
      });
      setSubmittedInquiry({ id: fallback.id, reference_code: fallback.id });
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = section?.title || "Begin Your Descent";
  const subtitle =
    section?.subtitle ||
    "Reserve your private expedition slot or consult directly with our master dive planners.";
  const badge = section?.badge || "Direct Reservation";

  // Dynamic dropdown items based on selected category
  const getItemOptions = () => {
    if (formData.interestType === "Activity") {
      return activities.map((a) => ({ label: a.title, value: a.title }));
    }
    if (formData.interestType === "Course") {
      return courses.map((c) => ({ label: c.title, value: c.title }));
    }
    if (formData.interestType === "Trip") {
      return trips.map((t) => ({ label: t.title, value: t.title }));
    }
    return [
      { label: "Bespoke Private Catamaran Buyout", value: "Private Catamaran Buyout" },
      { label: "VIP Multi-Day Red Sea Safari", value: "VIP Multi-Day Safari" },
    ];
  };

  return (
    <section id="booking" className="section-spacious relative bg-slate-950/90 border-t border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-sky-600/10 blur-[180px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {badge}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            {title}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-3 font-light">
            {subtitle}
          </p>
        </div>

        {submittedInquiry ? (
          <div className="p-10 sm:p-14 rounded-3xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-2xl text-center space-y-6 animate-in zoom-in-95 duration-500 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white font-display">
                Expedition Request Received
              </h3>
              <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Our master dive concierge has received your request and will contact you via WhatsApp/Email shortly to confirm your booking.
              </p>
            </div>

            <div className="inline-block p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-cyan-300">
              Inquiry Reference: <strong>#{submittedInquiry.reference_code || submittedInquiry.id}</strong>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                onClick={() => {
                  setSubmittedInquiry(null);
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    interestType: "Activity",
                    itemTitle: "",
                    preferredDate: "",
                    participantsCount: 1,
                    diverLevel: "Beginner (First Time)",
                    specialRequests: "",
                  });
                }}
              >
                Submit Another Inquiry
              </Button>

              <button
                onClick={() => {
                  const cleanNumber = (settings.whatsapp_number || "201008924410").replace(/[^0-9]/g, "");
                  const ref = submittedInquiry.reference_code || submittedInquiry.id;
                  const text = encodeURIComponent(
                    `Hello ${settings.business_name}, I just submitted inquiry #${ref} regarding "${formData.itemTitle || formData.interestType}".`
                  );
                  window.open(`https://wa.me/${cleanNumber}?text=${text}`, "_blank");
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 p-2"
              >
                <MessageCircle className="w-4 h-4" /> Message Concierge on WhatsApp
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-8"
          >
            {/* Step 1: Selection Category */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400">
                1. Select Interest Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["Activity", "Course", "Trip", "Custom Private Charter"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, interestType: type, itemTitle: "" }));
                    }}
                    className={`py-3 px-4 rounded-2xl text-xs font-medium border transition-all text-center ${
                      formData.interestType === type
                        ? "bg-sky-500/20 border-sky-400 text-white font-bold shadow-lg shadow-sky-500/20"
                        : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Specific Experience Dropdown */}
            {getItemOptions().length > 0 && (
              <Select
                label="2. Preferred Experience or Course"
                options={[{ label: "Select specific program...", value: "" }, ...getItemOptions()]}
                value={formData.itemTitle}
                onChange={(e) => setFormData({ ...formData, itemTitle: e.target.value })}
              />
            )}

            {/* Step 3: Contact & Logistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Input
                label="Full Name *"
                placeholder="e.g. Alexander Vance"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <Input
                label="Email Address *"
                type="email"
                placeholder="e.g. diver@domain.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <Input
                label="WhatsApp / Phone *"
                placeholder="+20 100 000 0000"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* Step 4: Dates & Experience Level */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Input
                label="Preferred Date"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              />

              <Select
                label="Number of Divers / Guests"
                options={[
                  { label: "1 Diver", value: 1 },
                  { label: "2 Divers (Private Pair)", value: 2 },
                  { label: "3 Divers", value: 3 },
                  { label: "4 Divers (Private Group)", value: 4 },
                  { label: "5+ Divers (Charter)", value: 5 },
                ]}
                value={formData.participantsCount}
                onChange={(e) => setFormData({ ...formData, participantsCount: Number(e.target.value) })}
              />

              <Select
                label="Diver Experience Level"
                options={[
                  { label: "Beginner (First Time / Non-Certified)", value: "Beginner (First Time)" },
                  { label: "Open Water (1-20 Dives)", value: "Open Water (1-20 Dives)" },
                  { label: "Advanced / Rescue (20-100 Dives)", value: "Advanced / Rescue (20-100 Dives)" },
                  { label: "Master / Technical (100+ Dives)", value: "Master / Technical (100+ Dives)" },
                ]}
                value={formData.diverLevel}
                onChange={(e) => setFormData({ ...formData, diverLevel: e.target.value })}
              />
            </div>

            {/* Step 5: Special Requests */}
            <Textarea
              label="Special Notes, Nitrox Requests, or Gear Sizes"
              placeholder="Tell us about dietary preferences, camera gear, or required tank sizes (12L/15L Nitrox)..."
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            />

            {/* Submit CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                🔒 Direct inquiry. No payment is charged until itinerary is confirmed.
              </span>

              <Button
                type="submit"
                size="lg"
                variant="primary"
                isLoading={isSubmitting}
                className="w-full sm:w-auto px-10"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Reservation Request
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
