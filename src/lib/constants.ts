import type { AddOnId, BarberId, Language, ServiceId } from "@/lib/booking/types";

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
  brotherspace: ["/brand/brotherspace-1.webp", "/brand/brotherspace-2.webp", "/brand/brotherspace-3.webp"],
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

export type ServiceDefinition = {
  id: ServiceId;
  name: Record<Language, string>;
  description: Record<Language, string>;
  durationMinutes: number;
  price: number;
  currency: "euro";
};

export type AddOnDefinition = {
  id: AddOnId;
  name: Record<Language, string>;
  description: Record<Language, string>;
  durationMinutes: 0;
  price: number;
  currency: "euro";
};

export const SERVICES: ServiceDefinition[] = [
  {
    id: "haircut",
    name: {
      sq: "Qethje flokesh",
      en: "Haircut",
    },
    description: {
      sq: "Prerje e paster me finish preciz.",
      en: "Clean cut with a precise finish.",
    },
    durationMinutes: 30,
    price: 5,
    currency: "euro",
  },
  {
    id: "beard-trim",
    name: {
      sq: "Rregullim mjekrre",
      en: "Beard trim",
    },
    description: {
      sq: "Kontur i qarte dhe forme e kontrolluar.",
      en: "Sharp lines and controlled shape.",
    },
    durationMinutes: 30,
    price: 2,
    currency: "euro",
  },
  {
    id: "all-in-one",
    name: {
      sq: "All-in-One",
      en: "All-in-One",
    },
    description: {
      sq: "Face treatment, qethje dhe rregullim mjekrre.",
      en: "Face treatment, haircut, and beard trim.",
    },
    durationMinutes: 60,
    price: 15,
    currency: "euro",
  },
];

export const ADD_ONS: AddOnDefinition[] = [
  {
    id: "premium-product",
    name: {
      sq: "Premium Product",
      en: "Premium Product",
    },
    description: {
      sq: "Produkt profesional pa kohe shtese.",
      en: "Professional product with no extra time.",
    },
    durationMinutes: 0,
    price: 6,
    currency: "euro",
  },
];

export const DEFAULT_SERVICE_ID: ServiceId = "haircut";

export function getServiceById(serviceId: ServiceId) {
  return SERVICES.find((service) => service.id === serviceId) ?? SERVICES[0];
}

export function getAddOnsByIds(addOnIds: AddOnId[] = []) {
  return ADD_ONS.filter((addOn) => addOnIds.includes(addOn.id));
}

export function getBookingService(serviceId: ServiceId, addOnIds: AddOnId[] = [], language: Language = "sq") {
  const service = getServiceById(serviceId);
  const addOns = getAddOnsByIds(addOnIds);
  const price = service.price + addOns.reduce((total, addOn) => total + addOn.price, 0);
  const addOnLabel = addOns.map((addOn) => addOn.name[language]).join(" + ");

  return {
    id: service.id,
    name: addOnLabel ? `${service.name[language]} + ${addOnLabel}` : service.name[language],
    durationMinutes: service.durationMinutes,
    price,
    currency: service.currency,
    addOns,
  };
}

export const SERVICE = {
  id: SERVICES[0].id,
  name: SERVICES[0].name.en,
  durationMinutes: SERVICES[0].durationMinutes,
  price: SERVICES[0].price,
  currency: SERVICES[0].currency,
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
