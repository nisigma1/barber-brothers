"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

import type { BarberProfile } from "@/lib/barbers";

interface Props {
  barber: BarberProfile;
  className?: string;
  imageClassName?: string;
  monogramClassName?: string;
  loading?: "eager" | "lazy";
}

export function BarberAvatar({ barber, className, imageClassName, monogramClassName, loading = "lazy" }: Props) {
  // Three-tier fallback: photoUrl -> photoUrlFallback -> monogram tile.
  // Useful when the production portrait file is being uploaded but the
  // previous gallery photo (or the monogram) should keep rendering in
  // the meantime instead of a broken image.
  const [stage, setStage] = useState<"primary" | "fallback" | "monogram">(
    barber.photoUrl ? "primary" : barber.photoUrlFallback ? "fallback" : "monogram",
  );

  function handleError() {
    if (stage === "primary" && barber.photoUrlFallback) {
      setStage("fallback");
      return;
    }
    setStage("monogram");
  }

  if (stage !== "monogram") {
    const src = stage === "primary" ? barber.photoUrl ?? "" : barber.photoUrlFallback ?? "";

    return (
      <img
        src={src}
        alt={barber.displayName}
        className={`${className ?? ""} ${imageClassName ?? ""}`.trim()}
        decoding="async"
        loading={loading}
        onError={handleError}
        style={barber.photoObjectPosition ? { objectPosition: barber.photoObjectPosition } : undefined}
      />
    );
  }

  return (
    <div
      className={`barber-monogram ${className ?? ""} ${monogramClassName ?? ""}`.trim()}
      aria-label={barber.displayName}
      role="img"
    >
      <span>{barber.initials}</span>
    </div>
  );
}
