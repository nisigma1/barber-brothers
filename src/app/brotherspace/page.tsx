import type { Metadata } from "next";

import { BrotherspacePage } from "@/components/brotherspace/brotherspace-page";

export const metadata: Metadata = {
  title: "The Space",
  description:
    "Step inside Barber Brothers in Fushë Kosovë — quiet light, controlled detail and the studio atmosphere where every premium cut is delivered.",
  alternates: { canonical: "/brotherspace" },
  openGraph: {
    title: "The Space | Barber Brothers",
    description:
      "Inside the Barber Brothers shop in Fushë Kosovë. Interior, detail and entrance.",
    url: "https://barberbrothers.style/brotherspace",
    type: "website",
    locale: "en_US",
    alternateLocale: ["sq_AL"],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Space | Barber Brothers",
    description:
      "Inside the Barber Brothers shop in Fushë Kosovë.",
  },
};

export default function Brotherspace() {
  return <BrotherspacePage />;
}
