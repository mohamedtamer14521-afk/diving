"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, ShieldCheck, Lock, Mail, ArrowRight, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataStore } from "@/lib/data-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@divingvisioncenter.com");
  const [password, setPassword] = useState("••••••••••••");
  const [role, setRole] = useState<"Super Admin" | "Content Manager">("Super Admin");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      DataStore.setAdminUser({
        id: `usr-${Date.now()}`,
        email,
        name: role === "Super Admin" ? "Master Administrator" : "Editorial Manager",
        role,
        avatar_url: "",
        last_login: new Date().toISOString(),
      });
      DataStore.addAuditLog("ADMIN_LOGIN", "AUTH", `Admin session opened by ${email} (${role})`);
      setIsLoading(false);
      router.push("/admin");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#040914] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-sky-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-sky-600 to-cyan-400 p-[1px] shadow-glow-cyan flex items-center justify-center mx-auto mb-4">
            <div className="w-full h-full bg-slate-950 rounded-3xl flex items-center justify-center">
              <Compass className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white font-display tracking-tight">
            Sanctuary Control Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise Administrative Access & Realtime CMS
          </p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6"
        >
          {/* Role selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Select Administrative Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("Super Admin")}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                  role === "Super Admin"
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                    : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => setRole("Content Manager")}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                  role === "Content Manager"
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                    : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                Content Manager
              </button>
            </div>
          </div>

          {/* Email */}
          <Input
            label="Admin Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <Input
            label="Passcode"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            variant="primary"
            isLoading={isLoading}
            className="w-full text-sm font-semibold shadow-lg shadow-sky-500/20"
          >
            Authenticate & Open Dashboard
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          {/* Demo info note */}
          <div className="pt-2 text-center border-t border-white/5">
            <p className="text-[11px] text-slate-400">
              🛡️ Role-Based Access Control • Supabase Auth Ready
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
