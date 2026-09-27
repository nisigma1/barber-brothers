export const SELF_BOOKING_FIRST_NAME = "Rezervuar";
export const SELF_BOOKING_LAST_NAME = "Per vete";
export const STAFF_QUICK_BOOK_PHONE = "+38300000000";

export function isSelfReservedName(firstName: string, lastName: string) {
  return firstName === SELF_BOOKING_FIRST_NAME && lastName === SELF_BOOKING_LAST_NAME;
}

export function isStaffManagedBooking(firstName: string, lastName: string, phone: string) {
  return isSelfReservedName(firstName, lastName) || phone === STAFF_QUICK_BOOK_PHONE;
}
