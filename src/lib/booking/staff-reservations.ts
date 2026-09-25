export const SELF_BOOKING_FIRST_NAME = "Rezervuar";
export const SELF_BOOKING_LAST_NAME = "Per vete";

export function isSelfReservedName(firstName: string, lastName: string) {
  return firstName === SELF_BOOKING_FIRST_NAME && lastName === SELF_BOOKING_LAST_NAME;
}
