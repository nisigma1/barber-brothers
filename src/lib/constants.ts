import type { BarberId, Language } from "@/lib/booking/types";

export const BRAND_NAME = "Barber Brothers";
export const SHOP_TIMEZONE = "Europe/Pristina";
export const SHOP_RUNTIME_TIMEZONE = "Europe/Tirane";
export const SHOP_CITY = "Fushe Kosove";
export const SHOP_COUNTRY = "Kosovo";
export const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/Gc8ro72mKUt859Vt5";

export const LANGUAGES: Language[] = ["sq", "en"];

export const BRAND_ASSETS = {
  logo: "/brand/logo-ui.webp",
  logoDark: "/brand/logo-dark.webp",
  logoLight: "/brand/logo-light.webp",
  brotherspace: "/brand/brotherspace-main.webp",
  gallery: [
    "/brand/gallery-1.webp",
    "/brand/gallery-2.webp",
    "/brand/gallery-3.webp",
    "/brand/gallery-4.webp",
    "/brand/gallery-5.webp",
  ],
} as const;

export const BARBERS: Array<{ id: BarberId; name: string; tagline: string; image: string }> = [
  {
    id: "barber-1",
    name: "Uraniku",
    tagline: "10 years of experience. Unique style, precise detail.",
    image: "/brand/gallery-2.webp",
  },
  {
    id: "barber-2",
    name: "Hysi",
    tagline: "10 years of experience. Classic cuts, clean finish.",
    image: "/brand/gallery-3.webp",
  },
];

export const SERVICE = {
  id: "haircut",
  name: "Haircut",
  durationMinutes: 30,
  price: 5,
  currency: "euro",
} as const;

export const WORKING_HOURS = {
  openMinutes: 9 * 60 + 30,
  closeMinutes: 20 * 60 + 30,
  openDays: [1, 2, 3, 4, 5, 6],
} as const;

export const BOOKING_WINDOW_DAYS = 7;
export const BOOKING_CUTOFF_MINUTES = 60;
export const SLOT_INTERVAL_MINUTES = 30;

export const LUNCH_BREAK = {
  startMinutes: 12 * 60 + 30,
  endMinutes: 13 * 60,
} as const;

export const CONTACT_DETAILS = {
  primaryPhone: "+38345990079",
  secondaryPhone: "+38345990003",
  instagramHandle: "brotherscutss",
  address: "Rruga Xhemail Mustafa, Fushe Kosove",
  mapsHref: GOOGLE_MAPS_URL,
};
