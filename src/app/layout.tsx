import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LanguageProvider } from "@/components/providers/language-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { BRAND_NAME, CONTACT_DETAILS } from "@/lib/constants";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const themeScript = `
try {
  var theme = localStorage.getItem("barber-brothers-theme");
  if (theme !== "dark" && theme !== "light") theme = "light";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  var language = localStorage.getItem("barber-brothers-language");
  document.documentElement.lang = language === "en" ? "en" : "sq";
} catch (_) {}
`;

const siteUrl = "https://barberbrothers.style";
const brandLogoUrl = "/brand/barber-brothers-logo-512.png";
const absoluteBrandLogoUrl = `${siteUrl}${brandLogoUrl}`;

const ROOT_TITLE = "Barber Brothers — Premium Barber, Fushe Kosove";
const ROOT_DESCRIPTION =
  "Premium barber shop in Fushe Kosove, Kosovo. Book your appointment online with Uraniku or Hysi. Haircut, beard trim, face treatment and the All-in-One package.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: ROOT_TITLE,
    template: "%s — Barber Brothers",
  },
  description: ROOT_DESCRIPTION,
  keywords: [
    "barber",
    "barber shop",
    "Fushe Kosove",
    "Kosova",
    "Kosovo",
    "haircut",
    "beard trim",
    "face treatment",
    "online booking",
    "Barber Brothers",
    "premium barber",
    "Uraniku",
    "Hysi",
  ],
  applicationName: BRAND_NAME,
  authors: [{ name: BRAND_NAME, url: siteUrl }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  category: "barber shop",
  alternates: {
    canonical: "/",
  },
  manifest: "/site.webmanifest",
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: brandLogoUrl, sizes: "512x512", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: ROOT_TITLE,
    description: ROOT_DESCRIPTION,
    url: siteUrl,
    siteName: BRAND_NAME,
    type: "website",
    locale: "en_US",
    alternateLocale: ["sq_AL"],
    images: [{ url: brandLogoUrl, width: 512, height: 512, alt: "Barber Brothers logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: ROOT_TITLE,
    description: ROOT_DESCRIPTION,
    images: [{ url: brandLogoUrl, alt: "Barber Brothers logo" }],
  },
};

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "BarberShop",
  name: BRAND_NAME,
  description: ROOT_DESCRIPTION,
  url: siteUrl,
  logo: absoluteBrandLogoUrl,
  image: absoluteBrandLogoUrl,
  telephone: [CONTACT_DETAILS.primaryPhone, CONTACT_DETAILS.secondaryPhone],
  priceRange: "€2 – €15",
  currenciesAccepted: "EUR",
  paymentAccepted: "Cash",
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT_DETAILS.address,
    addressLocality: "Fushe Kosove",
    addressRegion: "Pristina",
    addressCountry: "XK",
  },
  hasMap: CONTACT_DETAILS.mapsHref,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:30",
      closes: "20:30",
    },
  ],
  sameAs: [
    `https://instagram.com/${CONTACT_DETAILS.instagramHandle}`,
    CONTACT_DETAILS.mapsHref,
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sq"
      suppressHydrationWarning
      className={`${manrope.variable} ${barlow.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
      </head>
      <body className="min-h-full">
        <ThemeProvider>
          <LanguageProvider>
            <div className="flex min-h-full flex-col">
              <SiteHeader />
              <main className="flex flex-1 flex-col">{children}</main>
              <SiteFooter />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
