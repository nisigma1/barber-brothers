import {
  BARBERS,
  BOOKING_CUTOFF_MINUTES,
  BOOKING_WINDOW_DAYS,
  DEFAULT_SERVICE_ID,
  LUNCH_BREAK,
  getServiceDurationMinutes,
  SHOP_RUNTIME_TIMEZONE,
  SLOT_INTERVAL_MINUTES,
  WORKING_HOURS,
  type ServiceSelectionInput,
} from "@/lib/constants";
import type { AvailabilitySlot, BarberId, DateOption, Language, ServiceId } from "@/lib/booking/types";

type SlotServiceSelection = ServiceId | ServiceId[] | ServiceSelectionInput;

function toServiceSelectionInput(selection: SlotServiceSelection = DEFAULT_SERVICE_ID): ServiceSelectionInput {
  if (Array.isArray(selection)) {
    return { serviceIds: selection };
  }

  if (typeof selection === "string") {
    return { serviceId: selection };
  }

  return selection;
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function getUtcMidnight(localDate: string) {
  const [year, month, day] = localDate.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function minutesToTime(minutes: number) {
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
}

export function timeToMinutes(localTime: string) {
  const [hours, minutes] = localTime.split(":").map(Number);
  return hours * 60 + minutes;
}

function slotOverlapsLunchBreak(startMinutes: number, durationMinutes: number) {
  const endMinutes = startMinutes + durationMinutes;

  return startMinutes < LUNCH_BREAK.endMinutes && endMinutes > LUNCH_BREAK.startMinutes;
}

const albanianWeekdays = ["Die", "Hene", "Mar", "Mer", "Enj", "Pre", "Sht"];
const albanianMonths = [
  "Jan",
  "Shk",
  "Mar",
  "Pri",
  "Maj",
  "Qer",
  "Kor",
  "Gush",
  "Sht",
  "Tet",
  "Nen",
  "Dhj",
];
const albanianLongWeekdays = [
  "E diel",
  "E Hene",
  "E Marte",
  "E Merkure",
  "E Enjte",
  "E Premte",
  "E Shtune",
];
const albanianLongMonths = [
  "Janar",
  "Shkurt",
  "Mars",
  "Prill",
  "Maj",
  "Qershor",
  "Korrik",
  "Gusht",
  "Shtator",
  "Tetor",
  "Nentor",
  "Dhjetor",
];

function formatAlbanianShortDate(localDate: string) {
  const date = new Date(getUtcMidnight(localDate));

  return `${albanianWeekdays[date.getUTCDay()]}, ${date.getUTCDate()} ${albanianMonths[date.getUTCMonth()]}`;
}

function formatAlbanianLongDate(localDate: string) {
  const date = new Date(getUtcMidnight(localDate));

  return `${albanianLongWeekdays[date.getUTCDay()]}, ${date.getUTCDate()} ${albanianLongMonths[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

const shopDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SHOP_RUNTIME_TIMEZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const englishShortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: SHOP_RUNTIME_TIMEZONE,
});

const englishLongDateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: SHOP_RUNTIME_TIMEZONE,
});

function getShopDateTimeParts(date: Date) {
  const parts = shopDateTimeFormatter.formatToParts(date);
  const partValue = (type: Intl.DateTimeFormatPartTypes) => {
    const value = parts.find((part) => part.type === type)?.value;
    return Number(value);
  };

  return {
    year: partValue("year"),
    month: partValue("month"),
    day: partValue("day"),
    hour: partValue("hour"),
    minute: partValue("minute"),
    second: partValue("second"),
  };
}

function getShopTimezoneOffsetMs(date: Date) {
  const parts = getShopDateTimeParts(date);
  const utcFromShopParts = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  return utcFromShopParts - date.getTime();
}

function getShopNoonDate(localDate: string) {
  return getSlotStartDate(localDate, "12:00");
}

export function getTodayLocalDate(now = new Date()) {
  const parts = getShopDateTimeParts(now);

  return [parts.year, pad(parts.month), pad(parts.day)].join("-");
}

export function addDaysToLocalDate(localDate: string, days: number) {
  const date = new Date(getUtcMidnight(localDate));
  date.setUTCDate(date.getUTCDate() + days);

  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
  ].join("-");
}

export function getCalendarDayDifference(fromLocalDate: string, toLocalDate: string) {
  return Math.round(
    (getUtcMidnight(toLocalDate) - getUtcMidnight(fromLocalDate)) / 86400000,
  );
}

export function isShopClosedOnDate(localDate: string) {
  const date = new Date(getUtcMidnight(localDate));
  return !WORKING_HOURS.openDays.includes(date.getUTCDay() as (typeof WORKING_HOURS.openDays)[number]);
}

export function isDateWithinBookingWindow(localDate: string, now = new Date()) {
  const today = getTodayLocalDate(now);
  const difference = getCalendarDayDifference(today, localDate);

  return difference >= 0 && difference <= BOOKING_WINDOW_DAYS;
}

export function generateDailySlotTimes(serviceSelection: SlotServiceSelection = DEFAULT_SERVICE_ID) {
  const durationMinutes = getServiceDurationMinutes(toServiceSelectionInput(serviceSelection));
  const slots: string[] = [];

  for (
    let cursor = WORKING_HOURS.openMinutes;
    cursor + durationMinutes <= WORKING_HOURS.closeMinutes;
    cursor += SLOT_INTERVAL_MINUTES
  ) {
    if (!slotOverlapsLunchBreak(cursor, durationMinutes)) {
      slots.push(minutesToTime(cursor));
    }
  }

  return slots;
}

export const DAILY_SLOT_TIMES = generateDailySlotTimes();

export function isValidSlotTime(localTime: string, serviceSelection: SlotServiceSelection = DEFAULT_SERVICE_ID) {
  return generateDailySlotTimes(serviceSelection).includes(localTime);
}

export function getEndLocalTime(localTime: string, serviceSelection: SlotServiceSelection = DEFAULT_SERVICE_ID) {
  const durationMinutes = getServiceDurationMinutes(toServiceSelectionInput(serviceSelection));

  return minutesToTime(timeToMinutes(localTime) + durationMinutes);
}

export function getSlotStartDate(localDate: string, localTime: string) {
  const [year, month, day] = localDate.split("-").map(Number);
  const [hour, minute] = localTime.split(":").map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const firstOffset = getShopTimezoneOffsetMs(utcGuess);
  const firstResult = new Date(utcGuess.getTime() - firstOffset);
  const secondOffset = getShopTimezoneOffsetMs(firstResult);

  if (secondOffset !== firstOffset) {
    return new Date(utcGuess.getTime() - secondOffset);
  }

  return firstResult;
}

export function getSlotEndDate(localDate: string, localTime: string, serviceSelection: SlotServiceSelection = DEFAULT_SERVICE_ID) {
  const durationMinutes = getServiceDurationMinutes(toServiceSelectionInput(serviceSelection));

  return new Date(getSlotStartDate(localDate, localTime).getTime() + durationMinutes * 60000);
}

export function isSlotAtLeastOneHourAhead(localDate: string, localTime: string, now = new Date()) {
  const differenceMinutes = (getSlotStartDate(localDate, localTime).getTime() - now.getTime()) / 60000;

  return differenceMinutes >= BOOKING_CUTOFF_MINUTES;
}

export function buildSlotKey(barberId: BarberId, localDate: string, localTime: string) {
  return `${barberId}__${localDate}__${localTime.replace(":", "-")}`;
}

export function getRequiredSlotTimes(localTime: string, serviceSelection: SlotServiceSelection = DEFAULT_SERVICE_ID) {
  const durationMinutes = getServiceDurationMinutes(toServiceSelectionInput(serviceSelection));
  const startMinutes = timeToMinutes(localTime);
  const slotCount = Math.ceil(durationMinutes / SLOT_INTERVAL_MINUTES);

  return Array.from({ length: slotCount }, (_, index) => minutesToTime(startMinutes + index * SLOT_INTERVAL_MINUTES));
}

export function getRequiredSlotKeys(barberId: BarberId, localDate: string, localTime: string, serviceSelection: SlotServiceSelection) {
  return getRequiredSlotTimes(localTime, serviceSelection).map((requiredTime) => buildSlotKey(barberId, localDate, requiredTime));
}

export function getBarberName(barberId: BarberId) {
  return BARBERS.find((barber) => barber.id === barberId)?.displayName ?? BARBERS[0].displayName;
}

export function getBookableDateOptions(language: Language, now = new Date()): DateOption[] {
  const today = getTodayLocalDate(now);

  return Array.from({ length: BOOKING_WINDOW_DAYS + 1 }, (_, index) => {
    const localDate = addDaysToLocalDate(today, index);
    return {
      localDate,
      closed: isShopClosedOnDate(localDate),
      label:
        language === "sq"
          ? formatAlbanianShortDate(localDate)
          : englishShortDateFormatter.format(getShopNoonDate(localDate)),
    };
  });
}

export function getFirstOpenBookableDate(now = new Date()) {
  const today = getTodayLocalDate(now);

  for (let index = 0; index <= BOOKING_WINDOW_DAYS; index += 1) {
    const localDate = addDaysToLocalDate(today, index);

    const hasBookableSlot = DAILY_SLOT_TIMES.some((localTime) => {
      return isSlotAtLeastOneHourAhead(localDate, localTime, now);
    });

    if (!isShopClosedOnDate(localDate) && hasBookableSlot) {
      return localDate;
    }
  }

  return today;
}

export function formatConfirmationDate(localDate: string, language: Language) {
  if (language === "sq") {
    return formatAlbanianLongDate(localDate);
  }

  return englishLongDateFormatter.format(getShopNoonDate(localDate));
}

export function getAvailabilitySlots(
  barberId: BarberId,
  localDate: string,
  activeSlotKeys: Set<string>,
  serviceSelection: SlotServiceSelection = DEFAULT_SERVICE_ID,
  now = new Date(),
): AvailabilitySlot[] {
  return generateDailySlotTimes(serviceSelection).map((localTime) => {
    const key = buildSlotKey(barberId, localDate, localTime);
    const requiredSlotKeys = getRequiredSlotKeys(barberId, localDate, localTime, serviceSelection);
    const hasConflict = requiredSlotKeys.some((requiredKey) => activeSlotKeys.has(requiredKey));
    const endLocalTime = getEndLocalTime(localTime, serviceSelection);

    return {
      key,
      localDate,
      localTime,
      endLocalTime,
      label: `${localTime}-${endLocalTime}`,
      available: isSlotAtLeastOneHourAhead(localDate, localTime, now) && !hasConflict,
    };
  });
}
