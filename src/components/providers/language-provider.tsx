"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { Language } from "@/lib/booking/types";
import { translations } from "@/lib/i18n/translations";

type LanguageContextValue = {
  dictionary: (typeof translations)[Language];
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "barber-brothers-language";
const DEFAULT_LANGUAGE: Language = "en";

function getStoredLanguage(): Language {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  return window.localStorage.getItem(STORAGE_KEY) === "sq" ? "sq" : "en";
}

function applyLanguage(language: Language) {
  document.documentElement.lang = language;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setLanguageState(getStoredLanguage());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    applyLanguage(language);
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    applyLanguage(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    setLanguageState(nextLanguage);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      dictionary: translations[language],
      language,
      setLanguage,
    }),
    [language, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
