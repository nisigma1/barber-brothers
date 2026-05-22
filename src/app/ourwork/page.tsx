import type { Metadata } from "next";

import { OurworkPage } from "@/components/ourwork/ourwork-page";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Editorial gallery of recent cuts at Barber Brothers in Fushë Kosovë. Precision fades, beard work and controlled styling by Uraniku, Hysi, Ylli, Edi and Arti.",
  alternates: { canonical: "/ourwork" },
  openGraph: {
    title: "Our Work | Barber Brothers",
    description:
      "Editorial gallery of recent cuts at Barber Brothers in Fushë Kosovë. Precision fades and clean styling.",
    url: "https://barberbrothers.style/ourwork",
    type: "website",
    locale: "en_US",
    alternateLocale: ["sq_AL"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Work | Barber Brothers",
    description:
      "Editorial gallery of recent cuts at Barber Brothers in Fushë Kosovë.",
  },
};

export default function Ourwork() {
  return <OurworkPage />;
}
