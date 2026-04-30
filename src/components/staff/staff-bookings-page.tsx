"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { BRAND_ASSETS } from "@/lib/constants";
import { ClientBookingError, listClientStaffBookings, softDeleteClientBooking, staffLogout } from "@/lib/booking/client";
import type { StaffBookingItem } from "@/lib/booking/types";
import { useLanguage } from "@/components/providers/language-provider";
import { BrandImage } from "@/components/ui/brand-image";

export function StaffBookingsPage() {
  const router = useRouter();
  const { dictionary } = useLanguage();
  const [bookings, setBookings] = useState<StaffBookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadBookings() {
      setIsLoading(true);
      setMessage("");

      try {
        const nextBookings = await listClientStaffBookings();

        if (!ignore) {
          setBookings(nextBookings);
        }
      } catch (error) {
        if (!ignore) {
          setBookings([]);
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

    void loadBookings();

    return () => {
      ignore = true;
    };
  }, [dictionary.staff.authRequired, router]);

  async function handleDelete(booking: StaffBookingItem) {
    const confirmed = window.confirm(dictionary.staff.deleteConfirm);

    if (!confirmed) {
      return;
    }

    try {
      await softDeleteClientBooking(booking);
      setBookings((current) => current.filter((item) => item.bookingId !== booking.bookingId));
      setMessage(dictionary.staff.deleted);
    } catch (error) {
      if (error instanceof ClientBookingError && error.code === "UNAUTHORIZED") {
        router.replace("/staff/login");
      }

      setMessage(dictionary.staff.authRequired);
    }
  }

  async function handleSignOut() {
    try {
      await staffLogout();
    } finally {
      router.replace("/staff/login");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="w-full space-y-5">
        <div className="premium-card flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
          <div>
            <p className="eyebrow text-[var(--color-accent)]">{dictionary.staff.panelEyebrow}</p>
            <h1 className="mt-3 font-display text-5xl uppercase leading-none tracking-[0.06em] text-white">
              {dictionary.staff.bookingsTitle}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/62">{dictionary.staff.bookingsBody}</p>
          </div>

          <button type="button" onClick={handleSignOut} className="btn-secondary">
            {dictionary.common.signOut}
          </button>
        </div>

        {message ? (
          <div className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/72">
            {message}
          </div>
        ) : null}

        {isLoading ? (
          <div className="premium-card p-6 text-white/62">{dictionary.staff.loading}</div>
        ) : bookings.length === 0 ? (
          <div className="premium-card p-6 text-white/62">{dictionary.staff.empty}</div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <article key={booking.bookingId} className="premium-card p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      [dictionary.booking.summaryName, `${booking.customerFirstName} ${booking.customerLastName}`],
                      [dictionary.booking.summaryPhone, booking.customerPhone],
                      [dictionary.booking.summaryBarber, booking.barberName],
                      [dictionary.booking.summaryTime, `${booking.localDate} - ${booking.localTime}`],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/42">{label}</p>
                        <p className="mt-2 font-semibold text-white">{value}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleDelete(booking)}
                    className="min-h-12 rounded-full border border-rose-400/25 bg-rose-500/10 px-5 text-sm font-bold uppercase tracking-[0.18em] text-rose-100 transition hover:bg-rose-500/18"
                  >
                    {dictionary.common.delete}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="premium-card overflow-hidden">
          <div className="image-panel aspect-[2.4] rounded-none border-0">
            <BrandImage
              src={BRAND_ASSETS.gallery[2]}
              alt="Barber Brothers shop work"
              className="h-full w-full"
              imgClassName="image-fill"
              fallbackLabel="Shop"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
