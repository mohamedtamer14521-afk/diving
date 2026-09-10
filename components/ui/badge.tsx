import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "ocean" | "cyan" | "gold" | "subtle" | "outline" | "success" | "warning";
  pulse?: boolean;
}

export function Badge({ className, variant = "ocean", pulse = false, children, ...props }: BadgeProps) {
  const variantStyles = {
    ocean: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    gold: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    subtle: "bg-white/5 text-slate-300 border-white/10",
    outline: "border-white/20 text-slate-200",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border backdrop-blur-md transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
        </span>
      )}
      {children}
    </div>
  );
}
