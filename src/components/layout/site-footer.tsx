"use client";

import { CONTACT_DETAILS } from "@/lib/constants";
import { useLanguage } from "@/components/providers/language-provider";

export function SiteFooter() {
  const { dictionary } = useLanguage();

  return (
    <footer className="border-t border-white/8 bg-black/25">
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <p className="font-display text-2xl uppercase tracking-[0.16em] text-white">Barber Brothers</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">{dictionary.footer.line}</p>
          <p className="mt-2 text-sm text-white/42">{dictionary.footer.location}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <a className="tap-card" href={`tel:${CONTACT_DETAILS.primaryPhone}`}>
            {CONTACT_DETAILS.primaryPhone}
          </a>
          <a
            className="tap-card"
            href={`https://instagram.com/${CONTACT_DETAILS.instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            @{CONTACT_DETAILS.instagramHandle}
          </a>
          <a className="tap-card" href={CONTACT_DETAILS.mapsHref} target="_blank" rel="noopener noreferrer">
            Google Maps
          </a>
        </div>
      </div>
    </footer>
  );
}
