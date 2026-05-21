import type { Metadata } from "next";

import { BrotherspacePage } from "@/components/brotherspace/brotherspace-page";

export const metadata: Metadata = {
  title: "Ambienti — Barber Studio",
  description:
    "Hidhi nje sy ambientit te Barber Brothers ne Fushe Kosove. Dritë e qetë, detaj i kontrolluar dhe studio premium per berber.",
  alternates: { canonical: "/brotherspace" },
  openGraph: {
    title: "Ambienti | Barber Brothers",
    description:
      "Brenda studios Barber Brothers ne Fushe Kosove. Interier, detaj, hyrja.",
    url: "https://barberbrothers.style/brotherspace",
    type: "website",
    locale: "sq_AL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ambienti | Barber Brothers",
    description:
      "Brenda studios Barber Brothers ne Fushe Kosove.",
  },
};

export default function Brotherspace() {
  return <BrotherspacePage />;
}
