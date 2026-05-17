"use client";

import Link from "next/link";

import { BRAND_ASSETS } from "@/lib/constants";
import { useLanguage } from "@/components/providers/language-provider";
import { BrandImage } from "@/components/ui/brand-image";

export function BrotherspacePage() {
  const { dictionary } = useLanguage();
  const [mainImage, detailImage] = BRAND_ASSETS.brotherspace;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="brotherspace-hero premium-card overflow-hidden p-4 sm:p-6 lg:p-8">
        <div className="brotherspace-layout">
          <div className="brotherspace-copy">
            <p className="eyebrow text-[var(--color-accent)]">{dictionary.home.brotherspaceTitle}</p>
            <h1 className="brotherspace-title mt-4 font-display text-[clamp(3.3rem,10vw,7.2rem)] uppercase leading-[0.82] tracking-[0.05em]">
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
              <BrandImage
                src={mainImage}
                alt="Barber Brothers interior with modern lighting"
                className="h-full w-full"
                imgClassName="image-fill"
                fallbackLabel="BB"
                loading="eager"
                fetchPriority="high"
              />
            </div>

            <div className="brotherspace-frame brotherspace-frame-detail">
              <BrandImage
                src={detailImage}
                alt="Barber Brothers premium chair and wall detail"
                className="h-full w-full"
                imgClassName="image-fill"
                fallbackLabel="BB"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
