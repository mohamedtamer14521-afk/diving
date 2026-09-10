"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Check, ShieldCheck, GraduationCap, ArrowRight, Clock, Award } from "lucide-react";
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
      if (customEvent.detail && customEvent.detail.key === "diving_vision_courses") {
        setCourses(DataStore.getCourses());
      }
    };
    window.addEventListener("store-sync", handleSync);
    return () => window.removeEventListener("store-sync", handleSync);
  }, [initialCourses]);

  const title = section?.title || "Certified PADI Courses & Specialties";
  const subtitle =
    section?.subtitle ||
    "Earn your lifetime international scuba certification in the warm, crystal-clear waters of Sharm El-Sheikh.";
  const badge = section?.badge || "PADI Diver Academy";

  return (
    <section id="courses" className="py-24 relative bg-[#030917] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
            {title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => {
            const imgSrc =
              course.image_url ||
              course.featured_image ||
              "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop";

            const durationText =
              course.duration || (course.duration_days ? `${course.duration_days} Days` : "Course");

            return (
              <div
                key={course.id}
                className="group relative rounded-3xl bg-slate-900/50 border border-white/10 overflow-hidden backdrop-blur-xl flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-300 shadow-xl"
              >
                {/* Image Preview */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={course.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Agency Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white tracking-wider uppercase">
                      {course.certification_agency || "PADI"}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-3 left-3 text-xs text-slate-300 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {durationText}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                      {course.level}
                    </span>

                    <h3 className="text-lg font-bold text-white mb-2 font-display tracking-tight group-hover:text-cyan-300 transition-colors">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                      {course.overview || course.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block text-[10px]">All-Inclusive</span>
                      <span className="text-lg font-bold text-white font-mono">
                        {formatCurrency(course.price, course.currency || "EUR")}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="primary"
                      className="font-bold text-xs shadow-md shadow-cyan-500/20"
                      onClick={() => {
                        setActiveModalCourse(course);
                      }}
                    >
                      Details & Enroll
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Course Modal */}
      {activeModalCourse && (
        <Modal
          isOpen={!!activeModalCourse}
          onClose={() => setActiveModalCourse(null)}
          title={activeModalCourse.title}
          subtitle={`${activeModalCourse.certification_agency || "PADI 5-Star"} • ${
            activeModalCourse.duration || `${activeModalCourse.duration_days} Days`
          }`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-white/10">
              <Image
                src={
                  activeModalCourse.image_url ||
                  activeModalCourse.featured_image ||
                  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop"
                }
                alt={activeModalCourse.title}
                fill
                className="object-cover"
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeModalCourse.overview || activeModalCourse.description}
            </p>

            {activeModalCourse.prerequisites && (
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Prerequisites:</strong> {activeModalCourse.prerequisites}
                </span>
              </div>
            )}

            {(activeModalCourse.modules || activeModalCourse.includes) && (
              <div>
                <h4 className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-2">
                  Course Modules & Inclusions
                </h4>
                <ul className="space-y-1.5">
                  {(activeModalCourse.modules || activeModalCourse.includes || []).map((m, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-base font-bold text-white font-mono">
                {formatCurrency(activeModalCourse.price, activeModalCourse.currency || "EUR")}
              </span>

              <Button
                variant="primary"
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
                Enroll In Course
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
