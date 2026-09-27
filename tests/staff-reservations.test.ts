import { describe, expect, it } from "vitest";

import {
  SELF_BOOKING_FIRST_NAME,
  SELF_BOOKING_LAST_NAME,
  STAFF_QUICK_BOOK_PHONE,
  isSelfReservedName,
  isStaffManagedBooking,
} from "@/lib/booking/staff-reservations";

describe("staff self reservations", () => {
  it("recognizes reserved-for-self booking names", () => {
    expect(isSelfReservedName(SELF_BOOKING_FIRST_NAME, SELF_BOOKING_LAST_NAME)).toBe(true);
    expect(isSelfReservedName("Arben", "Krasniqi")).toBe(false);
  });

  it("recognizes bookings created from the staff quick-book flow", () => {
    expect(isStaffManagedBooking("Arben", "Krasniqi", STAFF_QUICK_BOOK_PHONE)).toBe(true);
    expect(isStaffManagedBooking("Arben", "Krasniqi", "+38344111222")).toBe(false);
  });
});
