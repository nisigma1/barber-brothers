"use client";

import { Suspense } from "react";

import { BRAND_NAME } from "@/lib/constants";
import { BookingForm } from "@/components/booking/booking-form";
import { CancelDialog } from "@/components/booking/cancel-dialog";
import { useLanguage } from "@/components/providers/language-provider";

export function BookingPage() {
  const { dictionary } = useLanguage();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8 lg:py-5">
      <div className="mb-3 max-w-3xl sm:mb-4">
        <p className="eyebrow text-[var(--color-accent)]">{BRAND_NAME}</p>
        <h1 className="mt-1.5 font-display text-[clamp(1.65rem,4.4vw,3.4rem)] uppercase leading-[0.92] tracking-[0.04em] text-white">
          {dictionary.booking.title}
        </h1>
        <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-white/62 sm:block">
          {dictionary.booking.subtitle}
        </p>
      </div>

      <Suspense fallback={null}>
        <CancelDialog />
      </Suspense>
      <BookingForm />
    </div>
  );
}
