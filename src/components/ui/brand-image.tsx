"use client";

import { useState } from "react";

type BrandImageProps = {
  alt: string;
  className?: string;
  fallbackLabel?: string;
  imgClassName?: string;
  loading?: "eager" | "lazy";
  src?: string;
};

export function BrandImage({
  alt,
  className = "",
  fallbackLabel = "BB",
  imgClassName = "",
  loading = "lazy",
  src,
}: BrandImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`brand-placeholder ${className}`.trim()} aria-label={alt} role="img">
        <span>{fallbackLabel}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
      className={`${className} ${imgClassName}`.trim()}
    />
  );
}
