import type { Metadata } from "next";

import { BookingPage } from "@/components/booking/booking-page";

export const metadata: Metadata = {
  title: "Book online",
  description:
    "Book your appointment with Uraniku or Hysi at Barber Brothers in Fushe Kosove. Choose a service, pick a time slot, confirm in under a minute. No phone calls, no waiting.",
  alternates: { canonical: "/booking" },
  openGraph: {
    title: "Book online — Barber Brothers",
    description:
      "Reserve your slot at Barber Brothers, Fushe Kosove. Live availability, instant confirmation.",
    url: "https://barberbrothers.style/booking",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book online — Barber Brothers",
    description:
      "Reserve your slot at Barber Brothers, Fushe Kosove. Live availability, instant confirmation.",
  },
};

export default function BookingRoute() {
  return <BookingPage />;
}
