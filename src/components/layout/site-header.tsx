"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BRAND_ASSETS, BRAND_NAME } from "@/lib/constants";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useLanguage } from "@/components/providers/language-provider";
import { BrandImage } from "@/components/ui/brand-image";

const navItems = [
  { href: "/", key: "home" as const },
  { href: "/booking", key: "booking" as const },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { dictionary } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[rgba(8,7,5,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" prefetch={false} className="flex min-h-11 items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-white/12">
            <BrandImage
              src={BRAND_ASSETS.logo}
              alt={`${BRAND_NAME} logo`}
              className="h-full w-full"
              imgClassName="image-fill"
              fallbackLabel="BB"
              loading="eager"
            />
          </div>
          <div>
            <p className="font-display text-base uppercase tracking-[0.18em] text-white sm:text-lg">{BRAND_NAME}</p>
            <p className="hidden text-xs uppercase tracking-[0.16em] text-white/42 sm:block">Fushe Kosove</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex">
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
        </div>
      </div>
      <nav className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6 md:hidden">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={`min-h-11 shrink-0 rounded-full px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] ${
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
