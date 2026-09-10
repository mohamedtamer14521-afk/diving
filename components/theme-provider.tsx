"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeConfig } from "@/lib/types";
import { DataStore } from "@/lib/data-store";
import { THEME_PRESETS } from "@/lib/theme-presets";

interface ThemeContextType {
  theme: ThemeConfig;
  setThemePreset: (presetKey: string) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
}

const defaultTheme = THEME_PRESETS["premium-ocean"] || Object.values(THEME_PRESETS)[0];

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setThemePreset: () => {},
  updateTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeConfig>(defaultTheme);

  const applyThemeTokens = (t: ThemeConfig) => {
    if (typeof document === "undefined" || !t || !t.colors) return;
    const root = document.documentElement;

    root.style.setProperty("--bg-primary", t.colors.background);
    root.style.setProperty("--bg-surface", t.colors.surface);
    root.style.setProperty("--bg-elevated", t.colors.surface_elevated);
    root.style.setProperty("--text-primary", t.colors.text_primary);
    root.style.setProperty("--text-muted", t.colors.text_muted);
    root.style.setProperty("--primary", t.colors.primary);
    root.style.setProperty("--primary-glow", t.colors.primary_glow);
    root.style.setProperty("--secondary", t.colors.secondary);
    root.style.setProperty("--accent", t.colors.accent);
    root.style.setProperty("--border-subtle", t.colors.border_subtle);

    if (t.styling?.dark_mode) {
      root.classList.remove("theme-light");
      root.classList.add("dark");
    } else {
      root.classList.add("theme-light");
      root.classList.remove("dark");
    }

    const radiusMap = {
      none: "0px",
      sm: "0.375rem",
      md: "0.75rem",
      lg: "1.25rem",
      xl: "1.75rem",
      full: "9999px",
    };
    root.style.setProperty("--radius-card", radiusMap[t.styling?.border_radius || "lg"] || "1.25rem");
  };

  useEffect(() => {
    const loadedTheme = DataStore.getTheme();
    setThemeState(loadedTheme);
    applyThemeTokens(loadedTheme);

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (
        customEvent.detail &&
        (customEvent.detail.key === "diving_vision_theme" ||
          customEvent.detail.key === "aura_oceanics_theme")
      ) {
        setThemeState(customEvent.detail.value);
        applyThemeTokens(customEvent.detail.value);
      }
    };

    window.addEventListener("store-sync", handleSync);
    window.addEventListener("storage", (e) => {
      if (
        (e.key === "diving_vision_theme" || e.key === "aura_oceanics_theme") &&
        e.newValue
      ) {
        try {
          const parsed = JSON.parse(e.newValue);
          setThemeState(parsed);
          applyThemeTokens(parsed);
        } catch {}
      }
    });

    return () => {
      window.removeEventListener("store-sync", handleSync);
    };
  }, []);

  const setThemePreset = (presetKey: string) => {
    const updated = DataStore.setTheme(presetKey);
    setThemeState(updated);
    applyThemeTokens(updated);
  };

  const updateTheme = (updatedTheme: Partial<ThemeConfig>) => {
    const saved = DataStore.updateTheme(updatedTheme);
    setThemeState(saved);
    applyThemeTokens(saved);
  };

  return (
    <ThemeContext.Provider value={{ theme, setThemePreset, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
