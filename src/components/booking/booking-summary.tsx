"use client";

import type { TranslationDictionary } from "@/lib/i18n/translations";

type SummaryStep = {
  key: string;
  label: string;
  value?: string;
  active: boolean;
};

type BookingSummaryProps = {
  dictionary: TranslationDictionary;
  variant: "sidebar" | "mobile";
  serviceName: string;
  durationMinutes: number;
  price: number;
  currency: string;
  barberName?: string;
  dateLabel?: string;
  slotLabel?: string;
  customerLabel?: string;
  customerPhone?: string;
  hasAnySelection: boolean;
  hasCompleteSelection: boolean;
  detailsValid: boolean;
  nextStepLabel: string | null;
};

export function BookingSummary({
  dictionary,
  variant,
  serviceName,
  durationMinutes,
  price,
  currency,
  barberName,
  dateLabel,
  slotLabel,
  customerLabel,
  customerPhone,
  hasAnySelection,
  hasCompleteSelection,
  detailsValid,
  nextStepLabel,
}: BookingSummaryProps) {
  const totalReady = hasCompleteSelection && detailsValid;

  if (variant === "mobile") {
    return (
      <div className="mobile-summary-bar" aria-live="polite">
        <div className="mobile-summary-totals">
          <div className="mobile-summary-totals-left">
            <span className="mobile-summary-meta">{dictionary.booking.summaryTotal}</span>
            <span className="mobile-summary-value">
              {price} {currency} · {durationMinutes} min
            </span>
          </div>
          <p className={`mobile-summary-hint ${totalReady ? "mobile-summary-hint-ready" : ""}`}>
            {totalReady
              ? dictionary.booking.summaryReady
              : nextStepLabel ?? dictionary.booking.summaryIncomplete}
          </p>
        </div>
      </div>
    );
  }

  const steps: SummaryStep[] = [
    {
      key: "service",
      label: dictionary.booking.summaryService,
      value: serviceName,
      active: true,
    },
    {
      key: "barber",
      label: dictionary.booking.summaryBarber,
      value: barberName,
      active: Boolean(barberName),
    },
    {
      key: "date",
      label: dictionary.booking.summaryDate,
      value: dateLabel,
      active: Boolean(dateLabel),
    },
    {
      key: "time",
      label: dictionary.booking.summaryTime,
      value: slotLabel,
      active: Boolean(slotLabel),
    },
    {
      key: "details",
      label: dictionary.booking.summaryName,
      value: customerLabel,
      active: Boolean(customerLabel),
    },
  ];

  return (
    <section className="summary-card" aria-live="polite">
      <p className="eyebrow text-[var(--color-accent)]">{dictionary.booking.summaryHeading}</p>
      <h2 className="mt-1.5 font-display text-2xl uppercase leading-none tracking-[0.04em] text-white">
        {dictionary.booking.title}
      </h2>

      {!hasAnySelection ? (
        <p className="summary-empty">{dictionary.booking.summaryEmpty}</p>
      ) : (
        <div className="mt-4 summary-step-list">
          {steps.map((step) => (
            <div key={step.key} className="summary-step">
              <span className={`summary-step-dot ${step.active ? "summary-step-dot-active" : ""}`} aria-hidden />
              <div>
                <p className="summary-step-label">{step.label}</p>
                <p className={`summary-step-value ${step.value ? "" : "summary-step-pending"}`}>
                  {step.value ?? "—"}
                </p>
              </div>
              {step.key === "service" ? (
                <span className="summary-step-meta">{durationMinutes} min</span>
              ) : step.key === "details" && customerPhone ? (
                <span className="summary-step-meta">{customerPhone}</span>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <div className="summary-total-row">
        <span className="summary-total-label">{dictionary.booking.summaryTotal}</span>
        <span className="summary-total-value">
          {price} {currency}
        </span>
      </div>

      {totalReady ? (
        <p className="summary-next">
          <span className="summary-next-icon" aria-hidden>✓</span>
          {dictionary.booking.summaryReady}
        </p>
      ) : nextStepLabel ? (
        <p className="summary-next">
          <span className="summary-next-icon" aria-hidden>→</span>
          {dictionary.booking.summaryNextLabel}: {nextStepLabel}
        </p>
      ) : null}
    </section>
  );
}
