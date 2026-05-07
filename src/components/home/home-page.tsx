"use client";

import Link from "next/link";

import {
  BARBERS,
  BRAND_ASSETS,
  BRAND_NAME,
  CONTACT_DETAILS,
  SERVICE,
  SHOP_CITY,
  WORKING_HOURS,
} from "@/lib/constants";
import { useLanguage } from "@/components/providers/language-provider";
import { BrandImage } from "@/components/ui/brand-image";

function hourLabel(minutes: number) {
  const hours = Math.floor(minutes / 60).toString().padStart(2, "0");
  const nextMinutes = (minutes % 60).toString().padStart(2, "0");

  return `${hours}:${nextMinutes}`;
}

export function HomePage() {
  const { dictionary } = useLanguage();

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-white/8 bg-[linear-gradient(135deg,#050403_0%,#0b0906_48%,#050403_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(217,173,114,0.14),transparent_26rem),radial-gradient(circle_at_88%_18%,rgba(217,173,114,0.08),transparent_22rem)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,rgba(5,4,3,0.95))]" />

        <div className="relative mx-auto flex min-h-[72svh] w-full max-w-7xl flex-col justify-end px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-4xl">
            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-black/55 px-3 py-2">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-white/15">
                <BrandImage
                  src={BRAND_ASSETS.logo}
                  alt={`${BRAND_NAME} logo`}
                  className="h-full w-full"
                  imgClassName="image-fill"
                  fallbackLabel="BB"
                  fetchPriority="high"
                  loading="eager"
                />
              </div>
              <div>
                <p className="eyebrow text-[var(--color-accent)]">{dictionary.home.kicker}</p>
                <p className="text-sm text-white/62">{dictionary.home.heroSubheadline}</p>
              </div>
            </div>

            <h1 className="mt-8 max-w-4xl font-display text-[clamp(3.7rem,10vw,8rem)] uppercase leading-[0.82] tracking-[0.035em] text-white">
              {dictionary.home.heroHeadline}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">{dictionary.home.subtitle}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/booking" className="btn-primary min-w-52">
                {dictionary.home.primaryCta}
              </Link>
              <a
                href={`https://instagram.com/${CONTACT_DETAILS.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary min-w-44"
              >
                {dictionary.home.secondaryCta}
              </a>
            </div>

            <div className="mt-10 grid max-w-3xl grid-cols-3 gap-3">
              {[
                ["Online", dictionary.home.fastBooking],
                ["2", dictionary.home.barbersEyebrow],
                [hourLabel(WORKING_HOURS.openMinutes), dictionary.home.openingTime],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/52 p-4">
                  <p className="font-display text-3xl leading-none text-white sm:text-4xl">{value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/52">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-8">
        <article className="premium-card p-5 sm:p-6">
          <p className="eyebrow text-[var(--color-accent)]">{dictionary.home.serviceTitle}</p>
          <h2 className="mt-4 font-display text-5xl uppercase leading-none tracking-[0.06em] text-white">
            {dictionary.common.serviceName}
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/64">{dictionary.booking.serviceIntro}</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/22 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">{dictionary.booking.duration}</p>
              <p className="mt-1 text-lg font-semibold text-white">{SERVICE.durationMinutes} min</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/22 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">{dictionary.booking.price}</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {SERVICE.price} {SERVICE.currency}
              </p>
            </div>
          </div>

          <Link href="/booking" className="btn-primary mt-6 w-full">
            {dictionary.home.primaryCta}
          </Link>
        </article>

        <article className="premium-card p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-[var(--color-accent)]">{dictionary.home.barbersTitle}</p>
              <h2 className="mt-3 font-display text-5xl uppercase leading-none tracking-[0.06em] text-white">
                {dictionary.home.barbersEyebrow}
              </h2>
            </div>
            <Link href="/booking" className="btn-secondary">
              {dictionary.home.viewBooking}
            </Link>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {BARBERS.map((barber) => (
              <Link key={barber.id} href="/booking" className="tap-card overflow-hidden p-0">
                <div className="image-panel aspect-[1.12] rounded-none border-0">
                  <BrandImage
                    src={barber.image}
                    alt={barber.name}
                    className="h-full w-full"
                    imgClassName="image-fill"
                    fallbackLabel="BB"
                  />
                </div>
                <div className="p-4">
                  <p className="eyebrow text-white/42">{dictionary.booking.barberCardLabel}</p>
                  <h3 className="mt-2 font-display text-4xl uppercase tracking-[0.06em] text-white">{barber.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/62">
                    {barber.id === "barber-1" ? dictionary.home.barberOneTagline : dictionary.home.barberTwoTagline}
                  </p>
                  <span className="mt-4 inline-flex text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                    {dictionary.home.barbersCardCta}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="premium-card p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-[var(--color-accent)]">{dictionary.home.galleryTitle}</p>
              <h2 className="mt-3 font-display text-5xl uppercase leading-none tracking-[0.06em] text-white">
                {dictionary.home.galleryHeading}
              </h2>
            </div>
            <a
              href={`https://instagram.com/${CONTACT_DETAILS.instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              @{CONTACT_DETAILS.instagramHandle}
            </a>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {BRAND_ASSETS.gallery.map((image, index) => (
              <a
                key={image}
                href={`https://instagram.com/${CONTACT_DETAILS.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="gallery-card aspect-[0.92]"
              >
                <BrandImage
                  src={image}
                  alt={`Barber Brothers gallery image ${index + 1}`}
                  className="h-full w-full"
                  imgClassName="image-fill"
                  fallbackLabel="Work"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          <article id="hours" className="premium-card p-5 sm:p-6">
            <p className="eyebrow text-[var(--color-accent)]">{dictionary.home.hoursTitle}</p>
            <h2 className="mt-3 font-display text-5xl uppercase leading-none tracking-[0.06em] text-white">
              {hourLabel(WORKING_HOURS.openMinutes)}-{hourLabel(WORKING_HOURS.closeMinutes)}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/65">{dictionary.home.hoursBody}</p>
            <div className="mt-5 grid gap-3">
              <div className="glass-strip flex min-h-14 items-center justify-between rounded-2xl px-4">
                <span>{dictionary.home.mondaySaturday}</span>
                <span className="font-semibold text-white">
                  {hourLabel(WORKING_HOURS.openMinutes)}-{hourLabel(WORKING_HOURS.closeMinutes)}
                </span>
              </div>
              <div className="glass-strip flex min-h-14 items-center justify-between rounded-2xl px-4">
                <span>{dictionary.home.lunchBreak}</span>
                <span className="font-semibold text-white">12:30-13:00</span>
              </div>
              <div className="glass-strip flex min-h-14 items-center justify-between rounded-2xl px-4">
                <span>{dictionary.home.sunday}</span>
                <span className="font-semibold text-rose-100">{dictionary.home.closed}</span>
              </div>
            </div>
          </article>

          <article className="premium-card p-5 sm:p-6">
            <p className="eyebrow text-[var(--color-accent)]">{dictionary.home.contactTitle}</p>
            <h2 className="mt-3 font-display text-5xl uppercase leading-none tracking-[0.06em] text-white">
              {SHOP_CITY}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/65">{dictionary.home.contactBody}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a className="tap-card" href={`tel:${CONTACT_DETAILS.primaryPhone}`}>
                <span className="eyebrow text-white/42">{dictionary.contact.primaryPhone}</span>
                <span className="mt-2 block font-semibold text-white">{CONTACT_DETAILS.primaryPhone}</span>
              </a>
              <a className="tap-card" href={`tel:${CONTACT_DETAILS.secondaryPhone}`}>
                <span className="eyebrow text-white/42">{dictionary.contact.secondaryPhone}</span>
                <span className="mt-2 block font-semibold text-white">{CONTACT_DETAILS.secondaryPhone}</span>
              </a>
              <a
                className="tap-card"
                href={`https://instagram.com/${CONTACT_DETAILS.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="eyebrow text-white/42">{dictionary.contact.instagram}</span>
                <span className="mt-2 block font-semibold text-white">@{CONTACT_DETAILS.instagramHandle}</span>
              </a>
              <a className="tap-card" href={CONTACT_DETAILS.mapsHref} target="_blank" rel="noopener noreferrer">
                <span className="eyebrow text-white/42">{dictionary.contact.maps}</span>
                <span className="mt-2 block font-semibold text-white">{dictionary.home.mapsCta}</span>
              </a>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/62">
              <p className="font-semibold text-white">{dictionary.home.contactCardTitle}</p>
              <p className="mt-2">{CONTACT_DETAILS.address}</p>
            </div>
          </article>
        </div>
      </section>

      <div className="mobile-sticky-bar md:hidden">
        <Link href="/booking" className="btn-primary w-full">
          {dictionary.home.bookSticky}
        </Link>
      </div>
    </div>
  );
}
