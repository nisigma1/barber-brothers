"use client";

import { LANGUAGES } from "@/lib/constants";
import { useLanguage } from "@/components/providers/language-provider";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
      {LANGUAGES.map((item) => {
        const active = item === language;

        return (
          <button
            key={item}
            type="button"
            onClick={() => setLanguage(item)}
            className={`min-h-10 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] transition ${
              active
                ? "bg-[var(--color-accent)] text-[var(--color-ink)]"
                : "text-white/65 hover:text-white"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
