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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: BRAND_NAME,
  description: "Instant online booking for Barber Brothers in Fushe Kosove.",
  alternates: {
    canonical: "/",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
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
    title: BRAND_NAME,
    description: "Rezervim i thjeshte online per Barber Brothers ne Fushe Kosove.",
    url: siteUrl,
    siteName: BRAND_NAME,
    type: "website",
    images: [{ url: brandLogoUrl, width: 512, height: 512, alt: "Barber Brothers logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_NAME,
    description: "Rezervim i thjeshte online per Barber Brothers ne Fushe Kosove.",
    images: [{ url: brandLogoUrl, alt: "Barber Brothers logo" }],
  },
};

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: BRAND_NAME,
  url: siteUrl,
  logo: absoluteBrandLogoUrl,
  image: absoluteBrandLogoUrl,
  telephone: CONTACT_DETAILS.primaryPhone,
  priceRange: "5 euro",
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT_DETAILS.address,
    addressLocality: "Fushe Kosove",
    addressCountry: "XK",
  },
  hasMap: CONTACT_DETAILS.mapsHref,
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
