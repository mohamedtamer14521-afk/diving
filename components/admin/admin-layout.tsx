"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Palette,
  Layers,
  Sparkles,
  GraduationCap,
  Ship,
  Image as ImageIcon,
  MessageSquareQuote,
  HelpCircle,
  Inbox,
  FolderOpen,
  History,
  Settings,
  LogOut,
  Smartphone,
  ExternalLink,
  Compass,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { DataStore } from "@/lib/data-store";
import { AdminUser } from "@/lib/types";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [inquiriesCount, setInquiriesCount] = useState(0);

  useEffect(() => {
    const user = DataStore.getAdminUser();
    if (!user && pathname !== "/admin/login") {
      router.push("/admin/login");
    } else {
      setAdminUser(user);
    }

    const updateCounts = () => {
      const inqs = DataStore.getInquiries().filter((i) => i.status === "New");
      setInquiriesCount(inqs.length);
    };
    updateCounts();

    const handleSync = () => updateCounts();
    window.addEventListener("store-sync", handleSync);
    return () => window.removeEventListener("store-sync", handleSync);
  }, [pathname, router]);

  const navItems = [
    { label: "Overview", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Site Branding", href: "/admin/branding", icon: <Settings className="w-4 h-4" /> },
    { label: "Appearance & Themes", href: "/admin/appearance", icon: <Palette className="w-4 h-4" /> },
    { label: "Homepage Sections", href: "/admin/sections", icon: <Layers className="w-4 h-4" /> },
    {
      label: "Inquiries & Bookings",
      href: "/admin/inquiries",
      icon: <Inbox className="w-4 h-4" />,
      badge: inquiriesCount > 0 ? `${inquiriesCount} new` : undefined,
    },
    { label: "Activities & Dives", href: "/admin/activities", icon: <Sparkles className="w-4 h-4" /> },
    { label: "Academy Courses", href: "/admin/courses", icon: <GraduationCap className="w-4 h-4" /> },
    { label: "Expedition Safaris", href: "/admin/trips", icon: <Ship className="w-4 h-4" /> },
    { label: "Visual Gallery", href: "/admin/gallery", icon: <ImageIcon className="w-4 h-4" /> },
    { label: "Guest Reviews", href: "/admin/reviews", icon: <MessageSquareQuote className="w-4 h-4" /> },
    { label: "Knowledge FAQ", href: "/admin/faqs", icon: <HelpCircle className="w-4 h-4" /> },
    { label: "Media Assets", href: "/admin/media", icon: <FolderOpen className="w-4 h-4" /> },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: <History className="w-4 h-4" /> },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    DataStore.setAdminUser(null);
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col justify-between w-64 border-r border-white/10 bg-slate-950/80 backdrop-blur-2xl p-4 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-400 p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <Compass className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-sm font-bold text-white block font-display tracking-tight">
                Sanctuary CMS
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">Control Center v1.0</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 gap-2 pt-1 pb-2 border-b border-white/5">
            <Link
              href="/__dev/device-preview"
              target="_blank"
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-medium border border-cyan-500/20 transition-colors"
              title="Open Live iPhone Simulator"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Simulator</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 transition-colors"
              title="Open Public Site"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-sky-500/20 to-cyan-500/20 text-white border border-sky-400/30 font-semibold shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? "text-cyan-400" : "text-slate-400"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          {adminUser && (
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs font-bold font-mono">
                  {adminUser.role === "Super Admin" ? "SA" : "CM"}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block truncate max-w-[110px]">
                    {adminUser.name}
                  </span>
                  <span className="text-[10px] text-cyan-400 block">{adminUser.role}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-bold text-white font-display">Sanctuary CMS</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/__dev/device-preview"
            target="_blank"
            className="p-2 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs"
          >
            <Smartphone className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white bg-white/5"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-slate-950/95 backdrop-blur-2xl p-6 pt-20 overflow-y-auto animate-in fade-in duration-200">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center justify-between p-3 rounded-xl text-sm ${
                  pathname === item.href
                    ? "bg-sky-500/20 text-white font-bold border border-sky-400/30"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
