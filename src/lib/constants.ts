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

export const FACE_TREATMENT_SERVICE_ID = "face-treatment" as const;

export type ServiceDefinition = {
  id: ServiceId;
  type: "main" | "package";
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
    type: "main",
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
    type: "main",
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
    id: "face-treatment",
    type: "main",
    name: {
      sq: "Tretman i fytyres",
      en: "Face treatment",
    },
    description: {
      sq: "Trajtim i qete me finish premium.",
      en: "Calm facial treatment with a premium finish.",
    },
    durationMinutes: 60,
    price: 15,
    currency: "euro",
  },
  {
    id: "all-in-one",
    type: "package",
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
export const DEFAULT_SERVICE_IDS: ServiceId[] = ["haircut"];
export const NORMAL_SERVICE_IDS: ServiceId[] = ["haircut", "beard-trim"];
export const ALL_IN_ONE_SERVICE_ID: ServiceId = "all-in-one";

export type ServiceSelectionInput = {
  serviceId?: ServiceId;
  serviceIds?: ServiceId[];
  addOnIds?: AddOnId[];
};

export function getServiceById(serviceId: ServiceId) {
  return SERVICES.find((service) => service.id === serviceId) ?? SERVICES[0];
}

export function getAddOnsByIds(addOnIds: AddOnId[] = []) {
  return ADD_ONS.filter((addOn) => addOnIds.includes(addOn.id));
}

export function getSelectedServiceIds(selection: ServiceSelectionInput = {}) {
  const rawServiceIds = selection.serviceIds?.length
    ? selection.serviceIds
    : selection.serviceId
      ? [selection.serviceId]
      : DEFAULT_SERVICE_IDS;

  return SERVICES
    .filter((service) => rawServiceIds.includes(service.id))
    .map((service) => service.id);
}

export function getSelectedAddOnIds(addOnIds: AddOnId[] = []) {
  return ADD_ONS
    .filter((addOn) => addOnIds.includes(addOn.id))
    .map((addOn) => addOn.id);
}

export function isAllInOneSelection(serviceIds: ServiceId[]) {
  return serviceIds.includes(ALL_IN_ONE_SERVICE_ID);
}

export function isFaceTreatmentSelection(serviceIds: ServiceId[]) {
  return serviceIds.includes(FACE_TREATMENT_SERVICE_ID);
}

export function isValidServiceSelection(selection: ServiceSelectionInput = {}) {
  const serviceIds = getSelectedServiceIds(selection);
  const addOnIds = getSelectedAddOnIds(selection.addOnIds);
  const hasAllInOne = isAllInOneSelection(serviceIds);
  const hasFaceTreatment = isFaceTreatmentSelection(serviceIds);
  const hasOnlyNormalServices = serviceIds.every((serviceId) => NORMAL_SERVICE_IDS.includes(serviceId));
  const hasValidFaceTreatmentCombo = serviceIds.every((serviceId) =>
    [FACE_TREATMENT_SERVICE_ID, "haircut"].includes(serviceId),
  );

  if (serviceIds.length === 0) {
    return false;
  }

  if (hasAllInOne) {
    return serviceIds.length === 1 && addOnIds.length === 0;
  }

  if (hasFaceTreatment) {
    return hasValidFaceTreatmentCombo && serviceIds.length <= 2 && addOnIds.length === 0;
  }

  return hasOnlyNormalServices;
}

export function getBookingService(
  selection: ServiceSelectionInput | ServiceId = DEFAULT_SERVICE_ID,
  addOnIdsOrLanguage: AddOnId[] | Language = [],
  maybeLanguage: Language = "sq",
) {
  const selectionInput: ServiceSelectionInput = typeof selection === "string"
    ? {
        serviceId: selection,
        addOnIds: Array.isArray(addOnIdsOrLanguage) ? addOnIdsOrLanguage : [],
      }
    : selection;
  const language = typeof addOnIdsOrLanguage === "string" ? addOnIdsOrLanguage : maybeLanguage;
  const serviceIds = getSelectedServiceIds(selectionInput);
  const addOnIds = getSelectedAddOnIds(selectionInput.addOnIds);

  if (!isValidServiceSelection({ serviceIds, addOnIds })) {
    throw new Error("INVALID_SERVICE_SELECTION");
  }

  const services = SERVICES.filter((service) => serviceIds.includes(service.id));
  const addOns = getAddOnsByIds(addOnIds);
  const isPackage = services.some((service) => service.type === "package");
  const durationMinutes = isPackage
    ? Math.max(...services.map((service) => service.durationMinutes))
    : Math.max(...services.map((service) => service.durationMinutes));
  const price = services.reduce((total, service) => total + service.price, 0)
    + addOns.reduce((total, addOn) => total + addOn.price, 0);
  const serviceLabel = services.map((service) => service.name[language]).join(" + ");
  const addOnLabel = addOns.map((addOn) => addOn.name[language]).join(" + ");

  return {
    id: services[0].id,
    serviceIds,
    addOnIds,
    name: addOnLabel ? `${serviceLabel} + ${addOnLabel}` : serviceLabel,
    durationMinutes,
    price,
    currency: services[0].currency,
    services,
    addOns,
  };
}

export function getServiceDurationMinutes(selection: ServiceSelectionInput | ServiceId = DEFAULT_SERVICE_ID) {
  return getBookingService(selection).durationMinutes;
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
