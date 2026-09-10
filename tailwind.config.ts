import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: "#030712",
          900: "#060e1d",
          850: "#0a1628",
          800: "#0f2038",
          700: "#162f52",
          600: "#1f4374",
          500: "#0284c7",
          400: "#38bdf8",
          300: "#7dd3fc",
          200: "#bae6fd",
          100: "#e0f2fe",
          50: "#f0f9ff",
        },
        cyanGlow: {
          500: "#06b6d4",
          400: "#22d3ee",
          300: "#67e8f9",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Segoe UI", "sans-serif"],
        display: ["var(--font-outfit)", "-apple-system", "BlinkMacSystemFont", "SF Pro Display", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        "glow-cyan": "0 0 40px -10px rgba(6, 182, 212, 0.35)",
        "glow-ocean": "0 0 50px -15px rgba(2, 132, 199, 0.4)",
        "glass-sm": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-card": "0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        "apple-elevated": "0 30px 60px -12px rgba(0, 0, 0, 0.56), 0 18px 36px -18px rgba(0, 0, 0, 0.4)",
      },
      backgroundImage: {
        "ocean-radial": "radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.15) 0%, rgba(3, 7, 18, 0) 70%)",
        "cyan-gradient": "linear-gradient(135deg, #38BDF8 0%, #0284C7 50%, #06B6D4 100%)",
        "glass-gradient": "linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)",
      },
      animation: {
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
