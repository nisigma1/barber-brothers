"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ClientBookingError,
  getStaffSession,
  listClientStaffBookings,
  softDeleteClientBooking,
  staffLogout,
} from "@/lib/booking/client";
import type { StaffBookingItem } from "@/lib/booking/types";
import { formatConfirmationDate, getTodayLocalDate, addDaysToLocalDate } from "@/lib/booking/time";
import { useLanguage } from "@/components/providers/language-provider";
import { QuickBookPanel } from "@/components/staff/quick-book-panel";

type StaffGroup = {
  key: string;
  label: string;
  items: StaffBookingItem[];
};

function groupBookingsByDate(
  bookings: StaffBookingItem[],
  language: "sq" | "en",
  dictionary: ReturnType<typeof useLanguage>["dictionary"],
): StaffGroup[] {
  const today = getTodayLocalDate();
  const tomorrow = addDaysToLocalDate(today, 1);
  const groups = new Map<string, StaffBookingItem[]>();

  const sorted = [...bookings].sort((a, b) => {
    if (a.localDate === b.localDate) {
      return a.localTime.localeCompare(b.localTime);
    }
    return a.localDate.localeCompare(b.localDate);
  });

  for (const booking of sorted) {
    const existing = groups.get(booking.localDate);
    if (existing) {
      existing.push(booking);
    } else {
      groups.set(booking.localDate, [booking]);
    }
  }

  return Array.from(groups.entries()).map(([localDate, items]) => {
    let label: string;
    if (localDate === today) {
      label = dictionary.staff.groupToday;
    } else if (localDate === tomorrow) {
      label = dictionary.staff.groupTomorrow;
    } else {
      label = formatConfirmationDate(localDate, language);
    }
    return { key: localDate, label, items };
  });
}

export function StaffBookingsPage() {
  const router = useRouter();
  const { dictionary, language } = useLanguage();
  const [bookings, setBookings] = useState<StaffBookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [barberId, setBarberId] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  function toggleGroup(key: string) {
    setOpenGroups((current) => ({ ...current, [key]: !current[key] }));
  }

  useEffect(() => {
    let ignore = false;

    async function loadAll() {
      setIsLoading(true);
      setMessage("");

      try {
        const [session, nextBookings] = await Promise.all([
          getStaffSession(),
          listClientStaffBookings(),
        ]);

        if (!ignore) {
          setBarberId(session.barberId);
          setBookings(nextBookings);
        }
      } catch (error) {
        if (!ignore) {
          setBookings([]);
          setBarberId(null);
          setMessage(dictionary.staff.authRequired);

          if (error instanceof ClientBookingError && error.code === "UNAUTHORIZED") {
            router.replace("/staff/login");
          }
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadAll();

    return () => {
      ignore = true;
    };
  }, [dictionary.staff.authRequired, router]);

  function handleQuickBookCreated(booking: StaffBookingItem) {
    setBookings((current) => [...current, booking]);
    setMessage(dictionary.staff.quickBookSuccess);
  }

  const groups = useMemo(
    () => groupBookingsByDate(bookings, language, dictionary),
    [bookings, language, dictionary],
  );

  async function handleDelete(booking: StaffBookingItem) {
    setDeletingId(booking.bookingId);
    try {
      await softDeleteClientBooking(booking);
      setBookings((current) => current.filter((item) => item.bookingId !== booking.bookingId));
      setMessage(dictionary.staff.deleted);
      setConfirmingId(null);
      if (expandedId === booking.bookingId) {
        setExpandedId(null);
      }
    } catch (error) {
      if (error instanceof ClientBookingError && error.code === "UNAUTHORIZED") {
        router.replace("/staff/login");
      }

      setMessage(dictionary.staff.authRequired);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSignOut() {
    try {
      await staffLogout();
    } finally {
      router.replace("/staff/login");
    }
  }

  function toggleExpand(bookingId: string) {
    setExpandedId((current) => (current === bookingId ? null : bookingId));
    setConfirmingId(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="premium-card mb-4 flex flex-row items-center justify-between gap-3 p-3 sm:p-4">
        <div className="min-w-0">
          <p className="eyebrow text-[var(--color-accent)]">{dictionary.staff.panelEyebrow}</p>
          <h1 className="mt-0.5 font-display text-2xl uppercase leading-none tracking-[0.04em] text-white sm:text-3xl">
            {dictionary.staff.bookingsTitle}
          </h1>
          <p className="mt-1 text-xs text-white/58 sm:text-sm">
            {bookings.length}{" "}
            {bookings.length === 1 ? dictionary.staff.bookingCountOne : dictionary.staff.bookingCount}
          </p>
        </div>

        <button type="button" onClick={handleSignOut} className="btn-secondary shrink-0">
          {dictionary.common.signOut}
          </button>
        </div>

      {message ? (
        <div className="mb-4 rounded-[1rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/72">
          {message}
        </div>
      ) : null}

      <div className="staff-dashboard-grid">
        <div className="staff-dashboard-bookings">
          {isLoading ? (
            <div className="premium-card p-5 text-sm text-white/62">{dictionary.staff.loading}</div>
          ) : bookings.length === 0 ? (
            <div className="premium-card p-5 text-sm text-white/62">{dictionary.staff.empty}</div>
          ) : (
            <div className="flex flex-col gap-4">
              {groups.map((group) => {
                const isGroupOpen = openGroups[group.key] === true;
                return (
              <section key={group.key} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.key)}
                  aria-expanded={isGroupOpen}
                  className="staff-group-heading staff-group-toggle"
                >
                  <span>{group.label}</span>
                  <span className="staff-group-meta">
                    <span className="staff-group-count">
                      {group.items.length}{" "}
                      {group.items.length === 1 ? dictionary.staff.bookingCountOne : dictionary.staff.bookingCount}
                    </span>
                    <span
                      className={`staff-group-arrow${isGroupOpen ? " is-open" : ""}`}
                      aria-hidden
                    >
                      ▼
                    </span>
                  </span>
                </button>

                <div
                  className={`staff-group-list-wrap${isGroupOpen ? " is-open" : ""}`}
                  aria-hidden={!isGroupOpen}
                >
                <div className="staff-group-list">
                  {group.items.map((booking) => {
                    const expanded = expandedId === booking.bookingId;
                    const confirming = confirmingId === booking.bookingId;
                    const isDeleting = deletingId === booking.bookingId;

                    return (
                      <div key={booking.bookingId}>
                        <button
                          type="button"
                          aria-expanded={expanded}
                          onClick={() => toggleExpand(booking.bookingId)}
                          className="staff-row"
                        >
                          <span className="staff-row-time">
                            <span className="staff-row-time-start">{booking.localTime}</span>
                            <span className="staff-row-time-end">→ {booking.endLocalTime}</span>
                          </span>
                          <span className="staff-row-body">
                            <span className="staff-row-name">
                              {booking.customerFirstName} {booking.customerLastName}
                            </span>
                            <span className="staff-row-meta">
                              {booking.barberName} · {booking.serviceName} ·{" "}
                              {booking.servicePrice} {booking.currency === "euro" ? "€" : booking.currency}
                            </span>
                          </span>
                          <span className="staff-row-chevron" aria-hidden>
                            ▾
                          </span>
                        </button>

                        {expanded ? (
                          <div className="staff-row-details">
                            <div className="staff-row-detail-line">
                              <span>{dictionary.booking.summaryPhone}</span>
                              <strong>{booking.customerPhone}</strong>
                            </div>
                            <div className="staff-row-detail-line">
                              <span>{dictionary.booking.summaryService}</span>
                              <strong>
                                {booking.serviceName} · {booking.serviceDurationMinutes} min
                              </strong>
                            </div>
                            <div className="staff-row-detail-line">
                              <span>{dictionary.booking.summaryBarber}</span>
                              <strong>{booking.barberName}</strong>
                            </div>

                            <div className="staff-row-detail-actions">
                              <a
                                href={`tel:${booking.customerPhone}`}
                                className="btn-ghost"
                              >
                                {dictionary.staff.callClient}
                              </a>

                              {confirming ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmingId(null)}
                                    className="btn-ghost"
                                    disabled={isDeleting}
                                  >
                                    {dictionary.staff.keepBooking}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => void handleDelete(booking)}
                                    className="btn-danger-ghost"
                                    disabled={isDeleting}
                                  >
                                    {isDeleting ? dictionary.staff.loading : dictionary.staff.cancelConfirm}
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmingId(booking.bookingId)}
                                  className="btn-danger-ghost"
                                >
                                  {dictionary.staff.cancelShort}
                                </button>
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                </div>
              </section>
                );
              })}
            </div>
          )}
        </div>

        <div className="staff-dashboard-aside">
          {barberId ? (
            <QuickBookPanel barberId={barberId} onBookingCreated={handleQuickBookCreated} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
