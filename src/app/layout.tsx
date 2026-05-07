import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LanguageProvider } from "@/components/providers/language-provider";

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

export const metadata: Metadata = {
  title: "Barber Brothers",
  description: "Instant online booking for Barber Brothers in Fushe Kosove.",
  icons: {
    icon: "/brand/logo.jpg",
    apple: "/brand/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sq"
      className={`${manrope.variable} ${barlow.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <LanguageProvider>
          <div className="flex min-h-full flex-col">
            <SiteHeader />
            <main className="flex flex-1 flex-col">{children}</main>
            <SiteFooter />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
