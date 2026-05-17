"use client";

import Link from "next/link";

import { BRAND_ASSETS, CONTACT_DETAILS } from "@/lib/constants";
import { useLanguage } from "@/components/providers/language-provider";
import { BrandImage } from "@/components/ui/brand-image";

export function OurworkPage() {
  const { dictionary } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="premium-card overflow-hidden p-5 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow text-[var(--color-accent)]">{dictionary.home.galleryTitle}</p>
            <h1 className="mt-3 font-display text-[clamp(3.4rem,11vw,7rem)] uppercase leading-[0.84] tracking-[0.045em] text-white">
              {dictionary.home.galleryHeading}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              {dictionary.home.galleryBody}
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
              {dictionary.home.primaryCta}
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
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
                alt={`Barber Brothers work image ${index + 1}`}
                className="h-full w-full"
                imgClassName="image-fill"
                fallbackLabel="Work"
              />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
