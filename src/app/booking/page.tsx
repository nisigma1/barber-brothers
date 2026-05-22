import type { Metadata } from "next";

import { BookingPage } from "@/components/booking/booking-page";

export const metadata: Metadata = {
  title: "Book Online",
  description:
    "Book your appointment online at Barber Brothers in Fushë Kosovë. Choose your barber, service and time slot. Instant confirmation, no phone calls, no waiting.",
  alternates: { canonical: "/booking" },
  openGraph: {
    title: "Book Online | Barber Brothers",
    description:
      "Book your appointment online at Barber Brothers in Fushë Kosovë. Live availability, instant confirmation.",
    url: "https://barberbrothers.style/booking",
    type: "website",
    locale: "en_US",
    alternateLocale: ["sq_AL"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Online | Barber Brothers",
    description:
      "Book your appointment online at Barber Brothers in Fushë Kosovë. Live availability, instant confirmation.",
  },
};

export default function BookingRoute() {
  return <BookingPage />;
}
