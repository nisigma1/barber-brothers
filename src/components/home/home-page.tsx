/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import {
  ACTIVE_BARBERS,
  BRAND_ASSETS,
  CONTACT_DETAILS,
  LUNCH_BREAK,
  SHOP_CITY,
  WORKING_HOURS,
} from "@/lib/constants";
import { BarberAvatar } from "@/components/booking/barber-avatar";
import { translations } from "@/lib/i18n/translations";
import { ScissorsEmblem } from "@/components/home/scissors-emblem";

function hourLabel(minutes: number) {
  const hours = Math.floor(minutes / 60).toString().padStart(2, "0");
  const nextMinutes = (minutes % 60).toString().padStart(2, "0");

  return `${hours}:${nextMinutes}`;
}

function BilingualText({ en, sq }: { en: string; sq: string }) {
  return (
    <>
      <span className="i18n-sq">{sq}</span>
      <span className="i18n-en">{en}</span>
    </>
  );
}

export function HomePage() {
  const sq = translations.sq;
  const en = translations.en;
  const workingHoursLabel = `${hourLabel(WORKING_HOURS.openMinutes)}—${hourLabel(WORKING_HOURS.closeMinutes)}`;
  const lunchBreakLabel = `${hourLabel(LUNCH_BREAK.startMinutes)}—${hourLabel(LUNCH_BREAK.endMinutes)}`;

  return (
    <div className="flex flex-1 flex-col">
      <section className="hero-section relative overflow-hidden">
        <div className="hero-ambient" />
        <div className="hero-fade" />

        <div className="hero-content relative mx-auto flex min-h-[80svh] w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8 lg:pb-20 lg:pt-10">
          <div className="hero-meta-row">
            <span className="hero-meta-index">N°01</span>
            <span className="hero-meta-sep" aria-hidden>/</span>
            <span>Fushe Kosove</span>
            <span className="hero-meta-sep" aria-hidden>/</span>
            <span className="hero-meta-nums">{workingHoursLabel}</span>
          </div>

          <div className="hero-stage mt-10 sm:mt-12 lg:mt-16">
            <div className="hero-copy">
              <ScissorsEmblem className="hero-emblem" />
              <h1 className="hero-headline-block mt-8 sm:mt-10">

                <span className="hero-headline-line">
                  <BilingualText sq={sq.home.heroHeadlinePart1} en={en.home.heroHeadlinePart1} />
                </span>
                <span className="hero-headline-line">
                  <BilingualText sq={sq.home.heroHeadlinePart2} en={en.home.heroHeadlinePart2} />
                </span>
                <span className="hero-headline-line-accent-italic">
                  <BilingualText sq={sq.home.heroHeadlinePart3} en={en.home.heroHeadlinePart3} />
                </span>
              </h1>

              <p className="hero-promise">
                <BilingualText sq={sq.home.heroPromise} en={en.home.heroPromise} />
              </p>

              <div className="hero-cta-row">
                <Link href="/booking" prefetch={false} className="btn-primary">
                  <BilingualText sq={sq.home.primaryCta} en={en.home.primaryCta} />
                </Link>
                <a
                  href={`https://instagram.com/${CONTACT_DETAILS.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  @{CONTACT_DETAILS.instagramHandle}
                </a>
              </div>
            </div>

            <div className="hero-visual hero-visual-logo">
              <img
                src={BRAND_ASSETS.heroLogo}
                alt="Barber Brothers"
                decoding="async"
                fetchPriority="high"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="manifesto-section mx-auto w-full max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="section-eyebrow-row">
          <p className="eyebrow text-[var(--color-accent)]">
            <BilingualText sq={sq.home.manifestoEyebrow} en={en.home.manifestoEyebrow} />
          </p>
          <span className="section-index">N°02</span>
        </div>

        <div className="manifesto-stack mt-10">
          <span className="manifesto-line">
            <BilingualText sq={sq.home.manifestoLine1} en={en.home.manifestoLine1} />
          </span>
          <span className="manifesto-line manifesto-line-accent">
            <BilingualText sq={sq.home.manifestoLine2} en={en.home.manifestoLine2} />
          </span>
        </div>
      </section>

      <section className="defer-render mx-auto w-full max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="section-eyebrow-row">
          <p className="eyebrow text-[var(--color-accent)]">
            <BilingualText sq={sq.home.barbersTitle} en={en.home.barbersTitle} />
          </p>
          <span className="section-index">N°03</span>
        </div>

        <h2 className="mt-6 section-headline">
          <BilingualText sq="Pesë berberë. Termine të pavarura." en="Five barbers. Independent slots." />
        </h2>

        <div className="barber-grid mt-7">
          {ACTIVE_BARBERS.map((barber, index) => (
            <Link key={barber.id} href="/booking" prefetch={false} className="barber-card">
              <div className="barber-card-image">
                <BarberAvatar
                  barber={barber}
                  imageClassName="h-full w-full image-fill"
                  monogramClassName="barber-monogram-large"
                  loading="lazy"
                />
              </div>
              <div className="barber-card-body">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="barber-card-name">{barber.displayName}</h3>
                  <span className="section-index">{(index + 1).toString().padStart(2, "0")}</span>
                </div>
                <p className="barber-card-role">{barber.role.sq}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="hours"
        className="defer-render mx-auto w-full max-w-7xl px-4 pt-16 pb-16 sm:px-6 sm:pt-24 sm:pb-20 lg:grid lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pt-32 lg:pb-28"
      >
        <div>
          <div className="section-eyebrow-row">
            <p className="eyebrow text-[var(--color-accent)]">
              <BilingualText sq={sq.home.hoursTitle} en={en.home.hoursTitle} />
            </p>
            <span className="section-index">N°04</span>
          </div>
          <h2 className="mt-6 section-headline">
            {hourLabel(WORKING_HOURS.openMinutes)}
            <span className="text-[var(--color-accent)]">—</span>
            {hourLabel(WORKING_HOURS.closeMinutes)}
          </h2>

          <div className="mt-7 grid gap-2">
            <div className="glass-strip flex min-h-12 items-center justify-between rounded-xl px-4 text-sm">
              <span>
                <BilingualText sq={sq.home.mondaySaturday} en={en.home.mondaySaturday} />
              </span>
              <span className="font-semibold text-white">{workingHoursLabel}</span>
            </div>
            <div className="glass-strip flex min-h-12 items-center justify-between rounded-xl px-4 text-sm">
              <span>
                <BilingualText sq={sq.home.lunchBreak} en={en.home.lunchBreak} />
              </span>
              <span className="font-semibold text-white">{lunchBreakLabel}</span>
            </div>
            <div className="glass-strip flex min-h-12 items-center justify-between rounded-xl px-4 text-sm">
              <span>
                <BilingualText sq={sq.home.sunday} en={en.home.sunday} />
              </span>
              <span className="font-semibold text-white/45">
                <BilingualText sq={sq.home.closed} en={en.home.closed} />
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 lg:mt-0">
          <div className="section-eyebrow-row">
            <p className="eyebrow text-[var(--color-accent)]">
              <BilingualText sq={sq.home.contactTitle} en={en.home.contactTitle} />
            </p>
            <span className="section-index">N°05</span>
          </div>
          <h2 className="mt-6 section-headline">{SHOP_CITY}</h2>
          <p className="section-sub">{CONTACT_DETAILS.address}</p>

          <div className="mt-7 grid gap-2 sm:grid-cols-2">
            <a className="tap-card" href={`tel:${CONTACT_DETAILS.primaryPhone}`}>
              <span className="eyebrow text-white/45">
                <BilingualText sq={sq.contact.primaryPhone} en={en.contact.primaryPhone} />
              </span>
              <span className="mt-1.5 block font-semibold text-white">{CONTACT_DETAILS.primaryPhone}</span>
            </a>
            <a className="tap-card" href={`tel:${CONTACT_DETAILS.secondaryPhone}`}>
              <span className="eyebrow text-white/45">
                <BilingualText sq={sq.contact.secondaryPhone} en={en.contact.secondaryPhone} />
              </span>
              <span className="mt-1.5 block font-semibold text-white">{CONTACT_DETAILS.secondaryPhone}</span>
            </a>
            <a
              className="tap-card"
              href={`https://instagram.com/${CONTACT_DETAILS.instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="eyebrow text-white/45">
                <BilingualText sq={sq.contact.instagram} en={en.contact.instagram} />
              </span>
              <span className="mt-1.5 block font-semibold text-white">@{CONTACT_DETAILS.instagramHandle}</span>
            </a>
            <a className="tap-card" href={CONTACT_DETAILS.mapsHref} target="_blank" rel="noopener noreferrer">
              <span className="eyebrow text-white/45">
                <BilingualText sq={sq.contact.maps} en={en.contact.maps} />
              </span>
              <span className="mt-1.5 flex items-center gap-1.5 font-semibold text-white">
                <BilingualText sq={sq.home.mapsCta} en={en.home.mapsCta} />
                <span aria-hidden className="text-[var(--color-accent)]">→</span>
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
