import type { BarberId, Language } from "@/lib/booking/types";

export const BRAND_NAME = "Barber Brothers";
export const SHOP_TIMEZONE = "Europe/Pristina";
export const SHOP_RUNTIME_TIMEZONE = "Europe/Tirane";
export const SHOP_CITY = "Fushe Kosove";
export const SHOP_COUNTRY = "Kosovo";
export const MAP_COORDINATES = "42.6406311, 21.0969184";

export const LANGUAGES: Language[] = ["sq", "en"];

export const BRAND_ASSETS = {
  logo: "/brand/logo.jpg",
  heroImage: "/brand/gallery-1.jpg",
  heroAlt: "Fresh haircut at Barber Brothers",
  gallery: [
    "/brand/gallery-1.jpg",
    "/brand/gallery-2.jpg",
    "/brand/gallery-3.jpg",
  ],
} as const;

export const BARBERS: Array<{ id: BarberId; name: string; tagline: string; image: string }> = [
  {
    id: "barber-1",
    name: "Uraniku",
    tagline: "Clean fades and precise finish",
    image: "/brand/gallery-2.jpg",
  },
  {
    id: "barber-2",
    name: "Hysi",
    tagline: "Sharp texture and modern detail",
    image: "/brand/gallery-3.jpg",
  },
];

export const SERVICE = {
  id: "haircut",
  name: "Haircut",
  durationMinutes: 40,
  price: 5,
  currency: "EUR",
} as const;

export const WORKING_HOURS = {
  openMinutes: 9 * 60,
  closeMinutes: 21 * 60,
  openDays: [1, 2, 3, 4, 5, 6],
} as const;

export const BOOKING_WINDOW_DAYS = 7;
export const BOOKING_CUTOFF_MINUTES = 60;
export const SLOT_INTERVAL_MINUTES = 40;

export const CONTACT_DETAILS = {
  primaryPhone: "+38345990079",
  secondaryPhone: "+38345990003",
  instagramHandle: "brotherscutss",
  address: "Rruga Xhemail Mustafa, Fushe Kosove",
  mapsHref: `https://www.google.com/maps?q=${encodeURIComponent(MAP_COORDINATES)}`,
};
