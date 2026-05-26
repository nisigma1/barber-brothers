"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { isBarberClosedOnDate } from "@/lib/barbers";
import {
  ClientBookingError,
  getClientAvailability,
  staffQuickBook,
} from "@/lib/booking/client";
import {
  getBookableDateOptions,
  getFirstOpenBookableDate,
  isShopClosedOnDate,
} from "@/lib/booking/time";
import type {
  AvailabilitySlot,
  ServiceId,
  StaffBookingItem,
} from "@/lib/booking/types";
import { useLanguage } from "@/components/providers/language-provider";

interface Props {
  barberId: string;
  onBookingCreated(booking: StaffBookingItem): void;
}

const DEFAULT_SERVICE: ServiceId = "haircut";

export function QuickBookPanel({ barberId, onBookingCreated }: Props) {
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

  const dateOptions = useMemo(() => getBookableDateOptions(language), [language]);
  const shopClosed = isShopClosedOnDate(selectedDate);
  const barberClosed = !shopClosed && isBarberClosedOnDate(barberId, selectedDate);

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
  }, [barberId, selectedDate, serviceId, shopClosed, barberClosed]);

  useEffect(() => {
    // Data-fetching effect: must update state after fetch resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshSlots();
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

            return (
              <button
                key={dateOption.localDate}
                type="button"
                aria-pressed={active}
                disabled={dateOption.closed}
                onClick={() => setSelectedDate(dateOption.localDate)}
                className={`date-pill text-left text-xs disabled:cursor-not-allowed disabled:opacity-45 sm:text-sm ${active ? "selected-card" : ""}`}
              >
                <span className="block font-semibold text-white">{dateOption.label}</span>
                {dateOption.closed ? (
                  <span className="mt-0.5 block text-[0.6rem] uppercase tracking-[0.14em] text-white/45">
                    {dictionary.booking.closedDay}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <p className="eyebrow text-white/45">{dictionary.staff.quickBookSlotLabel}</p>
        <div className="mt-2 rounded-[1rem] border border-white/10 bg-black/24 p-3">
          {shopClosed ? (
            <p className="p-2 text-sm text-white/65">{dictionary.staff.quickBookShopClosed}</p>
          ) : barberClosed ? (
            <p className="p-2 text-sm text-white/75">{dictionary.staff.quickBookBarberClosed}</p>
          ) : loadingSlots ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-[0.7rem] bg-white/8" />
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
              {selectedDate} - {openSlot.localTime}
            </p>

            <label className="field-label mt-4">
              {dictionary.staff.quickBookFirstName}
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                onChange={(e) => setLastName(e.target.value)}
                className="field-input"
                required
                minLength={2}
              />
            </label>

            <label className="field-label mt-3">
              {dictionary.staff.quickBookService}
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value as ServiceId)}
                className="field-input"
              >
                <option value="haircut">Qethje flokesh - 30 min - 5€</option>
                <option value="beard-trim">Rregullim mjekrre - 30 min - 2€</option>
                <option value="face-treatment">Tretman fytyre - 60 min - 15€</option>
                <option value="all-in-one">All-in-One - 60 min - 15€</option>
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
