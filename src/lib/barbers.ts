import type { Language } from "@/lib/booking/types";

export interface BarberProfile {
  id: string;
  slug: string;
  displayName: string;
  initials: string;
  photoUrl: string | null;
  /**
   * Optional fallback used by BarberAvatar when the primary photoUrl
   * fails to load (e.g. before the new portrait file is uploaded).
   */
  photoUrlFallback?: string | null;
  role: { sq: string; en: string };
  shortBio: { sq: string; en: string };
  active: boolean;
  order: number;
  staffPinEnvKey: string;
  /**
   * Weekdays (0=Sun .. 6=Sat) when the barber doesn't take online bookings.
   * Walk-in only on these days.
   */
  unavailableWeekdays?: number[];
}

export const BARBERS: BarberProfile[] = [
  {
    id: "barber-1",
    slug: "uraniku",
    displayName: "Uraniku",
    initials: "UR",
    photoUrl: "/brand/uraniku.webp",
    photoUrlFallback: "/brand/gallery-2.webp",
    role: { sq: "Senior Barber", en: "Senior Barber" },
    shortBio: {
      sq: "10 vite eksperience. Stil unik, detaj preciz.",
      en: "10 years of experience. Unique style, precise detail.",
    },
    active: true,
    order: 1,
    staffPinEnvKey: "STAFF_PIN_BARBER_1",
  },
  {
    id: "barber-2",
    slug: "hysi",
    displayName: "Hysi",
    initials: "HY",
    photoUrl: "/brand/hysi.webp",
    photoUrlFallback: "/brand/gallery-3.webp",
    role: { sq: "Senior Barber", en: "Senior Barber" },
    shortBio: {
      sq: "10 vite eksperience. Prerje klasike, finish i paster.",
      en: "10 years of experience. Classic cuts, clean finish.",
    },
    active: true,
    order: 2,
    staffPinEnvKey: "STAFF_PIN_BARBER_2",
    // Tuesday = walk-in only (no online bookings)
    unavailableWeekdays: [2],
  },
  {
    id: "barber-3",
    slug: "ylli",
    displayName: "Ylli",
    initials: "YL",
    photoUrl: "/brand/ylli.webp",
    photoUrlFallback: "/brand/gallery-1.webp",
    role: { sq: "Barber", en: "Barber" },
    shortBio: {
      sq: "Prerje moderne dhe fades te kontrolluara.",
      en: "Modern cuts and controlled fades.",
    },
    active: true,
    order: 3,
    staffPinEnvKey: "STAFF_PIN_BARBER_3",
  },
  {
    id: "barber-4",
    slug: "edi",
    displayName: "Edi",
    initials: "ED",
    photoUrl: "/brand/edi.webp",
    photoUrlFallback: "/brand/gallery-4.webp",
    role: { sq: "Barber", en: "Barber" },
    shortBio: {
      sq: "Mjekrra dhe konturim me dore te qete.",
      en: "Beard work and contouring with a steady hand.",
    },
    active: true,
    order: 4,
    staffPinEnvKey: "STAFF_PIN_BARBER_4",
  },
  {
    id: "barber-5",
    slug: "arti",
    displayName: "Arti",
    initials: "AR",
    photoUrl: "/brand/arti.webp",
    photoUrlFallback: "/brand/gallery-5.webp",
    role: { sq: "Barber", en: "Barber" },
    shortBio: {
      sq: "Stil i ri, energji e qarte.",
      en: "Fresh style, clear energy.",
    },
    active: true,
    order: 5,
    staffPinEnvKey: "STAFF_PIN_BARBER_5",
  },
];

export const ACTIVE_BARBERS = BARBERS
  .filter((barber) => barber.active)
  .sort((a, b) => a.order - b.order);

export const ACTIVE_BARBER_IDS: ReadonlyArray<string> = ACTIVE_BARBERS.map((barber) => barber.id);

export function isActiveBarberId(value: unknown): value is string {
  return typeof value === "string" && ACTIVE_BARBER_IDS.includes(value);
}

export function getBarberProfile(id: string): BarberProfile | undefined {
  return BARBERS.find((barber) => barber.id === id);
}

export function getBarberDisplayName(id: string, fallback = "Staff"): string {
  return getBarberProfile(id)?.displayName ?? fallback;
}

export function getBarberRole(id: string, language: Language): string {
  return getBarberProfile(id)?.role[language] ?? "";
}

export function getBarberShortBio(id: string, language: Language): string {
  return getBarberProfile(id)?.shortBio[language] ?? "";
}

/**
 * True if the barber doesn't accept online bookings on the local date's
 * weekday. Walk-in only for those days.
 */
export function isBarberClosedOnDate(barberId: string, localDate: string): boolean {
  const profile = getBarberProfile(barberId);

  if (!profile?.unavailableWeekdays?.length) {
    return false;
  }

  // localDate format YYYY-MM-DD; treat as UTC midnight to derive weekday.
  // This mirrors how isShopClosedOnDate does it in src/lib/booking/time.ts.
  const [year, month, day] = localDate.split("-").map((part) => Number(part));

  if (!year || !month || !day) {
    return false;
  }

  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  return profile.unavailableWeekdays.includes(weekday);
}
