import type { Metadata } from "next";

import { BrotherspacePage } from "@/components/brotherspace/brotherspace-page";

export const metadata: Metadata = {
  title: "The space",
  description:
    "A look inside Barber Brothers in Fushe Kosove — quiet light, controlled detail, and the atmosphere where every cut is delivered.",
  alternates: { canonical: "/brotherspace" },
  openGraph: {
    title: "The space — Barber Brothers",
    description:
      "Inside the Barber Brothers shop in Fushe Kosove. Interior, detail, entrance.",
    url: "https://barberbrothers.style/brotherspace",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The space — Barber Brothers",
    description:
      "Inside the Barber Brothers shop in Fushe Kosove.",
  },
};

export default function Brotherspace() {
  return <BrotherspacePage />;
}
