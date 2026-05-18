/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { BRAND_ASSETS, CONTACT_DETAILS } from "@/lib/constants";
import { translations } from "@/lib/i18n/translations";

function BilingualText({ en, sq }: { en: string; sq: string }) {
  return (
    <>
      <span className="i18n-sq">{sq}</span>
      <span className="i18n-en">{en}</span>
    </>
  );
}

export function OurworkPage() {
  const sq = translations.sq.home;
  const en = translations.en.home;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="ourwork-showcase premium-card overflow-hidden p-5 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow text-[var(--color-accent)]">
              <BilingualText sq={sq.galleryTitle} en={en.galleryTitle} />
            </p>
            <h1 className="mt-3 font-display text-[clamp(3.4rem,11vw,7rem)] uppercase leading-[0.84] tracking-[0.045em] text-white">
              <BilingualText sq={sq.galleryHeading} en={en.galleryHeading} />
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              <BilingualText sq={sq.galleryBody} en={en.galleryBody} />
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <a
              href={`https://instagram.com/${CONTACT_DETAILS.instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary min-w-44"
            >
              @{CONTACT_DETAILS.instagramHandle}
            </a>
            <Link href="/booking" prefetch={false} className="btn-primary min-w-44">
              <BilingualText sq={sq.primaryCta} en={en.primaryCta} />
            </Link>
          </div>
        </div>

        <div className="ourwork-editorial-grid mt-8">
          {BRAND_ASSETS.gallery.map((image, index) => (
            <a
              key={image}
              href={`https://instagram.com/${CONTACT_DETAILS.instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`gallery-card ourwork-editorial-item ourwork-editorial-item-${index + 1}`}
            >
              <img
                src={image}
                alt={`Barber Brothers work image ${index + 1}`}
                className="image-fill"
                decoding="async"
                fetchPriority={index === 0 ? "high" : undefined}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
