"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { isBarberClosedOnDate } from "@/lib/barbers";
import { SERVICES } from "@/lib/constants";
import {
  ClientBookingError,
  getClientAvailability,
  removeBarberDayClosure,
  setBarberDayClosure,
  staffQuickBook,
} from "@/lib/booking/client";
import {
  formatConfirmationDate,
  getBookableDateOptions,
  getFirstOpenBookableDate,
  isShopClosedOnDate,
} from "@/lib/booking/time";
import type {
  AvailabilitySlot,
  BarberClosureReason,
  BarberDayClosure,
  ServiceId,
  StaffBookingItem,
} from "@/lib/booking/types";
import { useLanguage } from "@/components/providers/language-provider";

interface Props {
  barberId: string;
  closures: BarberDayClosure[];
  onClosuresChange(closures: BarberDayClosure[]): void;
  onBookingCreated(booking: StaffBookingItem): void;
}

const DEFAULT_SERVICE: ServiceId = "haircut";

function reasonLabel(
  reason: BarberClosureReason,
  dictionary: ReturnType<typeof useLanguage>["dictionary"],
) {
  return reason === "medical-leave"
    ? dictionary.staff.quickBookReasonMedical
    : dictionary.staff.quickBookReasonTimeOff;
}

export function QuickBookPanel({
  barberId,
  closures,
  onClosuresChange,
  onBookingCreated,
}: Props) {
  const { dictionary, language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(() => getFirstOpenBookableDate());
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [openSlot, setOpenSlot] = useState<AvailabilitySlot | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [serviceId, setServiceId] = useState<ServiceId>(DEFAULT_SERVICE);
  const [submitting, setSubmitting] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [closureMenuDate, setClosureMenuDate] = useState<string | null>(null);
  const [savingClosure, setSavingClosure] = useState(false);
  const [closureError, setClosureError] = useState<string | null>(null);

  const dateOptions = useMemo(() => getBookableDateOptions(language), [language]);
  const closureMap = useMemo(
    () => new Map(closures.map((closure) => [closure.localDate, closure])),
    [closures],
  );
  const currentClosure = closureMap.get(selectedDate) ?? null;
  const shopClosed = isShopClosedOnDate(selectedDate);
  const barberClosed = !shopClosed && (Boolean(currentClosure) || isBarberClosedOnDate(barberId, selectedDate));

  const refreshSlots = useCallback(async () => {
    if (shopClosed || barberClosed) {
      setSlots([]);
      return;
    }

    setLoadingSlots(true);
    setErrorCode(null);

    try {
      const list = await getClientAvailability(barberId, selectedDate, [serviceId]);
      setSlots(list);
    } catch (error) {
      setSlots([]);

      if (error instanceof ClientBookingError) {
        setErrorCode(error.code);
      }
    } finally {
      setLoadingSlots(false);
    }
  }, [barberClosed, barberId, selectedDate, serviceId, shopClosed]);

  useEffect(() => {
    // Availability sync: fetch slot state whenever the selected day/service or closure state changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshSlots();
  }, [refreshSlots]);

  function closeModal() {
    setOpenSlot(null);
    setFirstName("");
    setLastName("");
    setServiceId(DEFAULT_SERVICE);
    setErrorCode(null);
    setSubmitting(false);
  }

  async function handleConfirm() {
    if (!openSlot || submitting) {
      return;
    }

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    if (trimmedFirst.length < 2 || trimmedLast.length < 2) {
      setErrorCode("INVALID_REQUEST");
      return;
    }

    setSubmitting(true);
    setErrorCode(null);

    try {
      const booking = await staffQuickBook({
        localDate: selectedDate,
        localTime: openSlot.localTime,
        firstName: trimmedFirst,
        lastName: trimmedLast,
        serviceIds: [serviceId],
      });

      onBookingCreated(booking);
      closeModal();
      await refreshSlots();
    } catch (error) {
      if (error instanceof ClientBookingError) {
        setErrorCode(error.code);
      } else {
        setErrorCode("BOOKING_SAVE_FAILED");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleClosureSave(reason: BarberClosureReason) {
    if (!closureMenuDate || savingClosure) {
      return;
    }

    setSavingClosure(true);
    setClosureError(null);

    try {
      const closure = await setBarberDayClosure(closureMenuDate, reason);
      const nextClosures = closures.filter((item) => item.localDate !== closure.localDate);
      onClosuresChange([...nextClosures, closure].sort((a, b) => a.localDate.localeCompare(b.localDate)));
      setClosureMenuDate(null);
      if (selectedDate === closure.localDate) {
        closeModal();
        setSlots([]);
      }
    } catch (error) {
      if (error instanceof ClientBookingError) {
        setClosureError(dictionary.booking.errors[error.code] ?? dictionary.booking.errors.BOOKING_SAVE_FAILED);
      } else {
        setClosureError(dictionary.booking.errors.BOOKING_SAVE_FAILED);
      }
    } finally {
      setSavingClosure(false);
    }
  }

  async function handleClosureRemove(localDate: string) {
    if (savingClosure) {
      return;
    }

    setSavingClosure(true);
    setClosureError(null);

    try {
      await removeBarberDayClosure(localDate);
      onClosuresChange(closures.filter((item) => item.localDate !== localDate));
      setClosureMenuDate(null);
    } catch (error) {
      if (error instanceof ClientBookingError) {
        setClosureError(dictionary.booking.errors[error.code] ?? dictionary.booking.errors.BOOKING_SAVE_FAILED);
      } else {
        setClosureError(dictionary.booking.errors.BOOKING_SAVE_FAILED);
      }
    } finally {
      setSavingClosure(false);
    }
  }

  return (
    <section className="quickbook-card premium-card p-4 sm:p-5">
      <div>
        <p className="eyebrow text-[var(--color-accent)]">{dictionary.staff.quickBookTitle}</p>
        <p className="mt-1 text-xs leading-5 text-white/55 sm:text-sm">{dictionary.staff.quickBookSubtitle}</p>
      </div>

      <div className="mt-4">
        <p className="eyebrow text-white/45">{dictionary.staff.quickBookDateLabel}</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {dateOptions.map((dateOption) => {
            const active = selectedDate === dateOption.localDate;
            const customClosure = closureMap.get(dateOption.localDate) ?? null;

            return (
              <div key={dateOption.localDate} className="relative">
                <button
                  type="button"
                  aria-pressed={active}
                  disabled={dateOption.closed}
                  onClick={() => setSelectedDate(dateOption.localDate)}
                  className={`date-pill min-h-[5.2rem] w-full pr-10 text-left text-xs disabled:cursor-not-allowed disabled:opacity-45 sm:text-sm ${active ? "selected-card" : ""}`}
                >
                  <span className="block font-semibold text-white">{dateOption.label}</span>
                  {dateOption.closed ? (
                    <span className="mt-0.5 block text-[0.6rem] uppercase tracking-[0.14em] text-white/45">
                      {dictionary.booking.closedDay}
                    </span>
                  ) : customClosure ? (
                    <span className="mt-0.5 block text-[0.6rem] uppercase tracking-[0.14em] text-[var(--color-accent)]">
                      {reasonLabel(customClosure.reason, dictionary)}
                    </span>
                  ) : null}
                </button>

                <button
                  type="button"
                  aria-label={dictionary.staff.quickBookManageDay}
                  onClick={() =>
                    setClosureMenuDate((current) =>
                      current === dateOption.localDate ? null : dateOption.localDate,
                    )
                  }
                  className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border text-[0.65rem] font-semibold transition ${customClosure ? "border-rose-400/70 bg-rose-500/18 text-rose-200" : "border-[var(--color-accent)]/65 bg-black/65 text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-white"}`}
                >
                  X
                </button>
              </div>
            );
          })}
        </div>

        {closureMenuDate ? (
          <div className="mt-3 rounded-[1rem] border border-white/10 bg-black/28 p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  {dictionary.staff.quickBookManageDay} · {formatConfirmationDate(closureMenuDate, language)}
                </p>
                <p className="mt-1 text-xs text-white/55">{dictionary.staff.quickBookClosureHelp}</p>
              </div>
              {closureMap.get(closureMenuDate) ? (
                <button
                  type="button"
                  onClick={() => void handleClosureRemove(closureMenuDate)}
                  disabled={savingClosure}
                  className="btn-secondary shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {dictionary.staff.quickBookRemoveClosure}
                </button>
              ) : null}
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => void handleClosureSave("medical-leave")}
                disabled={savingClosure}
                className="btn-secondary justify-center disabled:cursor-not-allowed disabled:opacity-60"
              >
                {dictionary.staff.quickBookReasonMedical}
              </button>
              <button
                type="button"
                onClick={() => void handleClosureSave("time-off")}
                disabled={savingClosure}
                className="btn-secondary justify-center disabled:cursor-not-allowed disabled:opacity-60"
              >
                {dictionary.staff.quickBookReasonTimeOff}
              </button>
            </div>

            {closureError ? (
              <p className="mt-3 text-sm text-rose-300">{closureError}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-5">
        <p className="eyebrow text-white/45">{dictionary.staff.quickBookSlotLabel}</p>
        <div className="mt-2 rounded-[1rem] border border-white/10 bg-black/24 p-3">
          {shopClosed ? (
            <p className="p-2 text-sm text-white/65">{dictionary.staff.quickBookShopClosed}</p>
          ) : barberClosed ? (
            <p className="p-2 text-sm text-white/75">
              {currentClosure
                ? `${dictionary.staff.quickBookBarberClosed} ${reasonLabel(currentClosure.reason, dictionary)}.`
                : dictionary.staff.quickBookBarberClosed}
            </p>
          ) : loadingSlots ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {Array.from({ length: 12 }, (_, index) => (
                <div key={index} className="h-10 animate-pulse rounded-[0.7rem] bg-white/8" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <p className="p-2 text-sm text-white/65">{dictionary.staff.quickBookEmpty}</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => (
                <button
                  key={slot.key}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => slot.available && setOpenSlot(slot)}
                  className={`slot-button ${slot.available ? "text-white/85 hover:text-white" : "opacity-45"}`}
                >
                  <span className="block text-[0.92rem] font-semibold">{slot.localTime}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {openSlot ? (
        <div className="quickbook-modal-shell" role="dialog" aria-modal="true" aria-label={dictionary.staff.quickBookModalTitle}>
          <div className="quickbook-modal-backdrop" onClick={closeModal} aria-hidden />
          <div className="quickbook-modal premium-card p-5 sm:p-6">
            <p className="eyebrow text-[var(--color-accent)]">{dictionary.staff.quickBookModalTitle}</p>
            <p className="mt-2 text-sm text-white/75">
              {formatConfirmationDate(selectedDate, language)} · {openSlot.localTime}
            </p>

            <label className="field-label mt-4">
              {dictionary.staff.quickBookFirstName}
              <input
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="field-input"
                autoFocus
                required
                minLength={2}
              />
            </label>

            <label className="field-label mt-3">
              {dictionary.staff.quickBookLastName}
              <input
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="field-input"
                required
                minLength={2}
              />
            </label>

            <label className="field-label mt-3">
              {dictionary.staff.quickBookService}
              <select
                value={serviceId}
                onChange={(event) => setServiceId(event.target.value as ServiceId)}
                className="field-input"
              >
                {SERVICES.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name[language]} · {service.durationMinutes} min · {service.price}€
                  </option>
                ))}
              </select>
            </label>

            {errorCode ? (
              <p className="mt-3 text-sm text-rose-300">
                {errorCode === "SLOT_TAKEN"
                  ? dictionary.booking.errors.SLOT_TAKEN
                  : errorCode === "BARBER_CLOSED"
                    ? dictionary.booking.errors.BARBER_CLOSED
                    : errorCode === "INVALID_REQUEST"
                      ? dictionary.booking.errors.INVALID_REQUEST
                      : dictionary.booking.errors.BOOKING_SAVE_FAILED}
              </p>
            ) : null}

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={submitting}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? dictionary.staff.quickBookPending : dictionary.staff.quickBookConfirm}
              </button>
              <button type="button" onClick={closeModal} className="btn-secondary">
                {dictionary.staff.quickBookCancel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
