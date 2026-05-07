"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { listClientStaffBookings } from "@/lib/booking/client";
import { useLanguage } from "@/components/providers/language-provider";

export default function StaffRoute() {
  const router = useRouter();
  const { dictionary } = useLanguage();

  useEffect(() => {
    let ignore = false;

    async function routeStaff() {
      try {
        await listClientStaffBookings();

        if (!ignore) {
          router.replace("/staff/bookings");
        }
      } catch {
        if (!ignore) {
          router.replace("/staff/login");
        }
      }
    }

    void routeStaff();

    return () => {
      ignore = true;
    };
  }, [router]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="premium-card w-full p-6 text-center">
        <p className="eyebrow text-[var(--color-accent)]">{dictionary.staff.panelEyebrow}</p>
        <p className="mt-4 text-sm text-white/62">{dictionary.staff.loading}</p>
      </section>
    </div>
  );
}
