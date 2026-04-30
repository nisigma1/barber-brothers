export type Language = "sq" | "en";
export type BarberId = "barber-1" | "barber-2";
export type BookingStatus = "confirmed" | "deleted";
export type SlotLockStatus = "active" | "released";

export type ApiErrorCode =
  | "CONFIGURATION_ERROR"
  | "INVALID_REQUEST"
  | "INVALID_PHONE"
  | "BOOKING_SAVE_FAILED"
  | "BOOKING_WINDOW"
  | "SHOP_CLOSED"
  | "INVALID_SLOT"
  | "BOOKING_CUTOFF"
  | "SLOT_TAKEN"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "EMAIL_EXISTS";

export interface AvailabilitySlot {
  key: string;
  localDate: string;
  localTime: string;
  endLocalTime: string;
  label: string;
  available: boolean;
}

export interface DateOption {
  localDate: string;
  label: string;
  closed: boolean;
}

export interface PublicBookingPayload {
  submissionId: string;
  barberId: BarberId;
  localDate: string;
  localTime: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  website?: string;
}

export interface BookingRecord {
  bookingId: string;
  submissionId: string;
  slotKey: string;
  barberId: BarberId;
  barberName: string;
  serviceName: string;
  serviceDurationMinutes: number;
  servicePrice: number;
  currency: string;
  localDate: string;
  localTime: string;
  endLocalTime: string;
  startUtc: string;
  endUtc: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  timezone: string;
  status: BookingStatus;
  createdAt: string;
  deletedAt: string | null;
}

export interface SlotLockRecord {
  slotKey: string;
  barberId: BarberId;
  localDate: string;
  localTime: string;
  bookingId: string;
  status: SlotLockStatus;
  startUtc: string;
  endUtc: string;
  createdAt: string;
  releasedAt: string | null;
}

export interface BookingSummary {
  bookingId: string;
  barberId: BarberId;
  barberName: string;
  serviceName: string;
  localDate: string;
  localTime: string;
  endLocalTime: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  priceLabel: string;
}

export interface StaffBookingItem extends BookingSummary {
  slotKey: string;
  startUtc: string;
  endUtc: string;
  createdAt: string;
  status: BookingStatus;
}
