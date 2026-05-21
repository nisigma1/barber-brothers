import type { Metadata } from "next";

import { OurworkPage } from "@/components/ourwork/ourwork-page";

export const metadata: Metadata = {
  title: "Our work",
  description:
    "Editorial gallery of recent cuts at Barber Brothers, Fushe Kosove. Precision fades, beard work, and styling by Uraniku and Hysi.",
  alternates: { canonical: "/ourwork" },
  openGraph: {
    title: "Our work — Barber Brothers",
    description:
      "Editorial gallery of recent cuts at Barber Brothers, Fushe Kosove.",
    url: "https://barberbrothers.style/ourwork",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our work — Barber Brothers",
    description:
      "Editorial gallery of recent cuts at Barber Brothers, Fushe Kosove.",
  },
};

export default function Ourwork() {
  return <OurworkPage />;
}
