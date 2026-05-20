"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { BRAND_ASSETS, BRAND_NAME } from "@/lib/constants";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useLanguage } from "@/components/providers/language-provider";

const navItems = [
  { href: "/", key: "home" as const },
  { href: "/ourwork", key: "ourwork" as const },
  { href: "/brotherspace", key: "brotherspace" as const },
  { href: "/booking", key: "booking" as const },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { dictionary } = useLanguage();
  const logoSrc = BRAND_ASSETS.logoLight;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname === "/preview") {
    return null;
  }

  return (
    <header className="site-header">
      <div className="site-header-inner mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" prefetch={false} className="brand-link flex min-h-11 min-w-0 items-center gap-3">
          <div className="brand-mark brand-mark-compact">
            <img
              src={logoSrc}
              alt={`${BRAND_NAME} logo`}
              className="h-full w-full brand-logo-img"
              decoding="async"
              loading="eager"
            />
          </div>
          <div className="min-w-0">
            <p className="brand-title font-display text-base uppercase tracking-[0.18em] text-white sm:text-lg">
              {BRAND_NAME}
            </p>
            <p className="brand-location hidden text-[0.62rem] uppercase tracking-[0.22em] text-white/45 sm:block">
              Fushe Kosove
            </p>
          </div>
        </Link>

        <div className="header-actions flex shrink-0 items-center gap-2">
          <nav className="desktop-nav hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={`min-h-11 rounded-full px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-[var(--color-accent)] text-[var(--color-ink)]"
                      : "text-white/65 hover:bg-white/6 hover:text-white"
                  }`}
                >
                  {dictionary.nav[item.key]}
                </Link>
              );
            })}
          </nav>
          <LanguageSwitcher />
          <button
            type="button"
            className={`mobile-menu-button md:hidden ${mobileMenuOpen ? "mobile-menu-button-open" : ""}`}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>
      <div id="mobile-menu" className={`mobile-menu-shell md:hidden ${mobileMenuOpen ? "mobile-menu-shell-open" : ""}`}>
        <nav className="mobile-menu mx-auto grid w-full max-w-7xl gap-2 px-4 pb-4 pt-1 sm:px-6">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={`mobile-menu-link ${active ? "mobile-menu-link-active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {dictionary.nav[item.key]}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
