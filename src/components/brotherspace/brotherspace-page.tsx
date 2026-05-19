/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { BRAND_ASSETS } from "@/lib/constants";
import { translations } from "@/lib/i18n/translations";

function BilingualText({ en, sq }: { en: string; sq: string }) {
  return (
    <>
      <span className="i18n-sq">{sq}</span>
      <span className="i18n-en">{en}</span>
    </>
  );
}

export function BrotherspacePage() {
  const [mainImage, detailImage, exteriorImage] = BRAND_ASSETS.brotherspace;
  const sq = translations.sq.home;
  const en = translations.en.home;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:gap-12 lg:px-8 lg:py-14">
      <section>
        <div className="section-eyebrow-row">
          <p className="eyebrow text-[var(--color-accent)]">
            <BilingualText sq={sq.brotherspaceTitle} en={en.brotherspaceTitle} />
          </p>
          <span className="section-index">
            <BilingualText sq="01 - Ambienti" en="01 - The space" />
          </span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-10">
          <div>
            <h1 className="editorial-title">
              <BilingualText sq={sq.brotherspaceHeading} en={en.brotherspaceHeading} />
            </h1>
            <p className="editorial-italic mt-3">
              <BilingualText
                sq="Dritë e qetë. Detaje të kontrolluara."
                en="Quiet light. Controlled detail."
              />
            </p>
            <p className="section-sub">
              <BilingualText sq={sq.brotherspaceBody} en={en.brotherspaceBody} />
            </p>
            <Link href="/booking" prefetch={false} className="btn-primary mt-6 min-w-52">
              <BilingualText sq={sq.brotherspaceCta} en={en.brotherspaceCta} />
            </Link>
          </div>

          <div className="brotherspace-frame relative aspect-[4/5] overflow-hidden">
            <img
              src={mainImage}
              alt="Barber Brothers interior with modern lighting"
              className="image-fill"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <span className="editorial-caption">
              <BilingualText sq="Interier" en="Interior" /> · 01
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:gap-6">
        <div className="brotherspace-frame relative aspect-[4/3.2] overflow-hidden">
          <img
            src={detailImage}
            alt="Barber Brothers premium chair and wall detail"
            loading="lazy"
            decoding="async"
            className="image-fill"
          />
          <span className="editorial-caption">
            <BilingualText sq="Detaj" en="Detail" /> · 02
          </span>
        </div>
        <div className="brotherspace-frame relative aspect-[4/3.2] overflow-hidden">
          <img
            src={exteriorImage}
            alt="Barber Brothers exterior entrance"
            loading="lazy"
            decoding="async"
            className="image-fill"
          />
          <span className="editorial-caption">
            <BilingualText sq="Hyrja" en="Entrance" /> · 03
          </span>
        </div>
      </section>
    </div>
  );
}
