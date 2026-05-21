import type { Metadata } from "next";

import { OurworkPage } from "@/components/ourwork/ourwork-page";

export const metadata: Metadata = {
  title: "Punët tona",
  description:
    "Galeri me prerje reale te Barber Brothers në Fushë Kosovë. Qethje precize, rregullim mjekrre dhe stil i kontrolluar nga Uraniku dhe Hysi.",
  alternates: { canonical: "/ourwork" },
  openGraph: {
    title: "Punët tona | Barber Brothers",
    description:
      "Galeri me prerje reale te Barber Brothers në Fushë Kosovë. Qethje precize dhe stil i kontrolluar.",
    url: "https://barberbrothers.style/ourwork",
    type: "website",
    locale: "sq_AL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Punët tona | Barber Brothers",
    description:
      "Galeri me prerje reale te Barber Brothers në Fushë Kosovë.",
  },
};

export default function Ourwork() {
  return <OurworkPage />;
}
