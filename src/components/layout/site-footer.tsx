"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CONTACT_DETAILS, SHOP_CITY } from "@/lib/constants";
import { useLanguage } from "@/components/providers/language-provider";

export function SiteFooter() {
  const pathname = usePathname();
  const { dictionary } = useLanguage();

  if (pathname === "/preview") {
    return null;
  }

  const year = new Date().getFullYear();

  return (
    <footer className="site-footer-shell">
      <div className="site-footer-inner mx-auto w-full max-w-7xl">
        <div className="site-footer-brand">
          <p className="site-footer-wordmark">
            Barber<br />Brothers
          </p>
          <p className="site-footer-statement">{dictionary.home.footerStatement}</p>
          <p className="site-footer-meta">
            <strong>{SHOP_CITY}</strong>
            <br />
            {CONTACT_DETAILS.address}
          </p>
        </div>

        <div className="site-footer-col">
          <p className="site-footer-col-title">{dictionary.home.footerNavigate}</p>
          <div className="site-footer-list">
            <Link href="/" prefetch={false} className="site-footer-link">
              {dictionary.nav.home}
              <span aria-hidden className="site-footer-link-arrow">→</span>
            </Link>
            <Link href="/ourwork" prefetch={false} className="site-footer-link">
              {dictionary.nav.ourwork}
              <span aria-hidden className="site-footer-link-arrow">→</span>
            </Link>
            <Link href="/brotherspace" prefetch={false} className="site-footer-link">
              {dictionary.nav.brotherspace}
              <span aria-hidden className="site-footer-link-arrow">→</span>
            </Link>
            <Link href="/booking" prefetch={false} className="site-footer-link">
              {dictionary.nav.booking}
              <span aria-hidden className="site-footer-link-arrow">→</span>
            </Link>
          </div>
        </div>

        <div className="site-footer-col">
          <p className="site-footer-col-title">{dictionary.home.footerVisit}</p>
          <div className="site-footer-list">
            <a
              className="site-footer-link"
              href={CONTACT_DETAILS.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {dictionary.home.mapsCta}
              <span aria-hidden className="site-footer-link-arrow">→</span>
            </a>
            <a
              className="site-footer-link"
              href={`https://instagram.com/${CONTACT_DETAILS.instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{CONTACT_DETAILS.instagramHandle}
              <span aria-hidden className="site-footer-link-arrow">→</span>
            </a>
            <a className="site-footer-link" href={`tel:${CONTACT_DETAILS.primaryPhone}`}>
              {CONTACT_DETAILS.primaryPhone}
              <span aria-hidden className="site-footer-link-arrow">→</span>
            </a>
            <a className="site-footer-link" href={`tel:${CONTACT_DETAILS.secondaryPhone}`}>
              {CONTACT_DETAILS.secondaryPhone}
              <span aria-hidden className="site-footer-link-arrow">→</span>
            </a>
          </div>
        </div>
      </div>

      <div className="site-footer-strip mx-auto w-full max-w-7xl">
        <span className="site-footer-signature">{dictionary.home.footerSignature}</span>
        <span className="site-footer-copy">© {year} {dictionary.home.footerCopyright}</span>
      </div>
    </footer>
  );
}
