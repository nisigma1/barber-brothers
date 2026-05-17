"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { BRAND_ASSETS } from "@/lib/constants";
import { useLanguage } from "@/components/providers/language-provider";

export function BrotherspacePage() {
  const { dictionary } = useLanguage();
  const [mainImage, detailImage, exteriorImage] = BRAND_ASSETS.brotherspace;

  return (
    <div className="mx-auto flex w-full max-w-[92rem] flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="brotherspace-hero premium-card overflow-hidden p-3 sm:p-5 lg:p-7">
        <div className="brotherspace-layout">
          <div className="brotherspace-copy">
            <p className="eyebrow text-[var(--color-accent)]">{dictionary.home.brotherspaceTitle}</p>
            <h1 className="brotherspace-title mt-4 font-display uppercase leading-[0.84] tracking-[0.045em]">
              {dictionary.home.brotherspaceHeading}
            </h1>
            <p className="brotherspace-body mt-5 max-w-xl text-sm leading-7 sm:text-base">
              {dictionary.home.brotherspaceBody}
            </p>
            <Link href="/booking" prefetch={false} className="btn-primary mt-7 min-w-52">
              {dictionary.home.brotherspaceCta}
            </Link>
          </div>

          <div className="brotherspace-showcase" aria-label="Barber Brothers interior">
            <div className="brotherspace-frame brotherspace-frame-main">
              <img
                src={mainImage}
                alt="Barber Brothers interior with modern lighting"
                className="image-fill"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>

            <div className="brotherspace-frame brotherspace-frame-detail">
              <img
                src={detailImage}
                alt="Barber Brothers premium chair and wall detail"
                loading="lazy"
                decoding="async"
                className="image-fill"
              />
            </div>

            <div className="brotherspace-frame brotherspace-frame-exterior">
              <img
                src={exteriorImage}
                alt="Barber Brothers exterior entrance"
                loading="lazy"
                decoding="async"
                className="image-fill"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
