import type { Language } from "@/lib/booking/types";

export interface BarberProfile {
  id: string;
  slug: string;
  displayName: string;
  initials: string;
  photoUrl: string | null;
  role: { sq: string; en: string };
  shortBio: { sq: string; en: string };
  active: boolean;
  order: number;
  staffPinEnvKey: string;
}

export const BARBERS: BarberProfile[] = [
  {
    id: "barber-1",
    slug: "uraniku",
    displayName: "Uraniku",
    initials: "UR",
    photoUrl: "/brand/gallery-2.webp",
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
    photoUrl: "/brand/gallery-3.webp",
    role: { sq: "Senior Barber", en: "Senior Barber" },
    shortBio: {
      sq: "10 vite eksperience. Prerje klasike, finish i paster.",
      en: "10 years of experience. Classic cuts, clean finish.",
    },
    active: true,
    order: 2,
    staffPinEnvKey: "STAFF_PIN_BARBER_2",
  },
  {
    id: "barber-3",
    slug: "ylli",
    displayName: "Ylli",
    initials: "YL",
    photoUrl: "/brand/gallery-1.webp",
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
    photoUrl: "/brand/gallery-4.webp",
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
    photoUrl: "/brand/gallery-5.webp",
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
