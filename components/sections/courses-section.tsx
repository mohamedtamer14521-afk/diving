"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Check, ShieldCheck, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { DataStore } from "@/lib/data-store";
import { Course, HomepageSection } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { DEFAULT_COURSES } from "@/lib/business-config";

interface CoursesSectionProps {
  section?: HomepageSection;
  initialCourses?: Course[];
  onSelectCourse?: (courseTitle: string) => void;
}

export function CoursesSection({ section, initialCourses, onSelectCourse }: CoursesSectionProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses || DEFAULT_COURSES);
  const [activeModalCourse, setActiveModalCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (!initialCourses) {
      setCourses(DataStore.getCourses());
    }

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (
        customEvent.detail &&
        (customEvent.detail.key === "diving_vision_courses" ||
          customEvent.detail.key === "aura_oceanics_courses")
      ) {
        setCourses(DataStore.getCourses());
      }
    };
    window.addEventListener("store-sync", handleSync);
    return () => window.removeEventListener("store-sync", handleSync);
  }, [initialCourses]);

  const title = section?.title || "International Master Training";
  const subtitle =
    section?.subtitle ||
    "World-recognized PADI & SSI certifications with private 1:2 instructor ratios and digital e-Learning.";
  const badge = section?.badge || "Diver Education";

  return (
    <section id="courses" className="section-spacious relative bg-slate-950/80 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            {badge}
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            {title}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-3 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group relative rounded-3xl bg-slate-900/50 border border-white/10 overflow-hidden backdrop-blur-xl flex flex-col justify-between apple-card-hover"
            >
              {/* Image Preview */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={course.featured_image}
                  alt={course.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Agency Pill */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-xs font-bold text-white tracking-wider">
                    {course.certification_agency}
                  </span>
                </div>

                {/* Duration */}
                <div className="absolute bottom-3 left-3 text-xs text-slate-300 font-mono">
                  {course.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 block mb-1">
                    {course.level}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 font-display group-hover:text-cyan-300 transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {course.short_description}
                  </p>

                  {/* Highlights */}
                  {course.learning_outcomes.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      {course.learning_outcomes.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Price & CTA */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-white font-mono">
                      {formatCurrency(course.price)}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="glass"
                    onClick={() => setActiveModalCourse(course)}
                  >
                    Curriculum &rarr;
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Detail Modal */}
      {activeModalCourse && (
        <Modal
          isOpen={!!activeModalCourse}
          onClose={() => setActiveModalCourse(null)}
          title={activeModalCourse.title}
          subtitle={`${activeModalCourse.certification_agency} • ${activeModalCourse.level}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="relative h-60 w-full rounded-2xl overflow-hidden border border-white/10">
              <Image
                src={activeModalCourse.featured_image}
                alt={activeModalCourse.title}
                fill
                className="object-cover"
              />
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{activeModalCourse.description}</p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
              <div>
                <span className="text-slate-400 block">Duration:</span>
                <span className="font-semibold text-white mt-0.5 block">{activeModalCourse.duration}</span>
              </div>
              {activeModalCourse.max_depth && (
                <div>
                  <span className="text-slate-400 block">Max Depth:</span>
                  <span className="font-semibold text-cyan-300 mt-0.5 block">{activeModalCourse.max_depth}</span>
                </div>
              )}
              {activeModalCourse.minimum_age && (
                <div>
                  <span className="text-slate-400 block">Minimum Age:</span>
                  <span className="font-semibold text-white mt-0.5 block">{activeModalCourse.minimum_age} Years</span>
                </div>
              )}
            </div>

            {/* Prerequisites */}
            {activeModalCourse.prerequisites && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Prerequisites:</strong> {activeModalCourse.prerequisites}
                </span>
              </div>
            )}

            {/* Learning Outcomes */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-3">
                Key Skills & Syllabus
              </h4>
              <div className="space-y-2">
                {activeModalCourse.learning_outcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-white font-mono">
                  {formatCurrency(activeModalCourse.price)}
                </span>
                {activeModalCourse.price_note && (
                  <p className="text-xs text-slate-400">{activeModalCourse.price_note}</p>
                )}
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  const title = activeModalCourse.title;
                  setActiveModalCourse(null);
                  if (onSelectCourse) {
                    onSelectCourse(title);
                  } else {
                    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Enroll In Academy
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
