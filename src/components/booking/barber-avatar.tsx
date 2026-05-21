/* eslint-disable @next/next/no-img-element */

import type { BarberProfile } from "@/lib/barbers";

interface Props {
  barber: BarberProfile;
  className?: string;
  imageClassName?: string;
  monogramClassName?: string;
  loading?: "eager" | "lazy";
}

export function BarberAvatar({ barber, className, imageClassName, monogramClassName, loading = "lazy" }: Props) {
  if (barber.photoUrl) {
    return (
      <img
        src={barber.photoUrl}
        alt={barber.displayName}
        className={`${className ?? ""} ${imageClassName ?? ""}`.trim()}
        decoding="async"
        loading={loading}
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
