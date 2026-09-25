import { describe, expect, it } from "vitest";

import {
  SELF_BOOKING_FIRST_NAME,
  SELF_BOOKING_LAST_NAME,
  isSelfReservedName,
} from "@/lib/booking/staff-reservations";

describe("staff self reservations", () => {
  it("recognizes reserved-for-self booking names", () => {
    expect(isSelfReservedName(SELF_BOOKING_FIRST_NAME, SELF_BOOKING_LAST_NAME)).toBe(true);
    expect(isSelfReservedName("Arben", "Krasniqi")).toBe(false);
  });
});
