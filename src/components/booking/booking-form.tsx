"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useId, useRef, useState } from "react";

import {
  ADD_ONS,
  BARBERS,
  DEFAULT_SERVICE_IDS,
  SERVICES,
  getBookingService,
  isAllInOneSelection,
} from "@/lib/constants";
import { ClientBookingError, createClientBooking, getClientAvailability } from "@/lib/booking/client";
import {
  formatConfirmationDate,
  getAvailabilitySlots,
  getBookableDateOptions,
  getFirstOpenBookableDate,
  isShopClosedOnDate,
} from "@/lib/booking/time";
import type { AddOnId, ApiErrorCode, AvailabilitySlot, BarberId, BookingSummary, ServiceId } from "@/lib/booking/types";
import { normalizeKosovoPhone } from "@/lib/booking/phone";
import { useLanguage } from "@/components/providers/language-provider";

const LAST_BOOKING_KEY = "barber-brothers-last-booking";
const SHOULD_REFRESH_AVAILABILITY_AFTER_ERROR: ApiErrorCode[] = [
  "BOOKING_CUTOFF",
  "INVALID_SLOT",
  "SLOT_TAKEN",
];

function getErrorMessage(code: ApiErrorCode, dictionary: ReturnType<typeof useLanguage>["dictionary"]) {
  return dictionary.booking.errors[code];
}

function fieldIsTouched(value: string) {
  return value.trim().length > 0;
}

function getSubmitErrorCode(error: unknown): ApiErrorCode {
  if (error instanceof ClientBookingError) {
    return error.code;
  }

  return "BOOKING_SAVE_FAILED";
}

export function BookingForm() {
  const formId = useId();
  const { dictionary, language } = useLanguage();
  const [serviceIds, setServiceIds] = useState<ServiceId[]>(DEFAULT_SERVICE_IDS);
  const [addOnIds, setAddOnIds] = useState<AddOnId[]>([]);
  const [barberId, setBarberId] = useState<BarberId | null>(null);
  const [localDate, setLocalDate] = useState(getFirstOpenBookableDate);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [availabilityState, setAvailabilityState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [formErrorCode, setFormErrorCode] = useState<ApiErrorCode | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState<BookingSummary | null>(null);
  const submitLockRef = useRef(false);
  const submissionIdRef = useRef<string | null>(null);

  const dateOptions = getBookableDateOptions(language);
  const bookingService = getBookingService({ serviceIds, addOnIds }, language);
  const allInOneSelected = isAllInOneSelection(serviceIds);
  const selectedBarber = BARBERS.find((barber) => barber.id === barberId);
  const selectedDate = dateOptions.find((date) => date.localDate === localDate);
  const availabilityIsVerified = availabilityState === "ready";
  const selectedSlotObject = availabilityIsVerified
    ? slots.find((slot) => slot.localTime === selectedSlot && slot.available)
    : undefined;
  const isClosedDay = isShopClosedOnDate(localDate);
  const normalizedPhone = normalizeKosovoPhone(phoneNumber);
  const phoneIsValid = normalizedPhone !== null;
  const firstNameValid = firstName.trim().length >= 2;
  const lastNameValid = lastName.trim().length >= 2;
  const detailsValid = firstNameValid && lastNameValid && phoneIsValid;
  const hasCompleteSelection = Boolean(selectedBarber && selectedDate && selectedSlotObject);
  const canConfirm = availabilityIsVerified && hasCompleteSelection && detailsValid && !isSubmitting;
  const availableSlotCount = slots.filter((slot) => slot.available).length;
  const summaryItems = hasCompleteSelection && detailsValid
    ? [
        [dictionary.booking.summaryService, `${bookingService.name} - ${bookingService.durationMinutes} min`],
        [dictionary.booking.summaryBarber, selectedBarber?.name],
        [dictionary.booking.summaryDate, selectedDate?.label],
        [dictionary.booking.summaryTime, selectedSlotObject?.label],
        [dictionary.booking.summaryPhone, normalizedPhone],
        [dictionary.booking.summaryPrice, `${bookingService.price} ${bookingService.currency}`],
      ]
    : [];

  async function refreshAvailabilityAfterSubmitError(
    currentBarberId: BarberId,
    currentLocalDate: string,
    currentServiceIds: ServiceId[],
  ) {
    try {
      const nextSlots = await getClientAvailability(currentBarberId, currentLocalDate, currentServiceIds);

      setSlots(nextSlots);
      setAvailabilityState("ready");
      setSelectedSlot("");
    } catch {
      setSelectedSlot("");
    }
  }

  function getSubmissionId() {
    submissionIdRef.current ??= crypto.randomUUID();
    return submissionIdRef.current;
  }

  function resetSubmissionAttempt() {
    submissionIdRef.current = null;
  }

  function resetAvailabilityForServiceChange() {
    setSelectedSlot("");
    setSlots([]);
    setAvailabilityState("idle");
    resetSubmissionAttempt();
  }

  function toggleNormalService(nextServiceId: ServiceId) {
    const nextServiceIds = allInOneSelected
      ? [nextServiceId]
      : serviceIds.includes(nextServiceId)
        ? serviceIds.length > 1
          ? serviceIds.filter((currentServiceId) => currentServiceId !== nextServiceId)
          : serviceIds
        : [...serviceIds, nextServiceId];

    if (nextServiceIds === serviceIds) {
      return;
    }

    setServiceIds(nextServiceIds);
    resetAvailabilityForServiceChange();
  }

  function selectPackageService(nextServiceId: ServiceId) {
    if (serviceIds.length === 1 && serviceIds[0] === nextServiceId) {
      return;
    }

    setServiceIds([nextServiceId]);
    setAddOnIds([]);
    resetAvailabilityForServiceChange();
  }

  useEffect(() => {
    if (!barberId || isClosedDay) {
      return;
    }

    let ignore = false;
    const currentBarberId = barberId;

    async function loadAvailability() {
      const fallbackSlots = getAvailabilitySlots(currentBarberId, localDate, new Set(), serviceIds).map((slot) => ({
        ...slot,
        available: false,
      }));

      setSlots(fallbackSlots);
      setAvailabilityState("loading");
      setFormErrorCode(null);
      setSelectedSlot("");

      try {
        const nextSlots = await getClientAvailability(currentBarberId, localDate, serviceIds);

        if (ignore) {
          return;
        }

        setSlots(nextSlots);
        setAvailabilityState("ready");
      } catch {
        if (ignore) {
          return;
        }

        setSlots([]);
        setAvailabilityState("error");
      }
    }

    void loadAvailability();

    return () => {
      ignore = true;
    };
  }, [barberId, isClosedDay, localDate, serviceIds]);

  function validateDetails() {
    const nextErrors: Record<string, string> = {};

    if (!firstNameValid) {
      nextErrors.firstName = dictionary.booking.validationFirstName;
    }

    if (!lastNameValid) {
      nextErrors.lastName = dictionary.booking.validationLastName;
    }

    if (!phoneIsValid) {
      nextErrors.phoneNumber = dictionary.booking.validationPhone;
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitLockRef.current) {
      return;
    }

    if (!barberId || !selectedSlotObject) {
      setFormErrorCode("INVALID_SLOT");
      return;
    }

    if (!validateDetails()) {
      return;
    }

    submitLockRef.current = true;
    setIsSubmitting(true);
    setFormErrorCode(null);

    try {
      const booking = await createClientBooking({
        submissionId: getSubmissionId(),
        serviceIds,
        addOnIds,
        barberId,
        localDate,
        localTime: selectedSlotObject.localTime,
        firstName,
        lastName,
        phoneNumber,
        website,
      });

      window.localStorage.setItem(LAST_BOOKING_KEY, JSON.stringify(booking));
      resetSubmissionAttempt();
      setSuccessBooking(booking);
    } catch (error) {
      const code = getSubmitErrorCode(error);

      setFormErrorCode(code);

      if (SHOULD_REFRESH_AVAILABILITY_AFTER_ERROR.includes(code)) {
        await refreshAvailabilityAfterSubmitError(barberId, localDate, serviceIds);
        resetSubmissionAttempt();
      }
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setServiceIds(DEFAULT_SERVICE_IDS);
    setAddOnIds([]);
    setBarberId(null);
    setLocalDate(getFirstOpenBookableDate());
    setSelectedSlot("");
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setWebsite("");
    setSlots([]);
    setFormErrorCode(null);
    setFieldErrors({});
    setSuccessBooking(null);
    submitLockRef.current = false;
    resetSubmissionAttempt();
  }

  if (successBooking) {
    return (
      <section className="premium-card p-5 sm:p-7" aria-live="polite">
        <div className="rounded-[1.25rem] border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/12 p-5">
          <p className="eyebrow text-[var(--color-accent)]">{dictionary.booking.successTitle}</p>
          <h2 className="mt-3 font-display text-4xl uppercase leading-none tracking-[0.08em] text-white sm:text-5xl">
            {dictionary.booking.confirmationTitle}
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/70">{dictionary.booking.successBody}</p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            [dictionary.booking.summaryService, `${successBooking.serviceName} - ${successBooking.serviceDurationMinutes} min`],
            [dictionary.booking.summaryBarber, successBooking.barberName],
            [dictionary.booking.summaryDate, formatConfirmationDate(successBooking.localDate, language)],
            [dictionary.booking.summaryTime, `${successBooking.localTime}-${successBooking.endLocalTime}`],
            [dictionary.booking.summaryPhone, successBooking.customerPhone],
            [dictionary.booking.summaryPrice, successBooking.priceLabel],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[1rem] border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">{label}</p>
              <p className="mt-2 text-base font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>

        <button type="button" onClick={resetForm} className="btn-primary mt-6 w-full">
          {dictionary.booking.bookAnother}
        </button>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="premium-card p-4 sm:p-6">
      <div className="space-y-6">
        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-[var(--color-accent)]">{dictionary.booking.stepService}</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">{dictionary.booking.serviceLabel}</h2>
            </div>
            <p className="text-xs font-semibold text-[var(--color-accent)]">{dictionary.booking.required}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {SERVICES.filter((service) => service.type === "main").map((service) => {
              const active = serviceIds.includes(service.id);

              return (
                <button
                  key={service.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleNormalService(service.id)}
                  className={`tap-card service-card-compact text-left ${active ? "selected-card" : ""}`}
                >
                  <span className="eyebrow text-white/42">{dictionary.booking.serviceCardLabel}</span>
                  <span className="mt-2 block text-xl font-semibold leading-tight text-white">{service.name[language]}</span>
                  <span className="mt-1.5 block text-sm leading-5 text-white/58">{service.description[language]}</span>
                  <span className="mt-3 inline-flex rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/66">
                    {service.durationMinutes} min / {service.price} {service.currency}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_0.72fr]">
            {SERVICES.filter((service) => service.type === "package").map((service) => {
              const active = serviceIds.includes(service.id);

              return (
                <button
                  key={service.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => selectPackageService(service.id)}
                  className={`tap-card service-card-compact text-left ${active ? "selected-card" : ""}`}
                >
                  <span className="eyebrow text-white/42">{dictionary.booking.serviceCardLabel}</span>
                  <span className="mt-2 block text-xl font-semibold leading-tight text-white">{service.name[language]}</span>
                  <span className="mt-1.5 block text-sm leading-5 text-white/58">{service.description[language]}</span>
                  <span className="mt-3 inline-flex rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/66">
                    {service.durationMinutes} min / {service.price} {service.currency}
                  </span>
                </button>
              );
            })}

            {ADD_ONS.map((addOn) => {
              const active = addOnIds.includes(addOn.id);

              return (
                <button
                  key={addOn.id}
                  type="button"
                  aria-pressed={active}
                  disabled={allInOneSelected}
                  onClick={() => {
                    if (allInOneSelected) {
                      return;
                    }

                    setAddOnIds((current) => (
                      current.includes(addOn.id)
                        ? current.filter((id) => id !== addOn.id)
                        : [...current, addOn.id]
                    ));
                    resetSubmissionAttempt();
                  }}
                  className={`tap-card service-card-compact flex flex-col gap-2 text-left disabled:cursor-not-allowed disabled:opacity-45 ${active ? "selected-card" : ""}`}
                >
                  <span>
                    <span className="eyebrow text-white/42">{dictionary.booking.addOnLabel}</span>
                    <span className="mt-2 block font-semibold text-white">{addOn.name[language]}</span>
                    <span className="mt-1 block text-sm text-white/58">{addOn.description[language]}</span>
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/66">
                    +{addOn.price} {addOn.currency}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rounded-[1rem] border border-white/10 bg-black/20 px-4 py-3 text-sm font-semibold text-white/72">
            {dictionary.booking.duration}: {bookingService.durationMinutes} min · {dictionary.booking.price}:{" "}
            {bookingService.price} {bookingService.currency}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-[var(--color-accent)]">{dictionary.booking.stepBarber}</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">{dictionary.booking.barberLabel}</h2>
            </div>
            {!barberId ? <p className="text-xs font-semibold text-[var(--color-accent)]">{dictionary.booking.required}</p> : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {BARBERS.map((barber) => {
              const active = barber.id === barberId;

              return (
                <button
                  key={barber.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    if (active) {
                      return;
                    }

                    setBarberId(barber.id);
                    setSelectedSlot("");
                    setSlots([]);
                    setAvailabilityState("idle");
                    resetSubmissionAttempt();
                  }}
                  className={`tap-card min-h-24 overflow-hidden p-0 text-left ${active ? "selected-card" : ""}`}
                >
                  <div className="grid h-full gap-0 sm:grid-cols-[7rem_1fr]">
                    <div className="image-panel min-h-28 rounded-none border-0">
                      <img
                        src={barber.image}
                        alt={barber.name}
                        className="h-full w-full image-fill"
                        decoding="async"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <span className="eyebrow text-white/42">{dictionary.booking.barberCardLabel}</span>
                      <span className="mt-2 block font-display text-4xl uppercase tracking-[0.06em] text-white">
                        {barber.name}
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-white/58">
                        {barber.id === "barber-1"
                          ? dictionary.home.barberOneTagline
                          : dictionary.home.barberTwoTagline}
                      </span>
                      <span className="mt-3 inline-flex rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/62">
                        {active ? dictionary.booking.selected : dictionary.booking.tapToChoose}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          <div>
            <p className="eyebrow text-[var(--color-accent)]">{dictionary.booking.stepDate}</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{dictionary.booking.dateLabel}</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {dateOptions.map((dateOption) => {
              const active = dateOption.localDate === localDate;

              return (
                <button
                  key={dateOption.localDate}
                  type="button"
                  aria-pressed={active}
                  disabled={dateOption.closed}
                  onClick={() => {
                    if (active || dateOption.closed) {
                      return;
                    }

                    setLocalDate(dateOption.localDate);
                    setSelectedSlot("");
                    setSlots([]);
                    setAvailabilityState("idle");
                    resetSubmissionAttempt();
                  }}
                  className={`tap-card text-left disabled:cursor-not-allowed disabled:opacity-45 ${active ? "selected-card" : ""}`}
                >
                  <span className="block text-sm font-semibold text-white">{dateOption.label}</span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-white/45">
                    {dateOption.closed ? dictionary.booking.closedDay : dictionary.common.open}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-[var(--color-accent)]">{dictionary.booking.stepTime}</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">{dictionary.booking.slotLabel}</h2>
            </div>
            {barberId && availabilityState === "ready" ? (
              <p className="text-sm font-semibold text-white/58">
                {availableSlotCount} {dictionary.booking.availableTimes}
              </p>
            ) : null}
          </div>

          <div className="rounded-[1.1rem] border border-white/10 bg-black/24 p-4">
            {availabilityState === "loading" ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {Array.from({ length: 12 }, (_, index) => (
                  <div key={index} className="h-14 animate-pulse rounded-[0.9rem] bg-white/8" />
                ))}
              </div>
            ) : isClosedDay ? (
              <p className="rounded-[0.9rem] bg-white/5 p-4 text-sm text-white/65">{dictionary.booking.closedDay}</p>
            ) : !barberId ? (
              <p className="rounded-[0.9rem] bg-white/5 p-4 text-sm text-white/65">{dictionary.booking.chooseBarberFirst}</p>
            ) : slots.length === 0 ? (
              <p className="rounded-[0.9rem] bg-white/5 p-4 text-sm text-white/65">
                {availabilityState === "error" ? dictionary.booking.availabilityError : dictionary.booking.noSlots}
              </p>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                  {slots.map((slot) => {
                    const active = selectedSlot === slot.localTime;

                    return (
                      <button
                        key={slot.key}
                        type="button"
                        aria-pressed={active}
                        disabled={!availabilityIsVerified || !slot.available}
                        onClick={() => {
                          setSelectedSlot(slot.localTime);
                          resetSubmissionAttempt();
                        }}
                        className={`slot-button text-center ${active ? "slot-button-active text-white" : "text-white/78"}`}
                      >
                        <span className="block text-base font-bold">{slot.localTime}</span>
                        <span className="mt-1 block text-[0.66rem] uppercase tracking-[0.12em] text-white/45">
                          {slot.available ? dictionary.booking.availableSlot : dictionary.common.unavailable}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {availableSlotCount === 0 ? (
                  <p className="rounded-[0.9rem] border border-white/10 bg-white/[0.04] p-3 text-sm text-white/64">
                    {dictionary.booking.noSlots}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <div>
            <p className="eyebrow text-[var(--color-accent)]">{dictionary.booking.stepDetails}</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{dictionary.booking.detailsLabel}</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="field-label" htmlFor={`${formId}-first-name`}>
              {dictionary.booking.firstName}
              <input
                id={`${formId}-first-name`}
                value={firstName}
                onChange={(event) => {
                  setFirstName(event.target.value);
                  resetSubmissionAttempt();
                }}
                autoComplete="given-name"
                placeholder={dictionary.booking.firstNamePlaceholder}
                className="field-input"
                aria-invalid={Boolean(fieldErrors.firstName)}
              />
              {fieldErrors.firstName || (fieldIsTouched(firstName) && !firstNameValid) ? (
                <span className="field-error">{fieldErrors.firstName || dictionary.booking.validationFirstName}</span>
              ) : null}
            </label>
            <label className="field-label" htmlFor={`${formId}-last-name`}>
              {dictionary.booking.lastName}
              <input
                id={`${formId}-last-name`}
                value={lastName}
                onChange={(event) => {
                  setLastName(event.target.value);
                  resetSubmissionAttempt();
                }}
                autoComplete="family-name"
                placeholder={dictionary.booking.lastNamePlaceholder}
                className="field-input"
                aria-invalid={Boolean(fieldErrors.lastName)}
              />
              {fieldErrors.lastName || (fieldIsTouched(lastName) && !lastNameValid) ? (
                <span className="field-error">{fieldErrors.lastName || dictionary.booking.validationLastName}</span>
              ) : null}
            </label>
            <label className="field-label sm:col-span-2" htmlFor={`${formId}-phone`}>
              {dictionary.booking.phoneNumber}
              <input
                id={`${formId}-phone`}
                value={phoneNumber}
                onChange={(event) => {
                  setPhoneNumber(event.target.value);
                  resetSubmissionAttempt();
                }}
                inputMode="tel"
                autoComplete="tel"
                placeholder={dictionary.booking.phonePlaceholder}
                className="field-input"
                aria-invalid={Boolean(fieldErrors.phoneNumber)}
              />
              <span className="text-xs text-white/45">{dictionary.booking.phoneHint}</span>
              {fieldErrors.phoneNumber || (fieldIsTouched(phoneNumber) && !phoneIsValid) ? (
                <span className="field-error">{fieldErrors.phoneNumber || dictionary.booking.validationPhone}</span>
              ) : null}
            </label>
            <input
              type="text"
              name="bb-company-url"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="new-password"
              aria-hidden="true"
            />
          </div>
        </section>

        <section className="rounded-[1.1rem] border border-white/10 bg-white/[0.035] p-4">
          <p className="eyebrow text-[var(--color-accent)]">{dictionary.booking.stepConfirm}</p>
          {hasCompleteSelection && detailsValid ? (
            <>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {summaryItems.map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs uppercase tracking-[0.16em] text-white/40">{label}</p>
                    <p className="mt-1 font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-white/58">{dictionary.booking.trustNote}</p>
            </>
          ) : hasCompleteSelection ? (
            <p className="mt-3 text-sm leading-7 text-white/64">{dictionary.booking.summaryNeedsDetails}</p>
          ) : (
            <p className="mt-3 text-sm leading-7 text-white/64">{dictionary.booking.summaryIncomplete}</p>
          )}
        </section>

        {formErrorCode ? (
          <div className="rounded-[1rem] border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {getErrorMessage(formErrorCode, dictionary)}
          </div>
        ) : null}

        <button type="submit" disabled={!canConfirm} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-45">
          {isSubmitting ? dictionary.booking.pending : dictionary.booking.submit}
        </button>
      </div>
    </form>
  );
}
