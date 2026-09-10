"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle, ChevronDown, Search } from "lucide-react";
import { DataStore } from "@/lib/data-store";
import { FAQ, HomepageSection } from "@/lib/types";
import { DEFAULT_FAQS } from "@/lib/business-config";

export function FAQSection({
  section,
  initialFaqs,
}: {
  section?: HomepageSection;
  initialFaqs?: FAQ[];
}) {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs || DEFAULT_FAQS);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    if (!initialFaqs) {
      setFaqs(DataStore.getFaqs());
    }

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (
        customEvent.detail &&
        (customEvent.detail.key === "diving_vision_faqs" ||
          customEvent.detail.key === "aura_oceanics_faqs")
      ) {
        setFaqs(DataStore.getFaqs());
      }
    };
    window.addEventListener("store-sync", handleSync);
    return () => window.removeEventListener("store-sync", handleSync);
  }, [initialFaqs]);

  const categories = ["All", "General", "Equipment & Safety", "Trips & Booking"];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const title = section?.title || "Frequently Asked Questions";
  const subtitle =
    section?.subtitle ||
    "Clear answers regarding sanctuary logistics, gear requirements, and booking policies.";
  const badge = section?.badge || "Guest Inquiries";

  return (
    <section id="faqs" className="section-spacious relative bg-slate-950 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            {badge}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            {title}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-3 font-light">
            {subtitle}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-4 mb-10">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:bg-white/[0.07] transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-white/15 text-white border border-white/20"
                    : "text-slate-400 hover:text-white border border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-base font-semibold text-white font-display">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-cyan-400 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 border-t border-white/5 text-sm text-slate-300 leading-relaxed animate-in fade-in duration-300">
                    <p className="mt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
