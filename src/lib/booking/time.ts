import { addMinutes, differenceInMinutes } from "date-fns";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";

import {
  BARBERS,
  BOOKING_CUTOFF_MINUTES,
  BOOKING_WINDOW_DAYS,
  LUNCH_BREAK,
  SERVICE,
  SHOP_RUNTIME_TIMEZONE,
  SLOT_INTERVAL_MINUTES,
  WORKING_HOURS,
} from "@/lib/constants";
import type { AvailabilitySlot, BarberId, DateOption, Language } from "@/lib/booking/types";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function getUtcMidnight(localDate: string) {
  const [year, month, day] = localDate.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function minutesToTime(minutes: number) {
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
}

function timeToMinutes(localTime: string) {
  const [hours, minutes] = localTime.split(":").map(Number);
  return hours * 60 + minutes;
}

function slotOverlapsLunchBreak(startMinutes: number) {
  const endMinutes = startMinutes + SERVICE.durationMinutes;

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

export function getTodayLocalDate(now = new Date()) {
  return formatInTimeZone(now, SHOP_RUNTIME_TIMEZONE, "yyyy-MM-dd");
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

export function generateDailySlotTimes() {
  const slots: string[] = [];

  for (
    let cursor = WORKING_HOURS.openMinutes;
    cursor + SERVICE.durationMinutes <= WORKING_HOURS.closeMinutes;
    cursor += SLOT_INTERVAL_MINUTES
  ) {
    if (!slotOverlapsLunchBreak(cursor)) {
      slots.push(minutesToTime(cursor));
    }
  }

  return slots;
}

export const DAILY_SLOT_TIMES = generateDailySlotTimes();

export function isValidSlotTime(localTime: string) {
  return DAILY_SLOT_TIMES.includes(localTime);
}

export function getEndLocalTime(localTime: string) {
  return minutesToTime(timeToMinutes(localTime) + SERVICE.durationMinutes);
}

export function getSlotStartDate(localDate: string, localTime: string) {
  return fromZonedTime(`${localDate}T${localTime}:00`, SHOP_RUNTIME_TIMEZONE);
}

export function getSlotEndDate(localDate: string, localTime: string) {
  return addMinutes(getSlotStartDate(localDate, localTime), SERVICE.durationMinutes);
}

export function isSlotAtLeastOneHourAhead(localDate: string, localTime: string, now = new Date()) {
  return differenceInMinutes(getSlotStartDate(localDate, localTime), now) >= BOOKING_CUTOFF_MINUTES;
}

export function buildSlotKey(barberId: BarberId, localDate: string, localTime: string) {
  return `${barberId}__${localDate}__${localTime.replace(":", "-")}`;
}

export function getBarberName(barberId: BarberId) {
  return BARBERS.find((barber) => barber.id === barberId)?.name ?? BARBERS[0].name;
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
          : new Intl.DateTimeFormat("en-GB", {
              weekday: "short",
              month: "short",
              day: "numeric",
              timeZone: SHOP_RUNTIME_TIMEZONE,
            }).format(fromZonedTime(`${localDate}T12:00:00`, SHOP_RUNTIME_TIMEZONE)),
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

  const sample = fromZonedTime(`${localDate}T12:00:00`, SHOP_RUNTIME_TIMEZONE);

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: SHOP_RUNTIME_TIMEZONE,
  }).format(sample);
}

export function getAvailabilitySlots(
  barberId: BarberId,
  localDate: string,
  activeSlotKeys: Set<string>,
  now = new Date(),
): AvailabilitySlot[] {
  return DAILY_SLOT_TIMES.map((localTime) => {
    const key = buildSlotKey(barberId, localDate, localTime);

    return {
      key,
      localDate,
      localTime,
      endLocalTime: getEndLocalTime(localTime),
      label: `${localTime}-${getEndLocalTime(localTime)}`,
      available: isSlotAtLeastOneHourAhead(localDate, localTime, now) && !activeSlotKeys.has(key),
    };
  });
}
