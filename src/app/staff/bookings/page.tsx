import type { Metadata } from "next";

import { StaffBookingsPage } from "@/components/staff/staff-bookings-page";

export const metadata: Metadata = {
  title: "Staff bookings",
  manifest: "/staff-manifest.json",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function StaffBookingsRoute() {
  return <StaffBookingsPage />;
}
