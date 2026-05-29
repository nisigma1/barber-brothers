import type { Metadata, Viewport } from "next";
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
document.documentElement.dataset.theme = "dark";
document.documentElement.style.colorScheme = "dark";
try {
  var language = localStorage.getItem("barber-brothers-language");
  document.documentElement.lang = language === "sq" ? "sq" : "en";
} catch (_) {
  document.documentElement.lang = "en";
}
`;

const swRegistrationScript = `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {});
  });
}
`;

const siteUrl = "https://barberbrothers.style";
const brandLogoUrl = "/brand/barber-brothers-logo-512.png";
const absoluteBrandLogoUrl = `${siteUrl}${brandLogoUrl}`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0805" },
    { media: "(prefers-color-scheme: light)", color: "#0a0805" },
  ],
};

const ROOT_TITLE = "Barber Brothers | Premium Barber Booking in Fushë Kosovë";
const ROOT_DESCRIPTION =
  "Book your appointment online at Barber Brothers in Fushë Kosovë. Premium haircuts, beard trims and no-wait barber service.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: ROOT_TITLE,
    template: "%s | Barber Brothers",
  },
  description: ROOT_DESCRIPTION,
  keywords: [
    "Barber Brothers",
    "barberbrothers",
    "Brothers Cuts",
    "barber Fushë Kosovë",
    "barber Fushe Kosove",
    "barber Kosovo",
    "barber Pristina",
    "barber near me",
    "online barber booking",
    "haircut Fushë Kosovë",
    "beard trim Fushë Kosovë",
    "premium barber Kosovo",
    "best barber Kosovo",
    "barber shop online booking",
    "berber Fushë Kosovë",
    "berber afër meje",
    "rezervim berber online",
    "qethje flokësh Fushë Kosovë",
    "rregullim mjekrre Fushë Kosovë",
    "berber pa pritje",
    "termin berberi online",
    "barber shop Kosovë",
    "barber Prishtinë",
    "Kosova barber",
    "berber Kosova diaspora",
    "barber für Kosovaren",
    "albanischer Friseur",
    "albanischer Barber Deutschland",
    "albanischer Barber Schweiz",
    "Kosovo Albanian barber",
    "Uraniku",
    "Hysi",
    "Ylli",
    "Edi",
    "Arti",
  ],
  applicationName: BRAND_NAME,
  authors: [{ name: BRAND_NAME, url: siteUrl }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  category: "barber shop",
  alternates: {
    canonical: "/",
    languages: {
      "en": "/",
      "en-US": "/",
      "en-GB": "/",
      "en-CA": "/",
      "en-AU": "/",
      "sq": "/",
      "sq-AL": "/",
      "sq-XK": "/",
      "sq-MK": "/",
      "de": "/",
      "de-DE": "/",
      "de-CH": "/",
      "de-AT": "/",
      "fr-CH": "/",
      "it-CH": "/",
      "x-default": "/",
    },
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Barber Brothers",
    statusBarStyle: "black-translucent",
  },
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
      "max-video-preview": -1,
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
  "@id": `${siteUrl}/#barbershop`,
  name: BRAND_NAME,
  alternateName: "Brothers Cuts",
  description: ROOT_DESCRIPTION,
  url: siteUrl,
  logo: absoluteBrandLogoUrl,
  image: [absoluteBrandLogoUrl],
  telephone: [CONTACT_DETAILS.primaryPhone, CONTACT_DETAILS.secondaryPhone],
  priceRange: "€2 – €15",
  currenciesAccepted: "EUR",
  paymentAccepted: "Cash",
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT_DETAILS.address,
    addressLocality: "Fushë Kosovë",
    addressRegion: "Prishtinë",
    postalCode: "12000",
    addressCountry: "XK",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 42.6388,
    longitude: 21.0962,
  },
  hasMap: CONTACT_DETAILS.mapsHref,
  areaServed: [
    { "@type": "City", name: "Fushë Kosovë" },
    { "@type": "City", name: "Prishtinë" },
    { "@type": "City", name: "Pristina" },
    { "@type": "AdministrativeArea", name: "Kosovë" },
    { "@type": "Country", name: "Kosovo" },
    { "@type": "Country", name: "Albania" },
    { "@type": "Country", name: "North Macedonia" },
  ],
  knowsLanguage: ["sq", "en", "de"],
  audience: {
    "@type": "Audience",
    geographicArea: [
      { "@type": "Country", name: "Kosovo" },
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "Switzerland" },
      { "@type": "Country", name: "Austria" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "Sweden" },
    ],
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:30",
      closes: "20:30",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Shërbime berberi",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Qethje flokësh", description: "Prerje e pastër me finish preciz" },
        price: "5",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Rregullim mjekrre", description: "Kontur i qartë dhe formë e kontrolluar" },
        price: "2",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Tretman i fytyrës", description: "Trajtim i qetë me finish premium" },
        price: "15",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "All-in-One", description: "Tretman fytyre, qethje dhe rregullim mjekrre" },
        price: "15",
        priceCurrency: "EUR",
      },
    ],
  },
  potentialAction: {
    "@type": "ReserveAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/booking`,
      inLanguage: "sq-AL",
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    result: { "@type": "Reservation", name: "Termin berberi" },
  },
  sameAs: [
    `https://instagram.com/${CONTACT_DETAILS.instagramHandle}`,
    CONTACT_DETAILS.mapsHref,
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: BRAND_NAME,
  inLanguage: ["sq-AL", "en-US"],
  publisher: { "@id": `${siteUrl}/#barbershop` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${barlow.variable} h-full antialiased`}
    >
      <head>
        {/* Apple/iOS standalone PWA. Next.js metadata generates only the
            modern "mobile-web-app-capable" tag; older iOS Safari versions
            still require the apple-prefixed alias to honor display:standalone
            from the homescreen icon. Both are emitted defensively. */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="application-name" content="Barber Brothers" />
        <meta name="msapplication-TileColor" content="#0a0805" />
        <meta name="msapplication-tap-highlight" content="no" />
        {/* Preload the LCP hero asset so the browser kicks off the fetch
            before it parses the rest of the document. The webp is tiny
            (~12KB) so this is cheap, and it visibly shortens LCP. */}
        <link rel="preload" as="image" href="/brand/hero-logo.webp" fetchPriority="high" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/brand/barber-brothers-logo-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/brand/barber-brothers-logo-512.png" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script dangerouslySetInnerHTML={{ __html: swRegistrationScript }} defer />
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
