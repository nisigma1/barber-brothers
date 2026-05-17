"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BRAND_ASSETS, BRAND_NAME } from "@/lib/constants";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useLanguage } from "@/components/providers/language-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { BrandImage } from "@/components/ui/brand-image";

const navItems = [
  { href: "/", key: "home" as const },
  { href: "/ourwork", key: "ourwork" as const },
  { href: "/brotherspace", key: "brotherspace" as const },
  { href: "/booking", key: "booking" as const },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { dictionary } = useLanguage();
  const { theme } = useTheme();
  const logoSrc = theme === "light" ? BRAND_ASSETS.logoLight : BRAND_ASSETS.logoDark;

  if (pathname === "/preview") {
    return null;
  }

  return (
    <header className="site-header">
      <div className="site-header-inner mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" prefetch={false} className="brand-link flex min-h-11 min-w-0 items-center gap-3">
          <div className="brand-mark brand-mark-compact">
            <BrandImage
              src={logoSrc}
              alt={`${BRAND_NAME} logo`}
              className="h-full w-full"
              imgClassName="brand-logo-img"
              fallbackLabel="BB"
              loading="eager"
            />
          </div>
          <div className="min-w-0">
            <p className="brand-title font-display text-base uppercase tracking-[0.18em] text-white sm:text-lg">
              {BRAND_NAME}
            </p>
            <p className="brand-location hidden text-xs uppercase tracking-[0.16em] text-white/42 sm:block">
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
          <ThemeToggle />
        </div>
      </div>
      <nav className="mobile-nav mx-auto grid w-full max-w-7xl grid-cols-2 gap-2 px-4 pb-3 sm:grid-cols-4 sm:px-6 md:hidden">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={`min-h-11 rounded-full px-3 py-3 text-center text-[0.68rem] font-bold uppercase tracking-[0.08em] sm:text-xs sm:tracking-[0.12em] ${
                active ? "bg-[var(--color-accent)] text-[var(--color-ink)]" : "bg-white/[0.06] text-white/70"
              }`}
            >
              {dictionary.nav[item.key]}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
