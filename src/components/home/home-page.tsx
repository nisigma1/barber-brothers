/* eslint-disable @next/next/no-img-element */
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
import { translations } from "@/lib/i18n/translations";

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

  return (
    <div className="flex flex-1 flex-col">
      <section className="hero-section relative overflow-hidden">
        <div className="hero-ambient" />
        <div className="hero-fade" />

        <div className="hero-content relative mx-auto flex min-h-[72svh] w-full max-w-7xl flex-col justify-end px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-4xl">
            <div className="hero-badge inline-flex w-full max-w-full items-center gap-3 rounded-full px-3 py-2 sm:w-fit">
              <div className="brand-mark hero-brand-mark">
                <img
                  src={BRAND_ASSETS.logoLight}
                  alt={`${BRAND_NAME} logo`}
                  className="theme-logo-light h-full w-full brand-logo-img"
                  decoding="async"
                  fetchPriority="high"
                  loading="eager"
                />
                <img
                  src={BRAND_ASSETS.logoDark}
                  alt={`${BRAND_NAME} logo`}
                  className="theme-logo-dark h-full w-full brand-logo-img"
                  decoding="async"
                  loading="eager"
                />
              </div>
              <div>
                <p className="eyebrow text-[var(--color-accent)]">
                  <BilingualText sq={sq.home.kicker} en={en.home.kicker} />
                </p>
                <p className="text-sm text-white/62">
                  <BilingualText sq={sq.home.heroSubheadline} en={en.home.heroSubheadline} />
                </p>
              </div>
            </div>

            <h1 className="hero-title mt-8 max-w-4xl whitespace-pre-line font-display text-[clamp(3.05rem,15.5vw,8rem)] uppercase leading-[0.84] tracking-[0.035em] text-white">
              <BilingualText sq={sq.home.heroHeadline} en={en.home.heroHeadline} />
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
              <BilingualText sq={sq.home.subtitle} en={en.home.subtitle} />
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/booking" prefetch={false} className="btn-primary min-w-52">
                <BilingualText sq={sq.home.primaryCta} en={en.home.primaryCta} />
              </Link>
              <a
                href={`https://instagram.com/${CONTACT_DETAILS.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary min-w-44"
              >
                <BilingualText sq={sq.home.secondaryCta} en={en.home.secondaryCta} />
              </a>
            </div>

            <div className="mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { key: "online", value: "Online", sqLabel: sq.home.fastBooking, enLabel: en.home.fastBooking },
                { key: "barbers", value: "2", sqLabel: sq.home.barbersEyebrow, enLabel: en.home.barbersEyebrow },
                {
                  key: "hours",
                  value: `${hourLabel(WORKING_HOURS.openMinutes)}-${hourLabel(WORKING_HOURS.closeMinutes)}`,
                  sqLabel: sq.home.hoursTitle,
                  enLabel: en.home.hoursTitle,
                },
              ].map((item) => (
                <div key={item.key} className="rounded-2xl border border-white/10 bg-black/52 p-4">
                  <p className="font-display text-3xl leading-none text-white sm:text-4xl">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/52">
                    <BilingualText sq={item.sqLabel} en={item.enLabel} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="defer-render mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-8">
        <article className="premium-card p-5 sm:p-6">
          <p className="eyebrow text-[var(--color-accent)]">
            <BilingualText sq={sq.home.serviceTitle} en={en.home.serviceTitle} />
          </p>
          <h2 className="mt-4 font-display text-5xl uppercase leading-none tracking-[0.06em] text-white">
            <BilingualText sq={sq.common.serviceName} en={en.common.serviceName} />
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/64">
            <BilingualText sq={sq.booking.serviceIntro} en={en.booking.serviceIntro} />
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/22 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                <BilingualText sq={sq.booking.duration} en={en.booking.duration} />
              </p>
              <p className="mt-1 text-lg font-semibold text-white">{SERVICE.durationMinutes} min</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/22 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/42">
                <BilingualText sq={sq.booking.price} en={en.booking.price} />
              </p>
              <p className="mt-1 text-lg font-semibold text-white">
                {SERVICE.price} {SERVICE.currency}
              </p>
            </div>
          </div>

          <Link href="/booking" prefetch={false} className="btn-primary mt-6 w-full">
            <BilingualText sq={sq.home.primaryCta} en={en.home.primaryCta} />
          </Link>
        </article>

        <article className="premium-card p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-[var(--color-accent)]">
                <BilingualText sq={sq.home.barbersTitle} en={en.home.barbersTitle} />
              </p>
              <h2 className="mt-3 font-display text-5xl uppercase leading-none tracking-[0.06em] text-white">
                <BilingualText sq={sq.home.barbersEyebrow} en={en.home.barbersEyebrow} />
              </h2>
            </div>
            <Link href="/booking" prefetch={false} className="btn-secondary">
              <BilingualText sq={sq.home.viewBooking} en={en.home.viewBooking} />
            </Link>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {BARBERS.map((barber) => (
              <Link key={barber.id} href="/booking" prefetch={false} className="tap-card overflow-hidden p-0">
                <div className="image-panel aspect-[1.12] rounded-none border-0">
                  <img
                    src={barber.image}
                    alt={barber.name}
                    className="h-full w-full image-fill"
                    decoding="async"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <p className="eyebrow text-white/42">
                    <BilingualText sq={sq.booking.barberCardLabel} en={en.booking.barberCardLabel} />
                  </p>
                  <h3 className="mt-2 font-display text-4xl uppercase tracking-[0.06em] text-white">{barber.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/62">
                    {barber.id === "barber-1" ? (
                      <BilingualText sq={sq.home.barberOneTagline} en={en.home.barberOneTagline} />
                    ) : (
                      <BilingualText sq={sq.home.barberTwoTagline} en={en.home.barberTwoTagline} />
                    )}
                  </p>
                  <span className="mt-4 inline-flex text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                    <BilingualText sq={sq.home.barbersCardCta} en={en.home.barbersCardCta} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="defer-render mx-auto w-full max-w-7xl px-4 py-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          <article id="hours" className="premium-card p-5 sm:p-6">
            <p className="eyebrow text-[var(--color-accent)]">
              <BilingualText sq={sq.home.hoursTitle} en={en.home.hoursTitle} />
            </p>
            <h2 className="mt-3 font-display text-5xl uppercase leading-none tracking-[0.06em] text-white">
              {hourLabel(WORKING_HOURS.openMinutes)}-{hourLabel(WORKING_HOURS.closeMinutes)}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/65">
              <BilingualText sq={sq.home.hoursBody} en={en.home.hoursBody} />
            </p>
            <div className="mt-5 grid gap-3">
              <div className="glass-strip flex min-h-14 items-center justify-between rounded-2xl px-4">
                <span>
                  <BilingualText sq={sq.home.mondaySaturday} en={en.home.mondaySaturday} />
                </span>
                <span className="font-semibold text-white">
                  {hourLabel(WORKING_HOURS.openMinutes)}-{hourLabel(WORKING_HOURS.closeMinutes)}
                </span>
              </div>
              <div className="glass-strip flex min-h-14 items-center justify-between rounded-2xl px-4">
                <span>
                  <BilingualText sq={sq.home.lunchBreak} en={en.home.lunchBreak} />
                </span>
                <span className="font-semibold text-white">12:30-13:00</span>
              </div>
              <div className="glass-strip flex min-h-14 items-center justify-between rounded-2xl px-4">
                <span>
                  <BilingualText sq={sq.home.sunday} en={en.home.sunday} />
                </span>
                <span className="font-semibold text-rose-100">
                  <BilingualText sq={sq.home.closed} en={en.home.closed} />
                </span>
              </div>
            </div>
          </article>

          <article className="premium-card p-5 sm:p-6">
            <p className="eyebrow text-[var(--color-accent)]">
              <BilingualText sq={sq.home.contactTitle} en={en.home.contactTitle} />
            </p>
            <h2 className="mt-3 font-display text-5xl uppercase leading-none tracking-[0.06em] text-white">
              {SHOP_CITY}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/65">
              <BilingualText sq={sq.home.contactBody} en={en.home.contactBody} />
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a className="tap-card" href={`tel:${CONTACT_DETAILS.primaryPhone}`}>
                <span className="eyebrow text-white/42">
                  <BilingualText sq={sq.contact.primaryPhone} en={en.contact.primaryPhone} />
                </span>
                <span className="mt-2 block font-semibold text-white">{CONTACT_DETAILS.primaryPhone}</span>
              </a>
              <a className="tap-card" href={`tel:${CONTACT_DETAILS.secondaryPhone}`}>
                <span className="eyebrow text-white/42">
                  <BilingualText sq={sq.contact.secondaryPhone} en={en.contact.secondaryPhone} />
                </span>
                <span className="mt-2 block font-semibold text-white">{CONTACT_DETAILS.secondaryPhone}</span>
              </a>
              <a
                className="tap-card"
                href={`https://instagram.com/${CONTACT_DETAILS.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="eyebrow text-white/42">
                  <BilingualText sq={sq.contact.instagram} en={en.contact.instagram} />
                </span>
                <span className="mt-2 block font-semibold text-white">@{CONTACT_DETAILS.instagramHandle}</span>
              </a>
              <a className="tap-card" href={CONTACT_DETAILS.mapsHref} target="_blank" rel="noopener noreferrer">
                <span className="eyebrow text-white/42">
                  <BilingualText sq={sq.contact.maps} en={en.contact.maps} />
                </span>
                <span className="mt-2 block font-semibold text-white">
                  <BilingualText sq={sq.home.mapsCta} en={en.home.mapsCta} />
                </span>
              </a>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/62">
              <p className="font-semibold text-white">
                <BilingualText sq={sq.home.contactCardTitle} en={en.home.contactCardTitle} />
              </p>
              <p className="mt-2">{CONTACT_DETAILS.address}</p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
