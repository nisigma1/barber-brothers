"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  where,
} from "firebase/firestore";

import { SERVICE, SHOP_TIMEZONE } from "@/lib/constants";
import {
  buildSlotKey,
  getAvailabilitySlots,
  getBarberName,
  getEndLocalTime,
  getSlotEndDate,
  getSlotStartDate,
  isDateWithinBookingWindow,
  isShopClosedOnDate,
  isSlotAtLeastOneHourAhead,
  isValidSlotTime,
} from "@/lib/booking/time";
import type {
  ApiErrorCode,
  AvailabilitySlot,
  BookingRecord,
  BookingSummary,
  PublicBookingPayload,
  SlotLockRecord,
  StaffBookingItem,
} from "@/lib/booking/types";
import { bookingRequestSchema, normalizeKosovoPhone } from "@/lib/booking/validation";
import { getFirebaseClientDb } from "@/lib/firebase/client";

export class ClientBookingError extends Error {
  code: ApiErrorCode;

  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

function ensureClientDb() {
  const db = getFirebaseClientDb();

  if (!db) {
    throw new ClientBookingError("CONFIGURATION_ERROR", "Firebase is not configured.");
  }

  return db;
}

function getSlotContext(payload: PublicBookingPayload) {
  if (!isDateWithinBookingWindow(payload.localDate)) {
    throw new ClientBookingError("BOOKING_WINDOW", "Date outside booking window.");
  }

  if (isShopClosedOnDate(payload.localDate)) {
    throw new ClientBookingError("SHOP_CLOSED", "Shop is closed.");
  }

  if (!isValidSlotTime(payload.localTime)) {
    throw new ClientBookingError("INVALID_SLOT", "Invalid slot.");
  }

  if (!isSlotAtLeastOneHourAhead(payload.localDate, payload.localTime)) {
    throw new ClientBookingError("BOOKING_CUTOFF", "Slot is too soon.");
  }

  return {
    slotKey: buildSlotKey(payload.barberId, payload.localDate, payload.localTime),
    startUtc: getSlotStartDate(payload.localDate, payload.localTime).toISOString(),
    endUtc: getSlotEndDate(payload.localDate, payload.localTime).toISOString(),
    endLocalTime: getEndLocalTime(payload.localTime),
  };
}

function summaryFromRecord(record: BookingRecord): BookingSummary {
  return {
    bookingId: record.bookingId,
    barberId: record.barberId,
    barberName: record.barberName,
    serviceName: record.serviceName,
    localDate: record.localDate,
    localTime: record.localTime,
    endLocalTime: record.endLocalTime,
    customerFirstName: record.customerFirstName,
    customerLastName: record.customerLastName,
    customerPhone: record.customerPhone,
    priceLabel: `${record.servicePrice} ${record.currency}`,
  };
}

export async function getClientAvailability(barberId: PublicBookingPayload["barberId"], localDate: string) {
  if (!isDateWithinBookingWindow(localDate) || isShopClosedOnDate(localDate)) {
    return [] as AvailabilitySlot[];
  }

  const db = ensureClientDb();
  const possibleSlots = getAvailabilitySlots(barberId, localDate, new Set());
  const activeSlotKeys = new Set<string>();

  await Promise.all(
    possibleSlots.map(async (slot) => {
      const snapshot = await getDoc(doc(db, "slotLocks", slot.key));

      if (snapshot.exists() && snapshot.data().status === "active") {
        activeSlotKeys.add(slot.key);
      }
    }),
  );

  return getAvailabilitySlots(barberId, localDate, activeSlotKeys);
}

export async function createClientBooking(payload: unknown) {
  const parsed = bookingRequestSchema.safeParse(payload);

  if (!parsed.success) {
    throw new ClientBookingError("INVALID_REQUEST", "Invalid booking request.");
  }

  const cleanPayload = parsed.data;

  if (cleanPayload.website) {
    throw new ClientBookingError("INVALID_REQUEST", "Spam protection triggered.");
  }

  const normalizedPhone = normalizeKosovoPhone(cleanPayload.phoneNumber);

  if (!normalizedPhone) {
    throw new ClientBookingError("INVALID_PHONE", "Invalid phone.");
  }

  const db = ensureClientDb();
  const slotContext = getSlotContext(cleanPayload);
  const bookingId = cleanPayload.submissionId;
  const bookingRef = doc(db, "bookings", bookingId);
  const slotLockRef = doc(db, "slotLocks", slotContext.slotKey);

  return runTransaction(db, async (transaction) => {
    const slotLockSnapshot = await transaction.get(slotLockRef);

    if (
      slotLockSnapshot.exists()
      && slotLockSnapshot.data().status === "active"
      && slotLockSnapshot.data().bookingId === bookingId
    ) {
      return {
        bookingId,
        barberId: cleanPayload.barberId,
        barberName: getBarberName(cleanPayload.barberId),
        serviceName: SERVICE.name,
        localDate: cleanPayload.localDate,
        localTime: cleanPayload.localTime,
        endLocalTime: slotContext.endLocalTime,
        customerFirstName: cleanPayload.firstName.trim(),
        customerLastName: cleanPayload.lastName.trim(),
        customerPhone: normalizedPhone,
        priceLabel: `${SERVICE.price} ${SERVICE.currency}`,
      } satisfies BookingSummary;
    }

    if (slotLockSnapshot.exists() && slotLockSnapshot.data().status === "active") {
      throw new ClientBookingError("SLOT_TAKEN", "Slot is already taken.");
    }

    const nowIso = new Date().toISOString();
    const bookingRecord: BookingRecord = {
      bookingId,
      submissionId: cleanPayload.submissionId,
      slotKey: slotContext.slotKey,
      barberId: cleanPayload.barberId,
      barberName: getBarberName(cleanPayload.barberId),
      serviceName: SERVICE.name,
      serviceDurationMinutes: SERVICE.durationMinutes,
      servicePrice: SERVICE.price,
      currency: SERVICE.currency,
      localDate: cleanPayload.localDate,
      localTime: cleanPayload.localTime,
      endLocalTime: slotContext.endLocalTime,
      startUtc: slotContext.startUtc,
      endUtc: slotContext.endUtc,
      customerFirstName: cleanPayload.firstName.trim(),
      customerLastName: cleanPayload.lastName.trim(),
      customerPhone: normalizedPhone,
      timezone: SHOP_TIMEZONE,
      status: "confirmed",
      createdAt: nowIso,
      deletedAt: null,
    };
    const slotLockRecord: SlotLockRecord = {
      slotKey: slotContext.slotKey,
      barberId: cleanPayload.barberId,
      localDate: cleanPayload.localDate,
      localTime: cleanPayload.localTime,
      bookingId,
      status: "active",
      startUtc: slotContext.startUtc,
      endUtc: slotContext.endUtc,
      createdAt: nowIso,
      releasedAt: null,
    };

    transaction.set(bookingRef, bookingRecord);
    transaction.set(slotLockRef, slotLockRecord);

    return summaryFromRecord(bookingRecord);
  });
}

export async function listClientStaffBookings() {
  const db = ensureClientDb();
  const bookingsQuery = query(collection(db, "bookings"), where("status", "==", "confirmed"));
  const snapshot = await getDocs(bookingsQuery);

  return snapshot.docs
    .map((item) => {
      const record = item.data() as BookingRecord;

      return {
        ...summaryFromRecord(record),
        slotKey: record.slotKey,
        startUtc: record.startUtc,
        endUtc: record.endUtc,
        createdAt: record.createdAt,
        status: record.status,
      } satisfies StaffBookingItem;
    })
    .sort((left, right) => left.startUtc.localeCompare(right.startUtc));
}

export async function softDeleteClientBooking(booking: StaffBookingItem) {
  const db = ensureClientDb();
  const bookingRef = doc(db, "bookings", booking.bookingId);
  const slotLockRef = doc(db, "slotLocks", booking.slotKey);

  await runTransaction(db, async (transaction) => {
    const bookingSnapshot = await transaction.get(bookingRef);

    if (!bookingSnapshot.exists()) {
      throw new ClientBookingError("NOT_FOUND", "Booking not found.");
    }

    const deletedAt = new Date().toISOString();

    transaction.update(bookingRef, {
      status: "deleted",
      deletedAt,
    } satisfies Partial<BookingRecord>);

    transaction.update(slotLockRef, {
      status: "released",
      releasedAt: deletedAt,
    } satisfies Partial<SlotLockRecord>);
  });
}
