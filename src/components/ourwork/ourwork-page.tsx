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
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:gap-12 lg:px-8 lg:py-14">
      <section>
        <div className="section-eyebrow-row">
          <p className="eyebrow text-[var(--color-accent)]">
            <BilingualText sq={sq.galleryTitle} en={en.galleryTitle} />
          </p>
          <span className="section-index">
            <BilingualText sq="01 - Editorial" en="01 - Editorial" />
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="editorial-title">
              <BilingualText sq={sq.galleryHeading} en={en.galleryHeading} />
            </h1>
            <p className="editorial-italic mt-3">
              <BilingualText sq="Prerje precize. Sjellje e qete." en="Precise cuts. Quiet craft." />
            </p>
            <p className="section-sub">
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
      </section>

      <section className="ourwork-editorial-grid">
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
            <span className="editorial-caption">
              <BilingualText sq="Prerje" en="Cut" /> · {(index + 1).toString().padStart(2, "0")}
            </span>
          </a>
        ))}
      </section>
    </div>
  );
}
