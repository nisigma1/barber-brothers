import { SERVICE, SHOP_TIMEZONE } from "../../src/lib/constants";
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
} from "../../src/lib/booking/time";
import type {
  ApiErrorCode,
  AvailabilitySlot,
  BookingRecord,
  BookingSummary,
  PublicBookingPayload,
  StaffBookingItem,
} from "../../src/lib/booking/types";
import { bookingRequestSchema, normalizeKosovoPhone } from "../../src/lib/booking/validation";
import type { BookingRow, CloudflareEnv } from "./types";

export class ApiBookingError extends Error {
  code: ApiErrorCode;
  status: number;

  constructor(code: ApiErrorCode, status = 400) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

function getDatabase(env: CloudflareEnv) {
  if (!env.DB) {
    throw new ApiBookingError("CONFIGURATION_ERROR", 500);
  }

  return env.DB;
}

function getSlotContext(payload: PublicBookingPayload) {
  if (!isDateWithinBookingWindow(payload.localDate)) {
    throw new ApiBookingError("BOOKING_WINDOW");
  }

  if (isShopClosedOnDate(payload.localDate)) {
    throw new ApiBookingError("SHOP_CLOSED");
  }

  if (!isValidSlotTime(payload.localTime)) {
    throw new ApiBookingError("INVALID_SLOT");
  }

  if (!isSlotAtLeastOneHourAhead(payload.localDate, payload.localTime)) {
    throw new ApiBookingError("BOOKING_CUTOFF");
  }

  return {
    slotKey: buildSlotKey(payload.barberId, payload.localDate, payload.localTime),
    startUtc: getSlotStartDate(payload.localDate, payload.localTime).toISOString(),
    endUtc: getSlotEndDate(payload.localDate, payload.localTime).toISOString(),
    endLocalTime: getEndLocalTime(payload.localTime),
  };
}

export function summaryFromRow(row: BookingRow): BookingSummary {
  return {
    bookingId: row.booking_id,
    barberId: row.barber_id,
    barberName: row.barber_name,
    serviceName: row.service_name,
    localDate: row.local_date,
    localTime: row.local_time,
    endLocalTime: row.end_local_time,
    customerFirstName: row.customer_first_name,
    customerLastName: row.customer_last_name,
    customerPhone: row.customer_phone,
    priceLabel: `${row.service_price} ${row.currency}`,
  };
}

export function staffItemFromRow(row: BookingRow): StaffBookingItem {
  return {
    ...summaryFromRow(row),
    slotKey: row.slot_key,
    startUtc: row.start_utc,
    endUtc: row.end_utc,
    createdAt: row.created_at,
    status: row.status,
  };
}

export async function getAvailability(env: CloudflareEnv, barberId: PublicBookingPayload["barberId"], localDate: string) {
  if (!isDateWithinBookingWindow(localDate) || isShopClosedOnDate(localDate)) {
    return [] as AvailabilitySlot[];
  }

  const db = getDatabase(env);
  const rows = await db.prepare(
    "SELECT slot_key FROM slot_locks WHERE barber_id = ? AND local_date = ? AND status = 'active'",
  )
    .bind(barberId, localDate)
    .all<{ slot_key: string }>();
  const activeSlotKeys = new Set((rows.results ?? []).map((row) => row.slot_key));

  return getAvailabilitySlots(barberId, localDate, activeSlotKeys);
}

export async function createBooking(env: CloudflareEnv, payload: unknown) {
  const db = getDatabase(env);
  const parsed = bookingRequestSchema.safeParse(payload);

  if (!parsed.success) {
    throw new ApiBookingError("INVALID_REQUEST");
  }

  const cleanPayload = parsed.data;
  const existingBooking = await db.prepare("SELECT * FROM bookings WHERE submission_id = ? AND status = 'confirmed'")
    .bind(cleanPayload.submissionId)
    .first<BookingRow>();

  if (existingBooking) {
    return summaryFromRow(existingBooking);
  }

  if (cleanPayload.website) {
    throw new ApiBookingError("INVALID_REQUEST");
  }

  const normalizedPhone = normalizeKosovoPhone(cleanPayload.phoneNumber);

  if (!normalizedPhone) {
    throw new ApiBookingError("INVALID_PHONE");
  }

  const bookingId = cleanPayload.submissionId;
  const slotContext = getSlotContext(cleanPayload);
  const nowIso = new Date().toISOString();
  const bookingRecord: BookingRecord = {
    bookingId,
    submissionId: bookingId,
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

  try {
    await db.batch([
      db.prepare(
        `INSERT INTO slot_locks (
          slot_key, barber_id, local_date, local_time, booking_id, status, start_utc, end_utc, created_at
        ) VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?)`,
      ).bind(
        bookingRecord.slotKey,
        bookingRecord.barberId,
        bookingRecord.localDate,
        bookingRecord.localTime,
        bookingRecord.bookingId,
        bookingRecord.startUtc,
        bookingRecord.endUtc,
        bookingRecord.createdAt,
      ),
      db.prepare(
        `INSERT INTO bookings (
          booking_id, submission_id, slot_key, barber_id, barber_name, service_name, service_duration_minutes,
          service_price, currency, local_date, local_time, end_local_time, start_utc, end_utc,
          customer_first_name, customer_last_name, customer_phone, timezone, status, created_at, deleted_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).bind(
        bookingRecord.bookingId,
        bookingRecord.submissionId,
        bookingRecord.slotKey,
        bookingRecord.barberId,
        bookingRecord.barberName,
        bookingRecord.serviceName,
        bookingRecord.serviceDurationMinutes,
        bookingRecord.servicePrice,
        bookingRecord.currency,
        bookingRecord.localDate,
        bookingRecord.localTime,
        bookingRecord.endLocalTime,
        bookingRecord.startUtc,
        bookingRecord.endUtc,
        bookingRecord.customerFirstName,
        bookingRecord.customerLastName,
        bookingRecord.customerPhone,
        bookingRecord.timezone,
        bookingRecord.status,
        bookingRecord.createdAt,
        bookingRecord.deletedAt,
      ),
    ]);
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";

    if (message.includes("unique") || message.includes("constraint")) {
      const retryBooking = await db.prepare("SELECT * FROM bookings WHERE submission_id = ? AND status = 'confirmed'")
        .bind(cleanPayload.submissionId)
        .first<BookingRow>();

      if (retryBooking) {
        return summaryFromRow(retryBooking);
      }

      throw new ApiBookingError("SLOT_TAKEN", 409);
    }

    throw new ApiBookingError("BOOKING_SAVE_FAILED", 500);
  }

  return {
    bookingId: bookingRecord.bookingId,
    barberId: bookingRecord.barberId,
    barberName: bookingRecord.barberName,
    serviceName: bookingRecord.serviceName,
    localDate: bookingRecord.localDate,
    localTime: bookingRecord.localTime,
    endLocalTime: bookingRecord.endLocalTime,
    customerFirstName: bookingRecord.customerFirstName,
    customerLastName: bookingRecord.customerLastName,
    customerPhone: bookingRecord.customerPhone,
    priceLabel: `${bookingRecord.servicePrice} ${bookingRecord.currency}`,
  } satisfies BookingSummary;
}

export async function listStaffBookings(env: CloudflareEnv, barberId: PublicBookingPayload["barberId"]) {
  const db = getDatabase(env);
  const rows = await db.prepare(
    "SELECT * FROM bookings WHERE status = 'confirmed' AND barber_id = ? ORDER BY start_utc ASC",
  )
    .bind(barberId)
    .all<BookingRow>();

  return (rows.results ?? []).map(staffItemFromRow);
}

export async function softDeleteBooking(env: CloudflareEnv, bookingId: string, barberId: PublicBookingPayload["barberId"]) {
  const db = getDatabase(env);
  const booking = await db.prepare(
    "SELECT * FROM bookings WHERE booking_id = ? AND barber_id = ? AND status = 'confirmed'",
  )
    .bind(bookingId, barberId)
    .first<BookingRow>();

  if (!booking) {
    throw new ApiBookingError("NOT_FOUND", 404);
  }

  const deletedAt = new Date().toISOString();

  await db.batch([
    db.prepare("UPDATE bookings SET status = 'deleted', deleted_at = ? WHERE booking_id = ? AND status = 'confirmed'")
      .bind(deletedAt, bookingId),
    db.prepare("DELETE FROM slot_locks WHERE slot_key = ?").bind(booking.slot_key),
  ]);
}
