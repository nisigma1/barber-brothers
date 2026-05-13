"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";

export function ThemeToggle() {
  const { dictionary, language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label =
    language === "sq"
      ? isDark
        ? "Kalo ne teme te bardhe"
        : "Kalo ne teme te zeze"
      : isDark
        ? "Switch to light theme"
        : "Switch to dark theme";

  return (
    <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={label} title={label}>
      <span className="theme-toggle-label">{isDark ? dictionary.common.darkTheme : dictionary.common.lightTheme}</span>
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-knob" />
      </span>
    </button>
  );
}
