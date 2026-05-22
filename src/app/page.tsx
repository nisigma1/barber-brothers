import type { Metadata } from "next";

import { HomePage } from "@/components/home/home-page";

export const metadata: Metadata = {
  title: {
    absolute: "Barber Brothers | Premium Barber Booking in Fushë Kosovë",
  },
  description:
    "Book your appointment online at Barber Brothers in Fushë Kosovë. Premium haircuts, beard trims and no-wait barber service.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Barber Brothers | Premium Barber Booking in Fushë Kosovë",
    description:
      "Book your appointment online at Barber Brothers in Fushë Kosovë. Premium haircuts, beard trims and no-wait barber service.",
    url: "https://barberbrothers.style/",
    type: "website",
    locale: "en_US",
    alternateLocale: ["sq_AL"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barber Brothers | Barber in Fushë Kosovë",
    description:
      "Book your appointment online at Barber Brothers in Fushë Kosovë. Premium haircuts and no-wait service.",
  },
};

export default function Home() {
  return <HomePage />;
}
