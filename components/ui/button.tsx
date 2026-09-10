import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  shape?: "pill" | "rounded" | "square";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", shape = "pill", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:brightness-110 border border-sky-400/30",
      secondary:
        "bg-white/10 text-white hover:bg-white/15 border border-white/10 backdrop-blur-md",
      glass:
        "bg-slate-900/60 text-slate-100 hover:bg-slate-800/80 border border-white/10 backdrop-blur-xl shadow-glass-sm hover:border-white/20",
      outline:
        "border border-white/20 text-white hover:bg-white/5 hover:border-white/40",
      ghost:
        "text-slate-300 hover:text-white hover:bg-white/5",
      danger:
        "bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-13 px-8 text-base gap-2.5 font-semibold",
      icon: "h-10 w-10 p-0",
    };

    const shapeStyles = {
      pill: "rounded-full",
      rounded: "rounded-xl",
      square: "rounded-md",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          shapeStyles[shape],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
