"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  Sparkles,
  GraduationCap,
  Ship,
  Eye,
  ArrowUpRight,
  TrendingUp,
  History,
  Smartphone,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataStore } from "@/lib/data-store";
import { BookingInquiry, AuditLog } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function AdminOverviewPage() {
  const [inquiries, setInquiries] = useState<BookingInquiry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activitiesCount, setActivitiesCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [tripsCount, setTripsCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);

  useEffect(() => {
    const loadData = () => {
      setInquiries(DataStore.getInquiries());
      setAuditLogs(DataStore.getAuditLogs());
      setActivitiesCount(DataStore.getActivities(true).length);
      setCoursesCount(DataStore.getCourses(true).length);
      setTripsCount(DataStore.getTrips(true).length);
      setGalleryCount(DataStore.getGallery(true).length);
    };
    loadData();

    window.addEventListener("store-sync", loadData);
    return () => window.removeEventListener("store-sync", loadData);
  }, []);

  const newInquiries = inquiries.filter((i) => i.status === "New");

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
              Executive Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Diving center operations, reservation pipeline, and real-time CMS telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/__dev/device-preview" target="_blank">
              <Button size="sm" variant="glass" className="text-xs">
                <Smartphone className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                Mobile Device Preview
              </Button>
            </Link>
            <Link href="/" target="_blank">
              <Button size="sm" variant="primary" className="text-xs">
                <Eye className="w-3.5 h-3.5 mr-1" />
                Preview Public Site
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Inquiries */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Inquiries
              </span>
              <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white font-mono">{inquiries.length}</span>
              {newInquiries.length > 0 && (
                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  {newInquiries.length} Need Action
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Published Activities */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Dive Experiences
              </span>
              <div className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white font-mono">{activitiesCount}</span>
              <Link href="/admin/activities" className="text-xs text-sky-400 hover:underline">
                Manage &rarr;
              </Link>
            </div>
          </div>

          {/* Card 3: Academy Courses */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                PADI Academy Courses
              </span>
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white font-mono">{coursesCount}</span>
              <Link href="/admin/courses" className="text-xs text-cyan-400 hover:underline">
                Curriculum &rarr;
              </Link>
            </div>
          </div>

          {/* Card 4: Safari Expeditions */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Safaris & Charters
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Ship className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white font-mono">{tripsCount}</span>
              <Link href="/admin/trips" className="text-xs text-emerald-400 hover:underline">
                Vessels &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Section: Recent Inquiries + Realtime Audit Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Inquiries Stream */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Inbox className="w-4 h-4 text-cyan-400" />
                Recent Reservation Requests
              </h2>
              <Link
                href="/admin/inquiries"
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                View Pipeline &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {inquiries.slice(0, 5).map((inq) => (
                <div
                  key={inq.id}
                  className="p-4 rounded-2xl bg-slate-900/50 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/80 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{inq.customer_name}</span>
                      <span className="text-xs text-slate-400">• {inq.interest_type}</span>
                    </div>
                    <p className="text-xs text-cyan-300 font-medium">{inq.item_title}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{inq.customer_phone}</span>
                      <span>•</span>
                      <span>{inq.participants_count} Guest(s)</span>
                      <span>•</span>
                      <span>{formatDate(inq.preferred_date)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        inq.status === "New"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
                          : inq.status === "Confirmed"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-white/10 text-slate-300"
                      }`}
                    >
                      {inq.status}
                    </span>
                    <Link href="/admin/inquiries">
                      <Button size="sm" variant="glass" className="text-xs">
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Col: Realtime Audit Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                Live Audit Trail
              </h2>
              <Link
                href="/admin/audit-logs"
                className="text-xs text-slate-400 hover:text-white"
              >
                All Logs
              </Link>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/50 border border-white/10 space-y-4">
              {auditLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="pb-3 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-mono text-cyan-400">{log.action}</span>
                    <span className="font-mono">{new Date(log.created_at).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
