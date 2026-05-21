import type { Metadata } from "next";

import { BookingPage } from "@/components/booking/booking-page";

export const metadata: Metadata = {
  title: "Rezervo Termin Online",
  description:
    "Rezervo termin online te Barber Brothers në Fushë Kosovë. Zgjidh shërbimin, berberin dhe orarin. Konfirmim direkt, pa pritje dhe pa telefonata.",
  alternates: { canonical: "/booking" },
  openGraph: {
    title: "Rezervo Termin Online | Barber Brothers",
    description:
      "Rezervo termin online te Barber Brothers në Fushë Kosovë. Konfirmim direkt dhe pa pritje.",
    url: "https://barberbrothers.style/booking",
    type: "website",
    locale: "sq_AL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rezervo Termin Online | Barber Brothers",
    description:
      "Rezervo termin online te Barber Brothers në Fushë Kosovë. Konfirmim direkt dhe pa pritje.",
  },
};

export default function BookingRoute() {
  return <BookingPage />;
}
