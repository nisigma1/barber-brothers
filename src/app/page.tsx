import type { Metadata } from "next";

import { HomePage } from "@/components/home/home-page";

export const metadata: Metadata = {
  title: {
    absolute: "Barber Brothers | Rezervim Online për Berber në Fushë Kosovë",
  },
  description:
    "Rezervo termin online te Barber Brothers në Fushë Kosovë. Shërbim premium, prerje të sakta, rregullim mjekrre dhe termin pa pritje.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Barber Brothers | Rezervim Online për Berber në Fushë Kosovë",
    description:
      "Rezervo termin online te Barber Brothers në Fushë Kosovë. Shërbim premium dhe termin pa pritje.",
    url: "https://barberbrothers.style/",
    type: "website",
    locale: "sq_AL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barber Brothers | Berber në Fushë Kosovë",
    description:
      "Rezervo termin online te Barber Brothers në Fushë Kosovë. Shërbim premium dhe termin pa pritje.",
  },
};

export default function Home() {
  return <HomePage />;
}
