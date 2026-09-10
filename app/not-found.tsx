import React from "react";
import Link from "next/link";
import { Compass, Home, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#040914] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative max-w-lg w-full p-8 sm:p-12 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-2xl text-center space-y-6 shadow-2xl z-10">
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: "12s" }} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-bold">
            404 • Uncharted Waters
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Descent Point Not Found
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            The page or expedition you are looking for has drifted beyond our mapped coral drop-offs.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/">
            <Button variant="primary" size="lg" className="w-full sm:w-auto px-8">
              <Home className="w-4 h-4 mr-2" />
              Return To Sanctuary
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
