"use client";

import Link from "next/link";

import { BRAND_NAME, CONTACT_DETAILS, SERVICE } from "@/lib/constants";
import { BookingForm } from "@/components/booking/booking-form";
import { useLanguage } from "@/components/providers/language-provider";

export function BookingPage() {
  const { dictionary } = useLanguage();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="eyebrow text-[var(--color-accent)]">{BRAND_NAME}</p>
          <h1 className="mt-2 font-display text-[clamp(2.3rem,6vw,4.8rem)] uppercase leading-[0.88] tracking-[0.05em] text-white">
            {dictionary.booking.title}
          </h1>
          <p className="mt-3 hidden max-w-2xl text-sm leading-7 text-white/68 sm:block sm:text-base">
            {dictionary.booking.subtitle}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold text-white">
          <span className="rounded-full border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10 px-3 py-2">
            {dictionary.common.serviceName}
          </span>
          <span className="rounded-full border border-white/10 bg-black/24 px-3 py-2">
            {dictionary.home.fastBooking}
          </span>
          <span className="rounded-full border border-white/10 bg-black/24 px-3 py-2">
            {dictionary.home.barbersEyebrow}
          </span>
        </div>
      </div>

      <div className="grid w-full gap-5 lg:grid-cols-[1.28fr_0.72fr]">
        <BookingForm />

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="premium-card p-5">
            <div className="rounded-[1.1rem] border border-[var(--color-accent)]/22 bg-[var(--color-accent)]/10 p-4">
              <p className="eyebrow text-[var(--color-accent)]">{dictionary.booking.serviceLabel}</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{dictionary.common.serviceName}</h2>
              <p className="mt-2 text-sm text-white/68">{dictionary.booking.serviceIntro}</p>
              <p className="mt-3 text-sm font-semibold text-white">
                {SERVICE.durationMinutes} min - {SERVICE.price} {SERVICE.currency}
              </p>
            </div>
          </div>

          <div className="premium-card p-5">
            <p className="eyebrow text-white/42">{dictionary.home.contactTitle}</p>
            <div className="mt-4 grid gap-2">
              <a className="tap-card" href={`tel:${CONTACT_DETAILS.primaryPhone}`}>
                {CONTACT_DETAILS.primaryPhone}
              </a>
              <a className="tap-card" href={`tel:${CONTACT_DETAILS.secondaryPhone}`}>
                {CONTACT_DETAILS.secondaryPhone}
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
                {dictionary.home.mapsCta}
              </a>
              <Link href="/" className="btn-secondary mt-2">
                {dictionary.booking.backToHome}
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
